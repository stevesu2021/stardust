#!/usr/bin/env bash
# 用户资料 + confession 重测（修正字段名）
BASE=http://127.0.0.1:3000/api
TS=$(date +%s)
PHONE="139$(printf '%08d' $((TS%100000000)))"
UJSON=$(curl -s -m 10 -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d "{\"nickname\":\"测试员$TS\",\"phone\":\"$PHONE\",\"password\":\"Test1234!\",\"gender\":\"male\",\"birthYear\":1995,\"birthMonth\":8,\"birthDay\":15,\"birthHour\":10}")
TOKEN=$(echo "$UJSON" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('token') or d.get('access_token') or (d.get('user') or {}).get('token') or '')")
MYID=$(echo "$UJSON" | python3 -c "import sys,json;d=json.load(sys.stdin);print((d.get('user') or {}).get('id',''))")
echo "TOKEN_LEN=${#TOKEN} MYID=$MYID"
AUTH="Authorization: Bearer $TOKEN"

echo "== user/:id GET =="
curl -s -m 10 $BASE/user/$MYID -H "$AUTH" | head -c 200; echo

echo "== user/:id PUT =="
curl -s -m 10 -X PUT $BASE/user/$MYID -H "$AUTH" -H 'Content-Type: application/json' -d '{"nickname":"测试员改","bio":"测试简介"}' | head -c 300; echo

echo "== confession create (targetName) =="
CJSON=$(curl -s -m 10 -X POST $BASE/confession -H "$AUTH" -H 'Content-Type: application/json' -d '{"targetName":"小星","content":"测试告白内容","isAnonymous":true}')
echo "$CJSON" | head -c 300; echo
CID=$(echo "$CJSON" | python3 -c "import sys,json;print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
echo "CID=$CID"

echo "== confession user list =="
curl -s -m 10 $BASE/confession/user/$MYID -H "$AUTH" | head -c 200; echo

echo "== confession public =="
curl -s -m 10 "$BASE/confession/public?skip=0&take=5" | head -c 200; echo

echo "== confession match =="
curl -s -m 10 -X POST $BASE/confession/match/$CID -H "$AUTH" | head -c 300; echo

echo "== mbti submit =="
curl -s -m 10 -X POST $BASE/mbti/submit -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"answers":[{"question":1,"choice":"J"},{"question":2,"choice":"N"}]}' | head -c 300; echo

echo "== mbti result =="
curl -s -m 10 "$BASE/mbti/result" -H "$AUTH" | head -c 200; echo

echo "== treehole like =="
TID=$(curl -s -m 10 $BASE/treehole/public | python3 -c "import sys,json;l=json.load(sys.stdin);print(l[0]['id'] if l else '')")
curl -s -m 10 -X POST $BASE/treehole/like/$TID -H "$AUTH" | head -c 200; echo

echo "== famous-people 白羊座 =="
curl -s -m 10 $BASE/famous-people/白羊座 | head -c 150; echo
