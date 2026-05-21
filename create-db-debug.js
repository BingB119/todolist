const mysql = require('mysql2/promise');

async function createDatabaseDebug() {
  console.log('🚀 调试模式创建数据库');
  console.log('========================\n');

  try {
    console.log('🔄 使用密码 "root" 连接MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      multipleStatements: true
    });
    console.log('✅ MySQL连接成功!');

    // 测试创建数据库
    console.log('\n🔄 创建数据库...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS todolist');
    console.log('✅ 数据库创建成功!');

    // 选择数据库
    await connection.execute('USE todolist');
    console.log('✅ 选择数据库成功!');

    // 创建users表
    console.log('\n🔄 创建users表...');
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await connection.execute(createUsersTable);
      console.log('✅ users表创建成功!');
    } catch (error) {
      console.log('❌ users表创建失败:', error.message);
      console.log('错误代码:', error.code);
    }

    // 创建todos表
    console.log('\n🔄 创建todos表...');
    const createTodosTable = `
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
    `;

    try {
      await connection.execute(createTodosTable);
      console.log('✅ todos表创建成功!');
    } catch (error) {
      console.log('❌ todos表创建失败:', error.message);
      console.log('错误代码:', error.code);
    }

    // 显示当前数据库中的所有表
    console.log('\n📋 当前数据库中的表:');
    const [tables] = await connection.execute('SHOW TABLES');
    if (tables.length === 0) {
      console.log('  (无表)');
    } else {
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
    }

    await connection.end();
    console.log('\n🎉 调试完成!');

  } catch (error) {
    console.error('❌ 连接或执行失败:');
    console.log('错误信息:', error.message);
    console.log('错误代码:', error.code);
    console.log('SQL状态:', error.sqlState);
  }
}

createDatabaseDebug();