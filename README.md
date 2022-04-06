# express boilerplate with mysql

This is a express boilerplate with the following features:

> - `ECMA Script 2020` or ES2020 features enabled
> - `Babel` to transpile the js code
> - `Dotenv` Load environment variables from .env file
> - `Eslint` Code quality tool
> - `Prettier` to prettify the code
> - `CORS` feature enabled
> - `Passport` authentication strategies and middleware to restrict access.
> - `RBAC` logic to authorize user with specific roles to use the endpoints.
> - `Error Handling` errors custom middleware and helpers globally configured
> - `Multer` File uploading configured to use in routes as middleware
> - `Axios` globally configured in `./src/utils/api.utils.js`
> - `Swagger` documentation reachable at `http://localhost:3000/api/v1/docs`
> - `Jest` testing tool support
> - `Winston` logger tool support
> - `Docker` ready configuration with multi-stage option
> - `Best practices` in naming files

## Basic Information

- `App` entry point is located in `./src/app.js`

- `Server` config entrypoint is located in `./src/bin/www.js`

- `Babel` config to transpile the code is located at `./.babelrc`

- `Prettier` config is located at `./.prettierrc`

- `Eslint` config is located at `./.eslintrc`

- `Routes` config entrypoint is located in `./src/routes/v1/index.route.js`

- `Passport` config is located at `./src/config/passport.config.js`

  - Local Strategy is defined in `./src/services/passport/passport-local.service.js`
  - Google Strategy is defined in `./src/services/passport/passport-google.service.js`

- `RBAC` logic middleware is located at `./src/middlewares/verifyRights.middleware.js`

  - Roles configuration is located at `./src/config/roles.config.js`

- `Mysql` config is located at `./src/config/mysql.config.js`

  - Models definition are located in `./src/services`

- `Error` Handling middleware is located at `./src/middlewares/errorHandler.middleware.js`

  - You can configure as many errors you need in `./src/helpers/errors.helper.js`

- `Multer` middleware is located at `./src/middlewares/upload.middleware.js`

  <!-- - If you want to use Google Cloud Storage as upload bucket follow instructions at `./src/config/gcloud/README.md` -->

- `Swagger` config file is located at `./swagger.json`

  - Swagger routes are defined in `./src/routes/swagger.route.js`

- `Docker` config is located at `./Dockerfile`

- `JEST` tests are located in `./src/tests/*`

<!-- - `Pub/Sub` service is located at `./src/services/pubsub/pub-sub.service.js`
  - The pub/sub logic routes is located at `./src/routes/v1/events/*`
  - The pub/sub logic controller is located at `./src/controllers/events/*` -->

## Folder Structure

> `src/`
>
> - **`bin/`** - server configuration folder
> - **`config/`** - this folder contains all the configs file (database, passport, etc...)
> - **`constants/`** - this folder contains all the global constants
> - **`controllers/`** - all the controllers to use in routes that interact with services
> - **`debug/`** - the logger file will be stored here
> - **`helpers/`** - some helpers func i.e. an error helper that returns json everytime an error comes in
> - **`middlewares/`** - here you can find all the custom middlewares
> - **`models/`** - database model definition
> - **`routes/`** - here you find all the defined routes of the app
> - **`services/`** - here we store all the services; i.e. here we define methods to manipulate a db model entity
> - **`tests/`** - here we store all the jest test
> - **`utils/`** - containing some utils function to be reused in the code (i.e. axios global configuration)

> `docker/`
>
> - **`mysql/`** - ...
> - **`redis/`** - ...

## Getting Started

Copy the .env.example to .env

```bash
cp env.example .env
```

---

To get started with this repo npm install in the root folder

```bash
npm i --save
```

To getting started with a dev environment. Here we use nodemon and babel-node to restart the server asa we change
something

```bash
npm run start:dev
```

To transpile the code and create a production build

```bash
npm run transpile
```

This command will create a build in the root directory

To start with a production ready build you can run this command

```bash
# This set the NODE_ENV to production, npm-run-all, create a build and run the server command
npm run start
```

If you have a build and you want to node the build you can run

```bash
# This command launch the node instance inside the ./build/bin/www
npm run server
```

## Jest

```bash
# To launch all the tests that are in the tests folder
npm run test
```

## Docker Ready

### Here we use the multistage build to optimize speed and size of the final image

If you use Docker and wanna dockerize the app you can run the command

```bash
docker build -t <dockerhubusername>/<docker-image-name>:<tag> .
```

then

```bash
cd ./docker/mysql
docker compose up -d
cd ../redis
docker compose up -d
cd ../../
docker run --name <docker-process-name> -d - p 3000:3000 <dockerhubusername>/<docker-image-name>:<tag>
```
