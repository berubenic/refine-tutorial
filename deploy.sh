#!/bin/bash

# Load environment variables
source .env

# Build project
npm run build

# Use environment variables in scp command
scp -P $PORT -r dist/. $USER@$HOST:$PATH_TO