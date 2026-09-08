#!/usr/bin/env bash
PW=$(grep "^DATABASE_URL" /root/deployments/stardust-v20260908/backend.env | sed -E "s|.*://[^:]+:([^@]+)@.*|\1|")
M() { docker exec -i stardust_mysql mysql -ustardust_user -p"$PW" stardust 2>/dev/null; }

echo "== 修前样本 =="
M <<'SQL'
SELECT imageUrl FROM products LIMIT 1;
SQL

echo "== 替换 products (列名实际是 imageUrl 驼峰) =="
M <<'SQL'
UPDATE products SET imageUrl = REPLACE(imageUrl, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE imageUrl LIKE 'http://115.190.134.248:9000%';
SELECT ROW_COUNT() AS products_updated;
SELECT COUNT(*) AS products_remaining FROM products WHERE imageUrl LIKE '%115.190.134.248%';
SQL

echo "== 替换 users.avatar =="
M <<'SQL'
UPDATE users SET avatar = REPLACE(avatar, 'http://115.190.134.248:9000', 'https://xingqiji.xyz/minio') WHERE avatar LIKE 'http://115.190.134.248:9000%';
SELECT ROW_COUNT() AS users_updated;
SQL
