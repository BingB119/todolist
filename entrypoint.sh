#!/bin/sh
# Docker 入口脚本：等待 MySQL 就绪后再启动应用

echo "⏳ 等待 MySQL ($DB_HOST:$DB_PORT) 就绪..."

RETRIES=30
until node -e "
  const mysql = require('mysql2/promise');
  mysql.createConnection({
    host: '${DB_HOST:-todolist-mysql}',
    port: ${DB_PORT:-3306},
    user: '${DB_USER:-todouser}',
    password: '${DB_PASSWORD}',
    database: '${DB_NAME:-todolist}',
    connectTimeout: 3000
  }).then(c => { c.end(); process.exit(0); })
    .catch(() => process.exit(1));
" 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -le 0 ]; then
    echo "⚠️  MySQL 等待超时，直接启动应用（数据库可能不可用）"
    break
  fi
  echo "  等待 MySQL... (剩余重试: ${RETRIES})"
  sleep 3
done

echo "✅ MySQL 连接成功，启动应用..."
exec node server.js
