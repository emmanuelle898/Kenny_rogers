#!/usr/bin/env bash
set -euo pipefail

# Resolve paths from this script, regardless of the terminal's current directory.
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"

docker compose -f compose.test.yaml config --quiet

# Recreate only the disposable test database. Never touch the application's db.
# This also initializes its credentials from compose.test.yaml on each run.
docker compose -f compose.test.yaml up -d --wait --force-recreate db-test

cd BackEnd
mvn test "$@"
