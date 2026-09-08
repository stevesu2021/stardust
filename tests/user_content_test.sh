#!/usr/bin/env bash
# 测试用户资料 + 内容发布接口
BASE=http://127.0.0.1:3000/api
TS=$(date +%s)

echo "== 注册 =="
REG=$(curl -s -m 10 -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d "{\"nickname\":\"测试员$TS\",\"phone\":\"138$(printf '%08d' $((TS%100000000)))\",\"password\":\"Test1234!\",\"gender\":\"male\",\"birthYear\":1995,\"birthMonth\":8,\"birthDay\":15,\"birthHour\":10}")
echo "$REG" | head -c 400; echo
TOKEN=$(echo "$REG" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('access_token') or (d.get('user') or {}).get('token') or d.get('token') or '')" 2>/dev/null)
UID=$(echo "$REG" | python3 -c "import sys,json;d=json.load(sys.stdin);u=d.get('user') or {};print(u.get('id') or d.get('userId') or '')" 2>/dev/null)
echo "TOKEN_LEN=${#TOKEN} UID=$UID"

if [ -z "$TOKEN" ]; then
  echo "== 注册返回无token, 尝试登录 =="
  LOGIN=$(curl -s -m 10 -X POST $BASE/auth/login -H 'Content-Type: application/json' \
    -d "{\"identifier\":\"138$(printf '%08d' $((TS%100000000)))\",\"password\":\"Test1234!\"}")
  echo "$LOGIN" | head -c 400; echo
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('access_token') or (d.get('user') or {}).get('token') or d.get('token') or '')" 2>/dev/null)
  UID=$(echo "$LOGIN" | python3 -c "import sys,json;d=json.load(sys.stdin);u=d.get('user') or {};print(u.get('id') or d.get('userId') or '')" 2>/dev/null)
  echo "TOKEN_LEN=${#TOKEN} UID=$UID"
fi

echo "$TOKEN" > /tmp/sd_token; echo "$UID" > /tmp/sd_uid

echo "== profile =="
curl -s -m 10 $BASE/auth/profile -H "Authorization: Bearer $TOKEN" | head -c 300; echo

echo "== user/:id =="
curl -s -m 10 $BASE/user/$UID -H "Authorization: Bearer $TOKEN" | head -c 300; echo

echo "== PUT user/:id =="
curl -s -m 10 -X PUT $BASE/user/$UID -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"nickname":"测试员改"}' | head -c 300; echo

echo "== daily-fortune today =="
curl -s -m 20 "$BASE/daily-fortune/today" -H "Authorization: Bearer $TOKEN" | head -c 400; echo

echo "== treehole 发帖 =="
curl -s -m 10 -X POST $BASE/treehole -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"content":"这是一条测试树洞内容"}' | head -c 300; echo

echo "== treehole public =="
curl -s -m 10 $BASE/treehole/public | head -c 300; echo

echo "== confession 发帖 =="
curl -s -m 10 -X POST $BASE/confession -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"content":"测试告白内容","targetNickname":"小星","isAnonymous":true}' | head -c 300; echo

echo "== confession public =="
curl -s -m 10 $BASE/confession/public | head -c 300; echo
