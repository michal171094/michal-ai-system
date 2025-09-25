#!/bin/bash
cd ai_agent
uvicorn smart_server:app --host 0.0.0.0 --port $PORT