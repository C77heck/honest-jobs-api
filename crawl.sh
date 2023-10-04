#!/bin/bash
echo 'starting' >>log.txt
echo "{$SHELL}" >>shell.txt
# Set the option to exit on any error
set -e

curl http://localhost:3131/trigger/run >>result.log
