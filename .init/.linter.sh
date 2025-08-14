#!/bin/bash
cd /home/kavia/workspace/code-generation/crossdevice-notes-app-7093-7103/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

