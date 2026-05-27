#!/bin/bash
# ============================================================
# ECS 服务器一键初始化脚本
# 用途：首次部署前在阿里云 ECS 上执行一次
# 执行方法：bash server-init.sh
# ============================================================

set -e  # 遇到错误立即退出

# ---- 颜色输出 ----
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo "======================================================"
echo "  TodoList ECS 服务器初始化脚本"
echo "======================================================"
echo ""

# ============================================================
# ⚙️  配置区域 —— 只需修改这里！
# ============================================================
DB_ROOT_PASSWORD="Root@2026Todolist"    # MySQL root 密码（自定义）
DB_USER_PASSWORD="Todo@2026User"        # todouser 密码（必须与 GitHub Secrets DB_PASSWORD 一致）
# ============================================================

# ---- 步骤 1：更新系统 ----
log "更新系统包..."
apt-get update -y -qq
apt-get install -y -qq curl wget gnupg ca-certificates lsb-release ufw

# ---- 步骤 2：安装 Docker ----
if command -v docker &> /dev/null; then
    warn "Docker 已安装 ($(docker --version))，跳过安装"
else
    log "安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log "Docker 安装完成: $(docker --version)"
fi

# ---- 步骤 3：创建 Docker 网络 ----
if docker network ls | grep -q "todolist-net"; then
    warn "todolist-net 网络已存在，跳过"
else
    docker network create todolist-net
    log "创建 Docker 网络 todolist-net"
fi

# ---- 步骤 4：启动 MySQL 容器 ----
if docker ps -a --format '{{.Names}}' | grep -q "^todolist-mysql$"; then
    warn "todolist-mysql 容器已存在，跳过"
    docker start todolist-mysql 2>/dev/null || true
else
    log "拉取 MySQL 8.0 镜像..."
    docker pull mysql:8.0

    log "启动 MySQL 容器..."
    mkdir -p /data/mysql

    docker run -d \
      --name todolist-mysql \
      --restart always \
      --network todolist-net \
      -e MYSQL_ROOT_PASSWORD="${DB_ROOT_PASSWORD}" \
      -e MYSQL_DATABASE=todolist \
      -e MYSQL_USER=todouser \
      -e MYSQL_PASSWORD="${DB_USER_PASSWORD}" \
      -v /data/mysql:/var/lib/mysql \
      mysql:8.0 \
      --character-set-server=utf8mb4 \
      --collation-server=utf8mb4_unicode_ci

    log "等待 MySQL 启动（30秒）..."
    sleep 30
fi

# ---- 步骤 5：验证 MySQL ----
log "验证 MySQL 连接..."
if docker exec todolist-mysql mysql -u todouser -p"${DB_USER_PASSWORD}" -e "SHOW DATABASES;" 2>/dev/null | grep -q "todolist"; then
    log "MySQL 验证通过 ✓"
else
    err "MySQL 连接失败！请检查容器日志: docker logs todolist-mysql"
fi

# ---- 步骤 6：生成 SSH 部署密钥 ----
KEY_PATH="/root/.ssh/github_deploy"
if [ -f "${KEY_PATH}" ]; then
    warn "SSH 部署密钥已存在，跳过生成"
else
    log "生成 SSH 部署密钥..."
    mkdir -p /root/.ssh
    chmod 700 /root/.ssh
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f "${KEY_PATH}" -N ""
    cat "${KEY_PATH}.pub" >> /root/.ssh/authorized_keys
    chmod 600 /root/.ssh/authorized_keys
    log "SSH 密钥生成完成"
fi

# ---- 步骤 7：配置防火墙 ----
log "配置防火墙..."
ufw allow 22/tcp   2>/dev/null || true
ufw allow 3000/tcp 2>/dev/null || true
ufw --force enable 2>/dev/null || true
log "防火墙已放行 22（SSH）和 3000（应用）端口"

# ============================================================
# 输出结果
# ============================================================
echo ""
echo "======================================================"
echo -e "${GREEN}  🎉 服务器初始化完成！${NC}"
echo "======================================================"
echo ""
echo -e "${YELLOW}【重要】请立即将以下私钥内容复制到 GitHub Secrets（ALIYUN_ECS_SSH_KEY）：${NC}"
echo "------------------------------------------------------"
cat "${KEY_PATH}"
echo "------------------------------------------------------"
echo ""
echo -e "${YELLOW}【重要】将以下密码填入 GitHub Secrets（DB_PASSWORD）：${NC}"
echo "  DB_PASSWORD = ${DB_USER_PASSWORD}"
echo ""
echo "======================================================"
echo "  MySQL 容器：todolist-mysql  ✓"
echo "  Docker 网络：todolist-net   ✓"
echo "  SSH 密钥：/root/.ssh/github_deploy  ✓"
echo "  应用端口：3000  ✓"
echo "======================================================"
