#!/bin/bash

# ============== Stardust Docker 日志查看脚本 ==============
# 用于查看服务日志

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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示使用说明
show_usage() {
    echo "用法: $0 [服务名]"
    echo ""
    echo "服务名选项:"
    echo "  backend     查看后端日志"
    echo "  frontend    查看前端日志"
    echo "  mysql       查看 MySQL 日志"
    echo "  milvus      查看 Milvus 日志"
    echo "  minio       查看 MinIO 日志"
    echo "  etcd        查看 etcd 日志"
    echo "  all         查看所有服务日志（默认）"
    echo ""
    echo "示例:"
    echo "  $0              # 查看所有服务日志"
    echo "  $0 backend      # 查看后端日志"
    echo "  $0 frontend     # 查看前端日志"
    exit 0
}

# 查看日志
view_logs() {
    local service=$1
    cd "$PROJECT_ROOT"

    if docker compose version &> /dev/null; then
        if [ "$service" = "all" ] || [ -z "$service" ]; then
            docker compose logs -f
        else
            docker compose logs -f "$service"
        fi
    else
        if [ "$service" = "all" ] || [ -z "$service" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$service"
        fi
    fi
}

# 主函数
main() {
    echo ""
    echo "=================================="
    echo "   Stardust Docker 日志查看"
    echo "=================================="
    echo ""

    local service="${1:-all}"

    # 处理帮助参数
    if [ "$service" = "-h" ] || [ "$service" = "--help" ]; then
        show_usage
    fi

    # 验证服务名
    valid_services=("backend" "frontend" "mysql" "milvus" "minio" "etcd" "all" "")
    if [[ ! " ${valid_services[@]} " =~ " ${service} " ]]; then
        log_error "无效的服务名: $service"
        echo ""
        show_usage
    fi

    log_info "查看日志: $service"
    log_info "按 Ctrl+C 退出"
    echo ""

    view_logs "$service"
}

# 执行主函数
main "$@"
