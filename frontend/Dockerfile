# ============== 构建阶段 ==============
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci && \
    npm cache clean --force

# 复制源代码
COPY . .

# 构建 H5 应用
RUN npm run build:h5

# ============== 生产阶段 ==============
FROM nginx:alpine

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 删除 nginx 默认配置
RUN rm -rf /usr/share/nginx/html/* && \
    rm /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist/build/h5 /usr/share/nginx/html

# 复制 nginx 配置
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 创建非 root 用户
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# 切换到非 root 用户
USER nginx-user

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
