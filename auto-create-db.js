const mysql = require('mysql2/promise');

async function autoCreateDatabase() {
  console.log('🚀 自动创建TodoList数据库');
  console.log('========================\n');

  try {
    // 使用默认配置
    const config = {
      host: 'localhost',
      user: 'root',
      password: '', // 如果没有密码就留空
      multipleStatements: true
    };

    console.log('🔄 正在连接MySQL...');
    const connection = await mysql.createConnection(config);
    console.log('✅ MySQL连接成功!');

    // 创建数据库
    console.log('\n🔄 正在创建todolist数据库...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS todolist');
    console.log('✅ 数据库创建成功!');

    // 选择数据库
    await connection.execute('USE todolist');

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
    console.log('\n📝 配置信息:');
    console.log('DB_HOST=localhost');
    console.log('DB_USER=root');
    console.log('DB_PASSWORD=你的密码');
    console.log('DB_NAME=todolist');
    console.log('JWT_SECRET=your_secret_key_here');
    console.log('PORT=3000');

    await connection.end();

  } catch (error) {
    console.error('❌ 错误:', error.message);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 提示: 访问被拒绝，请检查:');
      console.log('1. MySQL用户名和密码');
      console.log('2. MySQL服务是否正在运行');
      console.log('3. 用户是否有创建数据库的权限');
    }

    console.log('\n你可以手动创建数据库:');
    console.log('1. 打开MySQL命令行');
    console.log('2. 运行 backend/init-database.sql 中的SQL语句');
  }
}

autoCreateDatabase();