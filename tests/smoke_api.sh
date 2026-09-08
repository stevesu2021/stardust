#!/usr/bin/env bash
# stardust API 冒烟测试：认证 + 公开接口
BASE=http://127.0.0.1:3000/api
TS=$(date +%s)
EMAIL="t${TS}@test.com"

echo "== 1. 注册 =="
REG=$(curl -s -m 10 -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test1234!\",\"nickname\":\"测试员$TS\"}")
echo "$REG" | head -c 400; echo

echo "== 2. 登录 =="
LOGIN=$(curl -s -m 10 -X POST $BASE/auth/login -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test1234!\"}")
echo "$LOGIN" | head -c 500; echo
TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('access_token') or d.get('token') or '')" 2>/dev/null)
USERID=$(echo "$LOGIN" | python3 -c "import sys,json;d=json.load(sys.stdin);u=d.get('user') or {};print(u.get('id') or d.get('userId') or '')" 2>/dev/null)
echo "TOKEN_LEN=${#TOKEN} USERID=$USERID"
[ -f /tmp/sd_token ] && echo "$TOKEN" > /tmp/sd_token && echo "$USERID" > /tmp/sd_uid

echo "== 3. profile (带token) =="
curl -s -m 10 $BASE/auth/profile -H "Authorization: Bearer $TOKEN" | head -c 300; echo

echo "== 4. mbti questions =="
curl -s -m 10 $BASE/mbti/questions | head -c 120; echo
echo "== 5. mbti types =="
curl -s -m 10 $BASE/mbti/types | head -c 150; echo

echo "== 6. treehole public =="
curl -s -m 10 $BASE/treehole/public | head -c 200; echo

echo "== 7. confession public =="
curl -s -m 10 $BASE/confession/public | head -c 200; echo

echo "== 8. daily-fortune today =="
curl -s -m 15 "$BASE/daily-fortune/today?userId=$USERID" | head -c 300; echo

echo "== 9. famous-people =="
curl -s -m 10 $BASE/famous-people/grouped/all | head -c 150; echo

echo "== 10. products =="
curl -s -m 10 $BASE/products | head -c 300; echo

echo "== 11. prayer categories =="
curl -s -m 10 $BASE/prayer/categories | head -c 200; echo

echo "== 12. devout-prayer categories =="
curl -s -m 10 $BASE/devout-prayer/categories | head -c 200; echo
