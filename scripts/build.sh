#!/bin/bash

# ============== Stardust Docker 构建脚本 ==============
# 用于构建所有 Docker 镜像

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

# 检查 Docker 是否安装
check_docker() {
    log_info "检查 Docker 是否安装..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    log_success "Docker 已安装"
}

# 检查 Docker Compose 是否安装
check_docker_compose() {
    log_info "检查 Docker Compose 是否安装..."
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    log_success "Docker Compose 已安装"
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

# 清理旧镜像
clean_old_images() {
    log_info "清理旧的构建缓存..."
    cd "$PROJECT_ROOT"
    docker-compose build --no-cache 2>/dev/null || docker compose build --no-cache
    log_success "清理完成"
}

# 构建镜像
build_images() {
    log_info "开始构建 Docker 镜像..."
    cd "$PROJECT_ROOT"

    # 使用 docker compose 或 docker-compose
    if docker compose version &> /dev/null; then
        docker compose build
    else
        docker-compose build
    fi

    log_success "镜像构建完成"
}

# 显示构建结果
show_result() {
    log_info "镜像列表:"
    docker images | grep stardust || true
}

# 主函数
main() {
    echo ""
    echo "=================================="
    echo "   Stardust Docker 构建脚本"
    echo "=================================="
    echo ""

    # 解析参数
    CLEAN_CACHE=false
    SKIP_ENV_CHECK=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --clean)
                CLEAN_CACHE=true
                shift
                ;;
            --skip-env)
                SKIP_ENV_CHECK=true
                shift
                ;;
            -h|--help)
                echo "用法: $0 [选项]"
                echo ""
                echo "选项:"
                echo "  --clean      清理构建缓存后重新构建"
                echo "  --skip-env   跳过 .env 文件检查"
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
    check_docker
    check_docker_compose

    if [ "$SKIP_ENV_CHECK" = false ]; then
        check_env_file
    fi

    # 清理缓存（如果需要）
    if [ "$CLEAN_CACHE" = true ]; then
        clean_old_images
    fi

    # 构建镜像
    build_images

    # 显示结果
    show_result

    echo ""
    log_success "构建完成！使用 './scripts/start.sh' 启动服务"
    echo ""
}

# 执行主函数
main "$@"
