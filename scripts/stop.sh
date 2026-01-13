#!/bin/bash

# ============== Stardust Docker 停止脚本 ==============
# 用于停止所有服务

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

# 停止服务
stop_services() {
    log_info "停止服务..."
    cd "$PROJECT_ROOT"

    # 使用 docker compose 或 docker-compose
    if docker compose version &> /dev/null; then
        docker compose down
    else
        docker-compose down
    fi

    log_success "服务已停止"
}

# 清理数据卷
clean_volumes() {
    log_warn "清理数据卷..."
    cd "$PROJECT_ROOT"

    if docker compose version &> /dev/null; then
        docker compose down -v
    else
        docker-compose down -v
    fi

    log_warn "数据卷已清理（数据库数据将被删除）"
}

# 主函数
main() {
    echo ""
    echo "=================================="
    echo "   Stardust Docker 停止脚本"
    echo "=================================="
    echo ""

    # 解析参数
    CLEAN_VOLUMES=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --clean)
                CLEAN_VOLUMES=true
                shift
                ;;
            -h|--help)
                echo "用法: $0 [选项]"
                echo ""
                echo "选项:"
                echo "  --clean      停止并清理数据卷（谨慎使用！）"
                echo "  -h, --help   显示帮助信息"
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                exit 1
                ;;
        esac
    done

    # 停止服务
    if [ "$CLEAN_VOLUMES" = true ]; then
        clean_volumes
    else
        stop_services
    fi

    echo ""
    log_success "操作完成！"
}

# 执行主函数
main "$@"
