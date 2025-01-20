#!/bin/bash

print_usage() {
    echo "Usage: $0 [--prod]"
    echo "  --prod    Run in production mode"
    exit 1
}

PROD_MODE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod)
            PROD_MODE=true
            shift
            ;;
        -h|--help)
            print_usage
            ;;
        *)
            echo "Unknown option: $1"
            print_usage
            ;;
    esac
done

if [ "$PROD_MODE" = true ]; then
    watchexec -r -c -e go,js,lua -- 'go run core/cmd/build.go && go run *.go --mode=production'
else
    watchexec -r -c -e go go run *.go
fi