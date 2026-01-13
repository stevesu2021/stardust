# Stardust Docker 部署指南

本文档介绍如何使用 Docker 部署 Stardust 星契集项目。

## 目录结构

```
stardust/
├── backend/
│   └── Dockerfile              # 后端镜像构建文件
├── frontend/
│   ├── Dockerfile              # 前端镜像构建文件
│   └── docker/
│       └── nginx.conf          # Nginx 配置
├── docker/
│   └── mysql/
│       └── init/               # MySQL 初始化脚本目录
├── scripts/
│   ├── build.sh                # 构建脚本
│   ├── start.sh                # 启动脚本
│   ├── stop.sh                 # 停止脚本
│   ├── restart.sh              # 重启脚本
│   ├── logs.sh                 # 日志查看脚本
│   └── status.sh               # 状态查看脚本
├── docker-compose.yml          # Docker Compose 配置
└── .env                        # 环境变量配置
```

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并配置必要的 API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# JWT 配置
JWT_SECRET=your-secret-key-change-in-production

# 阿里云通义千问视觉大模型配置
DASHSCOPE_API_KEY=your-dashscope-api-key

# 小米咪莫 AI 大模型配置
XIAOMIMIMO_API_KEY=your-xiaomimimo-api-key
```

### 2. 构建镜像

```bash
./scripts/build.sh
```

选项：
- `--clean`  清理构建缓存后重新构建
- `--skip-env` 跳过 .env 文件检查

### 3. 启动服务

```bash
./scripts/start.sh
```

选项：
- `--rebuild` 重新构建并启动

### 4. 查看状态

```bash
./scripts/status.sh
```

## 服务说明

| 服务 | 容器名 | 端口 | 说明 |
|------|--------|------|------|
| 前端 H5 | stardust_frontend | 8080 | Web 前端服务 |
| 后端 API | stardust_backend | 3000 | Nest.js API 服务 |
| MySQL | stardust_mysql | 3306 | 数据库 |
| Milvus | stardust_milvus | 19530, 9091 | 向量数据库 |
| MinIO | stardust_minio | 9000, 9001 | 对象存储 |
| etcd | stardust_etcd | 2379, 2380 | Milvus 依赖 |

## 常用命令

### 服务管理

```bash
# 构建镜像
./scripts/build.sh

# 启动服务
./scripts/start.sh

# 停止服务
./scripts/stop.sh

# 重启服务
./scripts/restart.sh

# 重启并重新构建
./scripts/restart.sh --rebuild
```

### 日志查看

```bash
# 查看所有服务日志
./scripts/logs.sh

# 查看指定服务日志
./scripts/logs.sh backend
./scripts/logs.sh frontend
./scripts/logs.sh mysql
./scripts/logs.sh milvus
./scripts/logs.sh minio
./scripts/logs.sh etcd
```

### 状态查看

```bash
# 查看服务状态
./scripts/status.sh

# 直接使用 docker-compose
docker-compose ps
docker-compose top
```

### 进入容器

```bash
# 进入后端容器
docker exec -it stardust_backend sh

# 进入前端容器
docker exec -it stardust_frontend sh

# 进入 MySQL 容器
docker exec -it stardust_mysql mysql -u stardust_user -pstardust_pass123 stardust

# 进入 MinIO 容器
docker exec -it stardust_minio sh
```

## 数据持久化

所有数据都存储在 Docker 卷中：

- `mysql_data` - MySQL 数据
- `etcd_data` - etcd 数据
- `minio_data` - MinIO 对象存储数据
- `milvus_data` - Milvus 向量数据

### 备份数据

```bash
# 备份 MySQL
docker exec stardust_mysql mysqldump -u stardust_user -pstardust_pass123 stardust > backup.sql

# 备份卷
docker run --rm -v stardust_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz -C /data .
```

### 恢复数据

```bash
# 恢复 MySQL
docker exec -i stardust_mysql mysql -u stardust_user -pstardust_pass123 stardust < backup.sql

# 恢复卷
docker run --rm -v stardust_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql-backup.tar.gz -C /data
```

## 清理数据

警告：以下命令将删除所有数据！

```bash
# 停止并清理所有数据
./scripts/stop.sh --clean

# 或使用 docker-compose
docker-compose down -v
```

## 故障排除

### 端口冲突

如果端口被占用，修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8081:8080"  # 将前端端口改为 8081
```

### 容器无法启动

查看日志排查问题：

```bash
./scripts/logs.sh backend
```

### 重新构建镜像

如果需要完全重新构建：

```bash
./scripts/build.sh --clean
./scripts/start.sh --rebuild
```

### MinIO 签名错误

如果后端日志中出现 MinIO 签名错误，检查 `.env` 中的 MinIO 配置：

```env
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## 生产环境部署

### 修改配置

1. 修改 `docker-compose.yml` 中的 `restart` 策略为 `always`
2. 修改 `.env` 中的密钥和密码
3. 配置反向代理（如 Nginx）
4. 启用 HTTPS

### 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## 访问地址

服务启动后，可通过以下地址访问：

- **前端 H5**: http://localhost:8080
- **后端 API**: http://localhost:3000
- **MinIO 控制台**: http://localhost:9001 (用户名/密码: minioadmin/minioadmin)
- **MinIO API**: http://localhost:9000

## 技术支持

如有问题，请参考：
- [开发指南](./开发指南.md)
- [部署指南](./部署指南.md)
- [API快速参考](./API快速参考.md)
