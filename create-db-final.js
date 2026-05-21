const { exec } = require('child_process');

function runSQL(command) {
  return new Promise((resolve, reject) => {
    const mysqlCmd = `"D:\\phpstudy_pro\\Extensions\\MySQL8.0.12\\bin\\mysql.exe" -u root -proot -e "${command}"`;

    exec(mysqlCmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function createDatabaseFinal() {
  console.log('🚀 最终模式创建数据库');
  console.log('========================\n');

  try {
    // 测试连接
    console.log('🔄 测试MySQL连接...');
    await runSQL('SELECT VERSION()');
    console.log('✅ MySQL连接成功!');

    // 创建数据库
    console.log('\n🔄 创建数据库...');
    await runSQL('CREATE DATABASE IF NOT EXISTS todolist');
    console.log('✅ 数据库创建成功!');

    // 创建users表
    console.log('\n🔄 创建users表...');
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS todolist.users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ');

    await runSQL(createUsersSQL);
    console.log('✅ users表创建成功!');

    // 创建todos表
    console.log('\n🔄 创建todos表...');
    const createTodosSQL = `
      CREATE TABLE IF NOT EXISTS todolist.todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES todolist.users(id) ON DELETE CASCADE
      )
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ');

    await runSQL(createTodosSQL);
    console.log('✅ todos表创建成功!');

    // 显示表
    console.log('\n📋 创建的表:');
    const tablesOutput = await runSQL('SHOW TABLES IN todolist');
    console.log(tablesOutput);

    console.log('\n🎉 数据库设置完成!');
    console.log('\n📝 配置 backend/.env:');
    console.log('DB_HOST=localhost');
    console.log('DB_USER=root');
    console.log('DB_PASSWORD=root');
    console.log('DB_NAME=todolist');
    console.log('JWT_SECRET=your_secret_key');
    console.log('PORT=3000');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.log('\n💡 手动创建步骤:');
    console.log('1. 打开命令提示符');
    console.log('2. cd /d D:\\phpstudy_pro\\Extensions\\MySQL8.0.12\\bin');
    console.log('3. mysql -u root -proot');
    console.log('4. 在MySQL中运行:');
    console.log('   CREATE DATABASE todolist;');
    console.log('   USE todolist;');
    console.log('   -- 执行 backend/init-database.sql 中的建表语句');
  }
}

createDatabaseFinal();