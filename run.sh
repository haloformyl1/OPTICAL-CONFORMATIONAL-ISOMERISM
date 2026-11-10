#!/bin/bash
cd "$(dirname "$0")"
echo "Starting PIECHEM Optical & Conformational Stereochemistry Studio on http://localhost:5173 ..."
npm run dev -- --host 0.0.0.0 --port 5173

