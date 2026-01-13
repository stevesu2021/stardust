#!/bin/bash

# ============== Stardust Docker 启动脚本 ==============
# 用于启动所有服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否运行
check_docker_running() {
    log_info "检查 Docker 是否运行..."
    if ! docker info &> /dev/null; then
        log_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    log_success "Docker 正在运行"
}

# 检查 .env 文件
check_env_file() {
    log_info "检查环境配置文件..."
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        log_warn ".env 文件不存在，从 .env.example 复制..."
        if [ -f "$PROJECT_ROOT/.env.example" ]; then
            cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
            log_warn "请编辑 .env 文件，配置必要的 API Key"
        else
            log_error ".env.example 文件不存在"
            exit 1
        fi
    else
        log_success ".env 文件已存在"
    fi
}

# 创建必要的目录
create_directories() {
    log_info "创建必要的目录..."
    mkdir -p "$PROJECT_ROOT/docker/mysql/init"
    log_success "目录创建完成"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    cd "$PROJECT_ROOT"

    # 使用 docker compose 或 docker-compose
    if docker compose version &> /dev/null; then
        docker compose up -d
    else
        docker-compose up -d
    fi

    log_success "服务启动完成"
}

# 等待服务就绪
wait_for_services() {
    log_info "等待服务就绪..."

    local max_attempts=60
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        local all_ready=true

        # 检查后端服务
        if ! docker exec stardust_backend wget -q --spider http://localhost:3000/api 2>/dev/null; then
            all_ready=false
        fi

        # 检查前端服务
        if ! docker exec stardust_frontend curl -f -s http://localhost:8080/ > /dev/null 2>&1; then
            all_ready=false
        fi

        if [ "$all_ready" = true ]; then
            log_success "所有服务已就绪"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    echo ""
    log_warn "部分服务可能仍在启动中，请稍后检查"
}

# 显示服务状态
show_status() {
    echo ""
    log_info "服务状态:"
    echo ""

    cd "$PROJECT_ROOT"
    if docker compose version &> /dev/null; then
        docker compose ps
    else
        docker-compose ps
    fi

    echo ""
    log_info "服务访问地址:"
    echo ""
    echo "  前端 H5:    http://localhost:8080"
    echo "  后端 API:   http://localhost:3000"
    echo "  MinIO 控制台: http://localhost:9001"
    echo "  MinIO API:   http://localhost:9000"
    echo ""
}

# 显示日志提示
show_logs_hint() {
    log_info "查看日志命令:"
    echo ""
    echo "  所有服务:    docker-compose logs -f"
    echo "  后端:        docker-compose logs -f backend"
    echo "  前端:        docker-compose logs -f frontend"
    echo "  MySQL:       docker-compose logs -f mysql"
    echo ""
}

# 主函数
main() {
    echo ""
    echo "=================================="
    echo "   Stardust Docker 启动脚本"
    echo "=================================="
    echo ""

    # 解析参数
    DETACH=true
    REBUILD=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --rebuild)
                REBUILD=true
                shift
                ;;
            -h|--help)
                echo "用法: $0 [选项]"
                echo ""
                echo "选项:"
                echo "  --rebuild    重新构建并启动"
                echo "  -h, --help   显示帮助信息"
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                exit 1
                ;;
        esac
    done

    # 执行检查
    check_docker_running
    check_env_file
    create_directories

    # 重新构建（如果需要）
    if [ "$REBUILD" = true ]; then
        log_info "重新构建镜像..."
        cd "$PROJECT_ROOT"
        if docker compose version &> /dev/null; then
            docker compose build
        else
            docker-compose build
        fi
    fi

    # 启动服务
    start_services

    # 等待服务就绪
    wait_for_services

    # 显示状态
    show_status
    show_logs_hint

    log_success "启动完成！"
}

# 执行主函数
main "$@"
