#!/bin/bash

# Load environment variables
source .env

# Use environment variables in scp command
scp -P $PORT -r dist/. $USER@$HOST:$PATH_TO