const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createDatabase() {
  console.log('🚀 TodoList 数据库设置');
  console.log('========================\n');

  try {
    const host = await question('MySQL主机 (默认localhost): ') || 'localhost';
    const user = await question('MySQL用户名 (默认root): ') || 'root';
    const password = await question('MySQL密码: ');
    const database = 'todolist';

    console.log('\n🔄 正在连接MySQL...');

    // 创建连接 (不指定数据库，因为可能还不存在)
    const connection = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      multipleStatements: true // 允许执行多个SQL语句
    });

    console.log('✅ MySQL连接成功!');

    // 创建数据库
    console.log('\n🔄 正在创建数据库...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log('✅ 数据库创建成功!');

    // 选择数据库
    await connection.execute(`USE \`${database}\``);

    // 创建users表
    console.log('\n🔄 正在创建users表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users表创建成功!');

    // 创建todos表
    console.log('\n🔄 正在创建todos表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ todos表创建成功!');

    // 显示创建的表
    console.log('\n📋 创建的表:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    console.log('\n🎉 数据库设置完成!');
    console.log('\n📝 请配置 backend/.env 文件:');
    console.log(`DB_HOST=${host}`);
    console.log(`DB_USER=${user}`);
    console.log(`DB_PASSWORD=${password}`);
    console.log(`DB_NAME=${database}`);
    console.log('JWT_SECRET=your_secret_key_here');
    console.log('PORT=3000');

    await connection.end();
    rl.close();

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.log('\n请检查:');
    console.log('1. MySQL服务是否正在运行');
    console.log('2. 用户名和密码是否正确');
    console.log('3. 是否有创建数据库的权限');
    rl.close();
  }
}

createDatabase();