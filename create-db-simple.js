const mysql = require('mysql2/promise');

async function createDatabaseSimple() {
  console.log('🚀 简单模式创建数据库');
  console.log('========================\n');

  try {
    console.log('🔄 连接MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
    });
    console.log('✅ MySQL连接成功!');

    // 创建数据库
    console.log('\n🔄 创建数据库...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS todolist');
    console.log('✅ 数据库创建成功!');

    // 选择数据库
    await connection.execute('USE todolist');
    console.log('✅ 选择数据库成功!');

    // 创建users表
    console.log('\n🔄 创建users表...');
    await connection.execute(
      'CREATE TABLE IF NOT EXISTS users (' +
      'id INT AUTO_INCREMENT PRIMARY KEY, ' +
      'username VARCHAR(50) UNIQUE NOT NULL, ' +
      'password VARCHAR(255) NOT NULL, ' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
      ')'
    );
    console.log('✅ users表创建成功!');

    // 创建todos表
    console.log('\n🔄 创建todos表...');
    await connection.execute(
      'CREATE TABLE IF NOT EXISTS todos (' +
      'id INT AUTO_INCREMENT PRIMARY KEY, ' +
      'user_id INT NOT NULL, ' +
      'title VARCHAR(255) NOT NULL, ' +
      'description TEXT, ' +
      'completed BOOLEAN DEFAULT FALSE, ' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
      'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE' +
      ')'
    );
    console.log('✅ todos表创建成功!');

    // 显示创建的表
    console.log('\n📋 创建的表:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // 显示表结构
    console.log('\n📋 users表结构:');
    const [userColumns] = await connection.execute('DESCRIBE users');
    userColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type}`);
    });

    console.log('\n📋 todos表结构:');
    const [todoColumns] = await connection.execute('DESCRIBE todos');
    todoColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type}`);
    });

    console.log('\n🎉 数据库设置完成!');
    console.log('\n📝 配置 backend/.env 文件:');
    console.log('DB_HOST=localhost');
    console.log('DB_USER=root');
    console.log('DB_PASSWORD=root');
    console.log('DB_NAME=todolist');
    console.log('JWT_SECRET=your_secret_key_here');
    console.log('PORT=3000');

    await connection.end();

  } catch (error) {
    console.error('❌ 错误:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 访问被拒绝，请检查用户名和密码');
    } else if (error.code === 'ER_CANT_CREATE_TABLE') {
      console.log('\n💡 无法创建表，可能是权限问题');
    }
  }
}

createDatabaseSimple();