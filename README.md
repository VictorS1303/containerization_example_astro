## 1. PROJECT DESCRIPTION ##
This Astro application demonstrates a basic Docker containerization using PostgreSQL to store and retrieve data from (in this case just a heading). Both the application and database are containerized using Docker.
<br />

## 2. TECHONOLOGIES ##
For this project, Astro has been chosen as the framework, while Node.js takes care of running the server. As for the database, PostgreSQL has been used to store the data (here, the heading). Docker takes care of the containerization, while Docker Compose defines and runs the application and database containers together.
<br />

## 3. Prerequisites ##
Before starting this project it is important to have the following installed:

* **DOCKER DESKTOP**

    * Docker Desktop is the application that allows building, running, and managing containerized applications
    <br />
    <br />

* **DOCKER COMPOSE**
    
    *  A tool designed for defining and running multiple Docker applications at once (it is included in the installation of Docker Desktop)
<br />

## 4. ENVIRONMENT VARIABLES (.env) ##
This file takes care of storing the variables needed to connect to the database.

The following needed variables are:

 * **POSTGRES_HOST**
    <br />
    Defines the host to be used. In this case, it is initially "localhost", but Docker overrides it with "POSTGRES_HOST: db" (see line 11 in [docker-compose.yml](./docker-compose.yml)) 
          
    
* **POSTGRES_PORT**
    <br />
    Defines the port to be used
    (in this case, it is "5432" (see line 12 in [docker-compose.yml](./docker-compose.yml)))

* **POSTGRES_DATABASE**
    <br />
    Defines the database name
    (in this case, it is "heading_app" (see line 13 in [docker-compose.yml](./docker-compose.yml)))

* **POSTGRES_USER**
    <br />
       Defines the user name
       (in this case, it is "postgres" (see line 14 in [docker-compose.yml](./docker-compose.yml)))

* **POSTGRES_PASSWORD**
    <br />
       Defines the password to whatever value it has been given in the .env file ((see line 15 in [docker-compose.yml](./docker-compose.yml)))



## 5. PROJECT STRUCTURE ##
File breakdown (see [step 7](#7-project-structure-in-depth) for an in-depth breakdown):

* **Dockerfile**
  <br />
  The [Dockerfile](./Dockerfile) contains the instructions Docker uses to build the image for the Astro application. It defines the build process, runtime environment, dependencies, exposes port, and command used to start the application

* **.dockerignore**
  <br />
  The [.dockerignore](./.dockerignore) contains the files that the [Dockerfile](./Dockerfile) should ignore when building the image

* **docker-compose.yml**
  <br />
  The [docker-compose.yml](./docker-compose.yml) defines the services, environment variables, ports, volumes, and network used by the application. It allows the Astro application and PostgreSQL database to be built, configured, connected, and run together using Docker Compose.

* **init.sql**
  <br />
  The [init.sql](./init.sql) contains the actual database. It takes care of everything related to persisting and retrieving data from the database.

* **astro.config.mjs**
  <br />
  The [astro.config.mjs](./astro.config.mjs) contains the configuration for the Astro project, including the Node adapter and output mode.


* **src/lib/postgres_client.ts**
  <br />
  The [src/lib/postgres_client.ts](./src/lib/postgres_client.ts#L1) contains the postgresClient used to connect and interact with the PostgreSQL database.
  <br />


## 6. DATABASE SETUP ##
* **POSTGRESQL**
  <br />
  PostgreSQL is used as the database for storing the heading used by the application. The PostgreSQL runs inside its own Docker container

* **init.sql**
  <br />
  [init.sql](./init.sql) is executed, when the PostgreSQL container is initialized. It creates the necessary table and inserts the heading that the Astro application retrieves.


## 7. PROJECT STRUCTURE (IN DEPTH) ##
* **Dockerfile**
  The [Dockerfile](./Dockerfile) contains the following instructions:

    **OLD VERSION**
    > FROM node:22
    * This starts a Docker image based on Node.js 22

    **NEW VERSION**
    > FROM node:22 AS build
    * The same Node.js 22 image is used, but it now has a name *build*".
    <br />
    * This name later becomes important, because the runtime stage can copy files from this stage *COPY --from=build*".
    <br />
    <br />

    **OLD VERSION**
    > WORKDIR /app
    * Docker sets */app*" as the working directory inside the container
    <br />

    **NEW VERSION**
    > WORKDIR /app
    * No changes.
    <br />
    <br />

    **OLD VERSION**
    > COPY package*.json ./
    * The project's package files are copied into */app*"
    <br />

    **NEW VERSION**
    > COPY package*.json ./
    * No changes.
    <br />
    <br />

    **OLD VERSION**
    > RUN npm ci
    * This installs the project's dependencies using the lock file.
    <br />

    **NEW VERSION**
    > RUN npm ci
    * No changes.
    <br />
    <br />

    **OLD VERSION**
    > COPY . .
    * The rest of the project is copied into */app*".
    <br />

    **NEW VERSION**
    > COPY . .
    * No changes.
    <br />
    <br />

    **OLD VERSION**
    > RUN npm run build
    * The Astro application is built inside the Docker image.
    <br />
    * In the old version, everything remains inside the same image:
    <br />
    Node image
    <br />
    │
    <br />
    ├── source code
    <br />
    ├── node_modules
    <br />
    ├── build files
    <br />
    └── everything else copied into the image
    <br />

    **NEW VERSION**
    > RUN npm run build
    * No changes in the command itself. The important difference is ***where the result goes***. In the new version, in opposition to the old one, the data now goes inside the temporary *build*" stage.
    <br />
    <br />

    **OLD VERSION**
    > EXPOSE 4321
    * This exposes port "4321" from the container.
    <br />

    **NEW VERSION**
    > FROM node:22 AS runtime
    * Instead of continuing with the same image, a new stage is created using the same Node.js 22 image.
    <br />
    * This stage is given the name *runtime*" and will contain what is needed to run the already built Astro application.
    <br />
    <br />

    **OLD VERSION**
    > There is no separate runtime stage.
    <br />

    **NEW VERSION**
    > WORKDIR /app
    * Docker sets */app*" as the working directory inside the new *runtime*" stage.
    <br />
    <br />

    **OLD VERSION**
    > There is no equivalent instruction.
    <br />

    **NEW VERSION**
    > COPY --from=build /app/node_modules ./node_modules
    * This copies the *node_modules*" directory from the *build*" stage into the *runtime*" stage.
    <br />
    * This means that the dependencies do not have to be installed again in the *runtime*" stage.
    <br />
    <br />

    **OLD VERSION**
    > There is no equivalent instruction.
    <br />

    **NEW VERSION**
    > COPY --from=build /app/dist ./dist
    * This copies the built Astro application from the *build*" stage into the *runtime*" stage.
    <br />
    * The runtime stage therefore receives the files required to run the already built application without needing the original source code.
    <br />
    <br />

    **OLD VERSION**
    > There is no equivalent instruction.
    <br />

    **NEW VERSION**
    > USER node
    * This changes the user running the application from the default root user to the *node*" user.
    <br />
    * This means the application does not need to run with root privileges.
    <br />
    <br />

    **OLD VERSION**
    > EXPOSE 4321
    * This exposes port "4321" from the container.
    <br />

    **NEW VERSION**
    > EXPOSE 4321
    * No changes.
    <br />
    <br />

    **OLD VERSION**
    > ENV HOST=0.0.0.0
    > ENV PORT=4321
    * These environment variables define the host and port that the Astro server uses.
    <br />

    **NEW VERSION**
    > ENV HOST=0.0.0.0
    > ENV PORT=4321
    * No changes.
    <br />
    <br />

    **OLD VERSION**
    > CMD ["node", "./dist/server/entry.mjs"]
    * This starts the built Astro application using Node.js.
    <br />

    **NEW VERSION**
    > CMD ["node", "./dist/server/entry.mjs"]
    * No changes.
    <br />
    * The difference is that the *dist*" directory now comes from the *build*" stage.
    <br />
    <br />

    The main difference between the two versions is that the old version uses a **single-stage build**, where everything is contained in one image, while the new version uses a **multi-stage build**.

    The new version first uses the *build*" stage to install dependencies and build the Astro application. It then creates a separate *runtime*" stage and copies only the *node_modules*" and *dist*" directories required to run the application.

    This keeps the build process separate from the final runtime environment.


* **.dockerignore**
  <br />
  The [.dockerignore](./.dockerignore) contains the files and directories that the [Dockerfile](./Dockerfile) should ignore when building the image.
  <br />
  <br />
  This prevents unnecessary files from being copied into the Docker image when the `COPY . .` instruction is executed.
  <br />
  <br />
  It can therefore help reduce the size of the build context and prevent files that are not needed inside the container from being copied.


* **docker-compose.yml**
  <br />
  The [docker-compose.yml](./docker-compose.yml) defines the services, environment variables, ports, volumes, and network used by the application.
  <br />
  <br />

  **SERVICES**
  <br />
  The `services` section defines the containers that Docker Compose should create.
  <br />
  <br />

  In this project, there are two services:
  <br />

  * **app**
    <br />
    This is the Astro application container. It is built using the [Dockerfile](./Dockerfile).

  * **db**
    <br />
    This is the PostgreSQL database container. It uses the PostgreSQL Docker image.
    <br />
    <br />

  **ENVIRONMENT**
  <br />
  The environment variables configure how the application and PostgreSQL containers connect to the database.
  <br />
  <br />

  The application receives the database connection information, while the PostgreSQL container uses the corresponding values to configure the database.
  <br />
  <br />

  **PORTS**
  <br />
  The `ports` section determines which container ports are made available to the host machine.
  <br />
  <br />

  The Astro application uses port `4321`, allowing it to be accessed through the browser.
  <br />
  <br />

  **VOLUMES**
  <br />
  The PostgreSQL service uses a volume to persist the database data.
  <br />
  <br />

  This means that the database data can remain available even when the PostgreSQL container is stopped or removed.
  <br />
  <br />

  **NETWORK**
  <br />
  Docker Compose creates a network for the services, allowing the Astro application and PostgreSQL database to communicate with each other.
  <br />
  <br />

  Because of this, the application can use the service name `db` as the database host instead of `localhost` when running inside Docker.


* **init.sql**
  <br />
  The [init.sql](./init.sql) contains the SQL commands used to initialize the PostgreSQL database.
  <br />
  <br />

  When the PostgreSQL container is initialized, the commands in this file are executed.
  <br />
  <br />

  The file creates the necessary table and inserts the initial heading that the Astro application retrieves.
  <br />
  <br />

  This allows the database to have the required structure and initial data when it is initialized.


* **astro.config.mjs**
  <br />
  The [astro.config.mjs](./astro.config.mjs) contains the configuration for the Astro project, including the Node adapter and output mode.
  <br />
  <br />

  The Node adapter allows the Astro application to be built as a Node.js server.
  <br />
  <br />

  This is necessary because the application is started using:
  <br />

  > node ./dist/server/entry.mjs

  <br />

  The output mode determines how Astro builds the application. In this project, it is configured to produce a server application that can be run using Node.js.


* **src/lib/postgres_client.ts**
  <br />
  The [src/lib/postgres_client.ts](./src/lib/postgres_client.ts#L1) contains the `postgresClient` used to connect and interact with the PostgreSQL database.
  <br />
  <br />

  The PostgreSQL client uses the environment variables defined in the `.env` file to obtain the information required to establish the database connection.
  <br />
  <br />

  When the application runs through Docker Compose, `POSTGRES_HOST` is set to `db`. This allows the client to connect to the PostgreSQL container through the Docker Compose network.
  <br />
  <br />

  The client can then be used by the Astro application to send SQL queries to PostgreSQL and retrieve the stored heading.


## 8. APPLICATION FLOW ##
The application works by connecting the Astro application to the PostgreSQL database through the `postgresClient`.

The overall flow is:

**Astro application → postgresClient → PostgreSQL container → database → heading → Astro application**

<br />

When the application starts, the Astro server uses the `postgresClient` to connect to PostgreSQL.

The PostgreSQL database contains the heading created by [init.sql](./init.sql).

The application retrieves the heading from the database and displays it on the page.

Both the Astro application and PostgreSQL database run as separate Docker containers, while Docker Compose is responsible for configuring and connecting the two containers.

## 8. APPLICATION FLOW ##
The application works by connecting the Astro application to the PostgreSQL database through the `postgresClient`.

The overall flow is:

**Astro application → postgresClient → PostgreSQL container → database → heading → Astro application**

<br />

When the application starts, the Astro server uses the `postgresClient` to connect to PostgreSQL.

The PostgreSQL database contains the heading created by [init.sql](./init.sql).

The application retrieves the heading from the database and displays it on the page.

Both the Astro application and PostgreSQL database run as separate Docker containers, while Docker Compose is responsible for configuring and connecting the two containers.
<br />


## 9. BUILDING AND RUNNING THE PROJECT ##
To build and start the containers, Docker Compose can be used with the following command:

> docker compose up --build

The `--build` option tells Docker Compose to rebuild the images before starting the containers.

<br />

Once the containers have started, the Astro application can be accessed through the port defined in [docker-compose.yml](./docker-compose.yml).

<br />

To stop the containers, use:

> docker compose down

This stops and removes the containers created by Docker Compose.


## 10. DOCKER VOLUMES ##
The PostgreSQL container uses a Docker volume to persist the database data.

The volume allows the data stored by PostgreSQL to remain available even if the PostgreSQL container is stopped or removed.

<br />

This separates the database data from the lifecycle of the PostgreSQL container.

The PostgreSQL database can therefore be recreated without necessarily losing the data stored in its volume.


## 11. CONTAINER COMMUNICATION ##
The Astro application and PostgreSQL database run in separate Docker containers.

Docker Compose creates a network that allows the containers to communicate with each other.

<br />

The Astro application therefore does not use `localhost` to connect to PostgreSQL when running inside Docker.

Instead, it uses the PostgreSQL service name:

> db

<br />

This is because Docker Compose makes the service available through its service name on the Docker network.

The connection can therefore be summarized as:

**Astro container → `db` → PostgreSQL container**
<br />


## 12. MULTI-STAGE BUILD ##
The [Dockerfile](./Dockerfile) uses a multi-stage build to separate the process of building the Astro application from running it.

<br />

The first stage is the *build*" stage:

**build stage → install dependencies → copy project → build Astro application**

<br />

The second stage is the *runtime*" stage:

**runtime stage → copy dependencies and build files → start Astro application**

<br />

Only the files required by the runtime are copied from the *build*" stage:

> COPY --from=build /app/node_modules ./node_modules

> COPY --from=build /app/dist ./dist

<br />

This means that the final runtime stage does not need the complete source code or the other files that were only required during the build process.


## 13. SUMMARY ##
The project demonstrates how an Astro application and a PostgreSQL database can be containerized and run together using Docker and Docker Compose.

The Astro application is built and run in a Docker container, while PostgreSQL runs in a separate container.

Docker Compose configures the two containers, including their environment variables, ports, volume, and network.

<br />

The application uses `postgresClient` to connect to the PostgreSQL container and retrieve the stored heading.

The Dockerfile uses a multi-stage build, where the application is first built in a *build*" stage and then transferred into a separate *runtime*" stage.

This separates the build environment from the final environment used to run the application.