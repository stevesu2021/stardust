#!/bin/bash

# ============== Stardust Docker 重启脚本 ==============
# 用于重启所有服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 主函数
main() {
    echo ""
    echo "=================================="
    echo "   Stardust Docker 重启脚本"
    echo "=================================="
    echo ""

    # 解析参数
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
                echo "  --rebuild    重新构建并重启"
                echo "  -h, --help   显示帮助信息"
                exit 0
                ;;
            *)
                echo "未知参数: $1"
                exit 1
                ;;
        esac
    done

    # 停止服务
    log_info "停止服务..."
    "$SCRIPT_DIR/stop.sh"

    # 启动服务
    if [ "$REBUILD" = true ]; then
        log_info "重新构建并启动..."
        "$SCRIPT_DIR/start.sh" --rebuild
    else
        log_info "启动服务..."
        "$SCRIPT_DIR/start.sh"
    fi
}

# 执行主函数
main "$@"
