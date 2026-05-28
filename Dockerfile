# ============================================================
# 阶段 1：构建前端 (Vue3 + Vite)
# ============================================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 先复制 package 文件，利用 Docker 层缓存
COPY frontend/package*.json ./
RUN npm install

# 复制前端源码并构建
COPY frontend/ ./
RUN npm run build


# ============================================================
# 阶段 2：生产镜像 (Node.js 后端 + 托管前端静态文件)
# ============================================================
FROM node:18-alpine AS production

# 安装时区工具（可选，保证日志时间正确）
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

WORKDIR /app

# ---- 安装后端依赖 ----
COPY backend/package*.json ./
RUN npm install --omit=dev

# ---- 复制后端源码 ----
COPY backend/ ./

# ---- 将前端 dist 放到后端可托管的目录 ----
COPY --from=frontend-builder /app/frontend/dist ./public

# ---- 让后端托管前端静态文件 ----
# server.js 启动时会自动 serve public/ 目录（见下方注释说明）

# ---- 复制启动脚本 ----
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

# 健康检查（用 node 原生发请求，不依赖外部工具）
HEALTHCHECK --interval=30s --timeout=10s --start-period=50s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/',r=>{process.exit(r.statusCode<500?0:1)}).on('error',()=>process.exit(1))"

ENTRYPOINT ["/app/entrypoint.sh"]
