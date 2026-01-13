#!/bin/bash

# ============== Stardust Docker 状态查看脚本 ==============
# 用于查看服务运行状态

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

# 检查服务健康状态
check_health() {
    local container_name=$1
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "none")

    case $health_status in
        healthy)
            echo -e "${GREEN}●${NC} $container_name: ${GREEN}健康${NC}"
            ;;
        unhealthy)
            echo -e "${RED}●${NC} $container_name: ${RED}不健康${NC}"
            ;;
        starting)
            echo -e "${YELLOW}●${NC} $container_name: ${YELLOW}启动中${NC}"
            ;;
        none)
            echo -e "${CYAN}●${NC} $container_name: ${CYAN}无健康检查${NC}"
            ;;
        *)
            echo -e "${RED}●${NC} $container_name: ${RED}$health_status${NC}"
            ;;
    esac
}

# 显示服务状态
show_status() {
    echo ""
    echo "=================================="
    echo "   Stardust 服务状态"
    echo "=================================="
    echo ""

    cd "$PROJECT_ROOT"

    # 显示 docker-compose ps
    log_info "容器状态:"
    echo ""

    if docker compose version &> /dev/null; then
        docker compose ps
    else
        docker-compose ps
    fi

    echo ""

    # 显示健康状态
    log_info "健康检查:"
    echo ""

    local services=("stardust_backend" "stardust_frontend" "stardust_mysql" "stardust_milvus" "stardust_minio" "stardust_etcd")

    for service in "${services[@]}"; do
        if docker ps -a --format '{{.Names}}' | grep -q "^${service}$"; then
            check_health "$service"
        fi
    done

    echo ""

    # 显示端口映射
    log_info "端口映射:"
    echo ""
    docker ps --filter "name=stardust_" --format "table {{.Names}}\t{{.Ports}}" | grep -v "NAMES" || echo "  无运行中的服务"
    echo ""

    # 显示访问地址
    log_info "服务访问地址:"
    echo ""
    echo "  前端 H5:       http://localhost:8080"
    echo "  后端 API:      http://localhost:3000"
    echo "  MinIO 控制台:  http://localhost:9001"
    echo "  MinIO API:     http://localhost:9000"
    echo "  Milvus API:    localhost:19530"
    echo ""

    # 显示资源使用情况
    log_info "资源使用:"
    echo ""
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" --filter "name=stardust_" || echo "  无法获取资源使用信息"
    echo ""
}

# 显示快捷命令
show_commands() {
    log_info "快捷命令:"
    echo ""
    echo "  查看日志:     ./scripts/logs.sh [服务名]"
    echo "  重启服务:     ./scripts/restart.sh"
    echo "  停止服务:     ./scripts/stop.sh"
    echo "  进入容器:     docker exec -it stardust_backend sh"
    echo ""
}

# 主函数
main() {
    show_status
    show_commands
}

# 执行主函数
main "$@"
