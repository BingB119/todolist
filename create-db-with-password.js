const mysql = require('mysql2/promise');

async function createDatabaseWithPassword() {
  console.log('🚀 创建TodoList数据库');
  console.log('========================\n');

  // phpStudy 默认密码通常是空或者 root
  const passwords = ['', 'root', '123456', 'password'];

  for (const password of passwords) {
    try {
      console.log(`🔄 尝试密码: "${password || '(空)'}"`);

      const config = {
        host: 'localhost',
        user: 'root',
        password: password,
        multipleStatements: true,
        connectTimeout: 5000
      };

      const connection = await mysql.createConnection(config);
      console.log('✅ 连接成功!');

      // 创建数据库
      await connection.execute('CREATE DATABASE IF NOT EXISTS todolist');
      await connection.execute('USE todolist');

      // 创建users表
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建todos表
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

      console.log('\n🎉 数据库创建成功!');
      console.log('\n📋 创建的表:');
      const [tables] = await connection.execute('SHOW TABLES');
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });

      console.log('\n📝 配置 backend/.env:');
      console.log('DB_HOST=localhost');
      console.log('DB_USER=root');
      console.log(`DB_PASSWORD=${password}`);
      console.log('DB_NAME=todolist');
      console.log('JWT_SECRET=your_secret_key');
      console.log('PORT=3000');

      await connection.end();
      return;

    } catch (error) {
      console.log(`❌ 密码 "${password || '(空)'}" 失败`);
      if (password === passwords[passwords.length - 1]) {
        console.log('\n💡 所有常见密码都尝试失败');
        console.log('请手动创建数据库:');
        console.log('1. 打开MySQL命令行');
        console.log('2. 运行以下命令:');
        console.log('   CREATE DATABASE todolist;');
        console.log('   USE todolist;');
        console.log('   -- 然后执行 backend/init-database.sql 中的建表语句');
      }
    }
  }
}

createDatabaseWithPassword();