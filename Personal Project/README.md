This project runs locally. The React frontend (built with Vite) communicates with a Spring Boot backend, 
which stores catalog parts and saved builds in a PostgreSQL database managed by Docker.



Run the following commands from Personal Project folder unless stated otherwise.
See troubleshooting below if there are any issues.

Make sure you have the following installed on your machine before starting:

- Java JDK (compatible with the project's Spring Boot version) 17 or higher.
verify with:'java -version'

- Docker Desktop must be running.
verify with: 'docker compose version'

- Node.js environment for the frontend.
verify with: 'node -v' and 'npm -v'

- Maven 
Choose one of the methods below to handle Maven:

*Use the Maven Wrapper already included in the project folder,
you will run './mvnw' (Mac/Linux)or 'mvnw.cmd' (Windows).

*Install Maven globally via your terminal package manager:
    macOS: 'brew install maven'
    Linux: 'sudo apt update && sudo apt install maven -y'
    Windows: 'choco install maven'


To start docker:

'docker compose -f compose.yaml up -d --wait db'

In one terminal:

'cd BackEnd'
'mvn spring-boot:run'

In another terminal:

'cd FrontEnd'
'npm ci'
'npm run dev'

Open the local URL Vite prints.

Open a 3rd terminal to do CL inputs and tests.





tests

From Backend:

'mvn test'


From FrontEnd:

'npm test'
'npm run build'





Troubleshooting

===port 5432 is already in use===
If you have a local instance of PostgreSQL running natively on your machine, Docker will fail to bind to port `5432`.

Fix: Stop your local PostgreSQL service before running Docker Compose:
    macOS: 'brew services stop postgresql'
    Windows: Open 'services.msc', locate 'postgresql-x64', right-click and select Stop
    Linux: 'sudo systemctl stop postgresql

===Validation failed: Migration checksum mismatch===
If you modify an existing SQL migration script in 'src/main/resources/db/migration/' after it has already run,
Flyway will block the app from starting to prevent data corruption.

Fix: For local development, the easiest fix is to completely wipe the Docker volume and start fresh:
  
  'docker compose down -v'
  'docker compose -f compose.yaml up -d --wait db'
  

===UnsupportedClassVersionError===
If the backend throws an error stating it was compiled by a more recent version of the Java Runtime, 
your terminal is utilizing an older JDK (like Java 11 or 17).

Fix: Make sure your 'JAVA_HOME' environment variable points directly to a Java 21 JDK installation.
If running from an IDE, go to File > Project Structure > Project and 
verify the SDK dropdown is set to Java 21.

==='npm ci' fails===
If dependency installation fails on the frontend, your Node version might be severely 
outdated or conflicting with the lockfile.

Fix: Clear the local node modules and ensure you are using a modern Node LTS release (Node 20+ recommended):
  
  'cd FrontEnd'
  'rm -rf node_modules package-lock.json'
  'npm install'
  