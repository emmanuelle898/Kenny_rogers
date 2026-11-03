# Outer Rim Workshop — local development

This project runs locally: React/Vite calls Spring Boot, and Spring Boot stores
catalog parts and saved builds in PostgreSQL. Git distributes code and database
migrations, not another person's saved designs.

## Requirements

- Java 21 or newer compatible with the project's Spring Boot version
- Maven installed (`mvn --version`)
- Docker Desktop running, with Docker Compose supporting `--wait`
- Node and npm for the frontend (`npm ci` uses the committed lockfile)

Run the following commands from `Personal Project` unless stated otherwise.

## Start the application

```bash
docker compose -f compose.yaml up -d --wait db
```

In one terminal:

```bash
cd BackEnd
mvn spring-boot:run
```

In another terminal:

```bash
cd FrontEnd
npm ci
npm run dev
```

Open the local URL Vite prints. Vite forwards `/api` to Spring Boot on port 8080.
Flyway applies the SQL files under `BackEnd/src/main/resources/db/migration`.
Do not edit already-applied migrations; add a new migration for schema changes.

## Run backend tests

```bash
bash test-backend.sh
```

For just the database-connection test:

```bash
bash test-backend.sh -Dtest=DatabaseConnectionTest
```

The script validates the test Compose file, recreates **only** `db-test`, waits
for readiness, then runs Maven. It intentionally clears disposable test data on
each run. It does not stop or delete the development database or its volume.
Subsequent direct `mvn test` commands from `BackEnd` can reuse the running test
container. If a command fails, the script stops rather than running later steps.

| Purpose | Compose service | Host port | Database | User | Storage |
| --- | --- | --- | --- | --- | --- |
| Application | `db` in `compose.yaml` | 5433 | workshop | builder | persistent volume |
| Tests | `db-test` in `compose.test.yaml` | 5434 | workshop_test | workshop_tester | temporary filesystem |

Main connection settings live in `BackEnd/src/main/resources/application.properties`.
Test connection settings live in `BackEnd/src/test/resources/application.properties`.
Maven puts test resources first on the test classpath; they are not packaged as
application resources. Both databases use the same migrations. Credentials here
are local demo credentials. Both published database ports bind to loopback.

The health check establishes readiness, not successful password authentication.
`DatabaseConnectionTest` checks the actual database and user used by Spring.
Most tests that insert or change rows use transactions that roll back afterward.

To stop and discard only the test database:

```bash
docker compose -f compose.test.yaml down
```

To stop the development container while keeping saved designs:

```bash
docker compose -f compose.yaml stop db
```

Do not use `down -v` on the development project: that removes its saved data.

## Frontend verification

From `FrontEnd`:

```bash
npm test
npm run build
```

Frontend App tests mock the API. They verify React behavior, not real database
access; backend tests exercise the controller, service, repository and PostgreSQL.

## Build API contract

- `POST /api/builds.sbr`: create; returns 201 and `id`, `name`, `status`.
- `GET /api/builds.sbr`: list saved builds.
- `GET /api/builds/{id}.sbr`: open one build, including component details.
- `PUT /api/builds/{id}.sbr`: update the same build.
- `DELETE /api/builds/{id}.sbr`: remove the build and its selections; returns 204.

Build IDs are UUIDs. Requests require name, status, hiltId, crystalId and emitterId.
Omitted collarId, switchId and pommelId use the service defaults. Supplied IDs must
exist and match their categories. React sends all six selected IDs. Build parts
reference the catalog; deleting a build does not delete catalog parts.

There are no accounts: all users of the same local backend share its saved list.

## Troubleshooting the test connection

```bash
docker compose -f compose.test.yaml ps -a
docker compose -f compose.test.yaml logs --tail=60 db-test
```

If port 5434 is occupied, identify the process/container using it before stopping
anything. Do not redirect tests to port 5433. Password errors can also come from
overrides such as `SPRING_DATASOURCE_*`, `SPRING_FLYWAY_*`, JVM `-D` properties or
IDE run settings. Keep these consistent with the test configuration or remove
unintended overrides. Never disable database password authentication to pass tests.

## Committing source

Save files in the editor, then inspect `git diff` before staging and pushing.
An empty file committed to GitHub stays empty even if an editor has unsaved text.
Do not commit node_modules, target, dist or local database files.
