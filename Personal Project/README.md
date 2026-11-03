This project runs locally. React and Vite calls Spring Boot, and Spring Boot stores
catalog parts and saved builds in PostgreSQL. 

Things needed to run it
Java compatible with the project's Spring Boot version 
Maven installed 
Docker Desktop running, with Docker Compose supporting 
Node and npm for the frontend 

Run the following commands from Personal Project or root unless stated otherwise.


docker compose -f compose.yaml up -d --wait db


In one terminal:


cd BackEnd
mvn spring-boot:run


In another terminal:


cd FrontEnd
npm ci
npm run dev


Open the local URL Vite prints.



tests

From Backend:

mvn test



From FrontEnd:


npm test
npm run build


