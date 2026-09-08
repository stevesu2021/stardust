#!/usr/bin/env bash
# 修正存量数据里的 MinIO 图片 URL: http://115.190.134.248:9000 -> https://xingqiji.xyz/minio
PW=$(grep "^DATABASE_URL" /root/deployments/stardust-v20260908/backend.env | sed -E "s|.*://[^:]+:([^@]+)@.*|\1|")
OLD="http%3A%2F%2F115.190.134.248%3A9000"
# 用十六进制避免 sed 特殊字符问题: 直接用双引号写 LIKE
Q() { docker exec stardust_mysql mysql -ustardust_user -p"$PW" stardust -N -e "$1" 2>/dev/null; }

echo "== 受影响行数 =="
Q "SELECT 'products', COUNT(*) FROM products WHERE image_url LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'users.avatar', COUNT(*) FROM users WHERE avatar LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'face_readings', COUNT(*) FROM face_readings WHERE image_url LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'palm_readings', COUNT(*) FROM palm_readings WHERE image_url LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'treeholes', COUNT(*) FROM treeholes WHERE image LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'prayers.image', COUNT(*) FROM prayers WHERE image LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'devout_prayers.image', COUNT(*) FROM devout_prayers WHERE image LIKE 'http://115.190.134.248:9000%';"
Q "SELECT 'reunite_prayers.image', COUNT(*) FROM reunite_prayers WHERE image LIKE 'http://115.190.134.248:9000%';"

echo "== 执行替换 =="
Q "UPDATE products SET image_url = REPLACE(image_url, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image_url LIKE 'http://115.190.134.248:9000%'; SELECT ROW_COUNT();"
Q "UPDATE users SET avatar = REPLACE(avatar, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE avatar LIKE 'http://115.190.134.248:9000%';"
Q "UPDATE face_readings SET image_url = REPLACE(image_url, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image_url LIKE 'http://115.190.134.248:9000%';"
Q "UPDATE palm_readings SET image_url = REPLACE(image_url, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image_url LIKE 'http://115.190.134.248:9000%';"
Q "UPDATE treeholes SET image = REPLACE(image, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image LIKE 'http://115.190.134.248:9000%';"
Q "UPDATE prayers SET image = REPLACE(image, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image LIKE 'http://115.190.134.248:9000%';"
Q "UPDATE devout_prayers SET image = REPLACE(image, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image LIKE 'http://115.190.134.248:9000%';"
Q "UPDATE reunite_prayers SET image = REPLACE(image, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE image LIKE 'http://115.190.134.248:9000%';"

echo "== 修复后残留检查(应全为0) =="
Q "SELECT 'products残留', COUNT(*) FROM products WHERE image_url LIKE 'http%115.190.134.248%';"
Q "SELECT 'users.avatar残留', COUNT(*) FROM users WHERE avatar LIKE 'http%115.190.134.248%';"
