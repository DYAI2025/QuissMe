#!/bin/bash
cd /opt/QuissMe/frontend
pkill -9 -f "vite.*preview" 2>/dev/null
sleep 1
nohup npx vite preview --port 3001 --host 0.0.0.0 > /tmp/quissme.log 2>&1 &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
