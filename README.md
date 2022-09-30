## Oslash

**API documentation can be found here** - [Postman Collection](https://www.postman.com/dark-resonance-160564/workspace/646a5acd-0790-45a7-a1d6-ab3b78e1452e/collection/13812176-1c6429c9-f7de-4805-a12a-c01963df2d9a?action=share&creator=13812176)

API Documentation and use-guide can be accessed from the collection itself. Steps are -

- Near the _oslash_ folder, click on the three buttons to expand options
- From the options, select _View Documentation_

### The kind of API chosen, and why

The kind of API technology used for building this application is REST.
This application (API server) is built using monolithic service-based MVC (Model-View-Controller) architecture. The services are designed such that all of them are exclusive and in no way affect the working of each other. This makes it easier for the developers to quickly adopt a micro-service-based architecture without having to change the entire code.
The application features a class-based code and is divided into 3 layers - Routes, Controllers, and Services which are expanded as follows -

- Routes - They help in forwarding the client request to the correct routes and the controllers.
- Controllers - They help in validation and all the request processing
- Services - Their goal is to take up the validated data and interact with the Database

Some of the reasons for choosing REST over graphQL and gRPC are -

- While graphQL is a very popular approach nowadays towards building APIs, they lack modularity. When we say modularity, we are more concerned about a micro-service-based architecture since it allows easy scaling and faster application development among different teams within the same company.
- Facebook developed graphQL because they did not want to deal with heavy data on their client side, and this is where the actual use of graphQL comes in. Though graphQL is a good choice, it is not known to show significant differences in the performance of the applications with smaller responses.
- GraphQL has some serious caching problems (specifically HTTP caching) that have contributed to the prevention of its widespread adoption.
- GraphQL also doesn’t support file upload out of the box and requires a workaround to implement this functionality.
- GraphQL support is still flaky for different web/application frameworks compared to REST.
- gRPC client-response model and is based on HTTP 2. Some servers have workarounds to make it work with HTTP 1.1 but it is not the default.
- Like graphQL, gRPC also doesn’t support request/response caching by default.

### The kind of Authentication Mechanism chosen

This API-server runs on a cookie-based authentication system. We are useing in-memory cache to store the cookies and their expiration which ensures that the cookies are removed and the access is revoked after 6 hours of persistance. Here is a logical flow of the cookie-based authentication process:

- The client sends a login request with credentials to the backend server.
- The server then validates the credentials. If the login is successful, the web server will save the cookie information in the Redis in-memory cache (for faster access) and create a session in the database and include a Set-Cookie header on the response containing a unique ID in the cookie object.
- The browser saves the cookie locally. As long as the user stays logged in, the client needs to send the cookie in all the subsequent requests to the server. The server then compares the session ID stored in the cookie against the one in the database to verify the validity.
- During the logout operation, the server will make the cookie expire by deleting it from the database.

The reason of choosing cookie-based authenication is -

- Since Oslash is an application that is primarily supposed to be used within the borswers, it makes much more sense to use cookie-based authentication.
- Using cookies in authentication makes the application stateful. This will be efficient in tracking and personalizing the state of a user.
- Cookies are small in size thus making them efficient to store on the client-side.
- Cookies can be “HTTP-only” making them impossible to read on the client-side. This improves protection against any Cross-site scripting (XSS) attacks.
- Cookies will be added to the request automatically, so the developer will not have to implement them manually and therefore requires less code.
- Websites can deliver cookies by configuring them as per requirement. For example, a website can send cookies that will expire as the users close the browser tab. It is also possible to configure cookies for a specified length of time on the client-side.

### The Database Chosen

I have used Postgres as the underlying Database for this application. Some of the reasons to choose postgres are -

- PostgreSQL is known for its architecture, reliability, data integrity, robust feature set, and extensibility. PostgreSQL runs on all major operating systems, has been ACID-compliant since 2001, and has powerful add-ons such as the popular PostGIS geospatial database extender.
- It provides some powerful types of indexing methods like B-tree, Multicolumn, Expressions, Partial, GiST, SPGist, KNN Gist, GIN, BRIN, Bloom filters.
- Postgres helps in improving the performance with Transactions, Nested Transactions (via savepoints), Multi-Version concurrency Control (MVCC), Parallelization of read queries and Declarative Table partitioning.
- Postgres never loses data due to a Write-ahead Looging (WAL)
- PostgreSQL have support for international character sets, e.g. through ICU collations. Use native full-text search to find your text data quickly.
- PostgreSQL has an extension called PostGIS, that is a spatial database extender for PostgreSQL databases. It adds support for geographic objects allowing location queries to be run in SQL.

### Table Design

1. User Table

![Screenshot from 2022-10-01 00-19-08](https://user-images.githubusercontent.com/34435822/193337635-01181514-5a38-42ef-8296-4f65445f43a9.png)

- id (String) - Auto generated UUID
- name (String) - Maximum of 64 characters are allowed
- email (String) - Unique Key (for searching purposes)
- password (String)
- createdAt (Date) - Metadata
- updatedAt (Date) - Metadata
- shortcuts - An array of Shortcuts: A relational field that is connected ot the Shortcut table. Each user can have multiple shortcuts

**Note** - User table is indexed around the _id_ field using the BTree mechanism.

2. Shortcut Table

![Screenshot from 2022-10-01 00-19-17](https://user-images.githubusercontent.com/34435822/193337795-ab388abd-157c-4fee-b1b1-902cd49439fe.png)

- shortlink (String)
- url (String)
- visibility (String) - Allowed values are Workspace and Private
- tags (String Array) - Allows adding multiple tags to a shortcut
- description (String)
- userId (String) - Foreign Key that connects each shortcut to its respective user
- visits (Integer) - Metadata
- createdAt (Data) - Metadata
- updatedAt (Date) - Metadata

**Note** - The Primary Key is a Composite Key created by combining shortlink and userId. This is done to ensure that unique constraints are maintained and each shortcut is unique only to a particular user.

**Note** - This table is indexed around the _userId_ and _shortlink_ field using the BTree mechanism.

### Technology Stack -

- Node.js
- TypeScript
- Jest (for Testing)
- PostgreSQL (for DB)
- Prima (as an ORM)
- Redis (as cache for storing the cookies)
- Docker (for provisioning Postgres DB, Redis Cache, and packing the API)
- Webpack, Babel, and TypeScript Compiler (for compiling .ts files into a single minified and obsfucated version)
- Express

### Coverage Report

Coverage report for the unit test is as follows -
![Screenshot from 2022-09-30 22-04-08](https://user-images.githubusercontent.com/34435822/193337978-a8b1789f-fe45-4f34-bae1-df7f7e116631.png)

- Tests for the Services report a 100% coverage in Unit Tests while Controllers and Routes show a lower coverage due to the need of the Integration Testing.

### Steps to setup and test the application locally

**NOTE** Most of the scripts for this application are written keeping in mind a UNIX based system. Therefore, to operate it on a windows system, from the [package.json](package.json) under the _scripts_ section, remove _sudo_ from wherever it is present

1. Clone the repository -

```
git clone https://github.com/ishubham21/oslash-be
```

2. Install the dependencies -

```
npm install
```

3. Make sure to create an _.env_ file and copy the configurations similar to that given in [.env.example](.env.example).

4. Make sure that the ports 5432 and 6379 are free before moving on to the next step. To kill any activity on the port 5432-

```
npm run kill:p
```

or to kill any activity on the port 6379-

```
npm run kill:r
```

5. Shut down any instances of redis (if already running)

```
npm run redis:down
```

6. Up the DB and Cache

```
npm run compose:db-up
```

7. Verify the containers are running by ensuring the presence of 2 containers - Postgres and Redis

```
npm run list:containers
```

8. Start the local server

```
npm run dev
```

You should now have a server running on [http://localhost:4000](http://localhost:4000)

All of this can alternatively be done by the command -

```
npm run compose:up
```

This would expose the API on [http://localhost:4000](http://localhost:4000)

However, this is not recommended under slow connections due to timeouts while installing a large number of node modules.

#### Some Additional Commands

1. To run the unit tests -

```
npm run test
```

**NOTE** You must have containers up and running for the tests to be successful.

2. Access the Redis CLI inside of the docker container -

```
npm run redis:cli
```

**NOTE** You might need to change the name of the docker container with that given by your machine

3. Generate the build files -

```
npm run build
```

4. Kill the DB and Cache containers -

```
npm run compose:db-down
```

**NOTE** This would not erase any data inside the DB and Cache

5. Formatting

```
npm run format
```

6. Reset the database inside that of the container -

```
npm run db:reset
```

7. To apply migrations to the production DBs

```
npm run db:deploy
```

8. Free the port 4000

```
npm run kill:s
```

9. Visualize the data in the Admin Studio

```
npm run prisma:studio
```

10. Linting -

```
npm run lint:fix
```

### Unique Points -

- PostgreSQL + TypeScript + Redis + Webpack + Docker + Prisma
- Indexing of DB tables around common search paramters in the form of a BTree
- In shortcut table, the **primary key is a composite key formed using userId + shortlink**: Ensures that each link is unique to an individual user
- Modular service-bsed monotith architecture with the ability to be converted in microservices
- **Session-based authentication by using cookies to persist sessions**
- Used **Redis in-memory store for storing session data and persisting** it
- Used Express-session and connect-redis to instantiate sessions for the users
- Session-based middlewares for locking all the unauthorized requests
- Morgan for logging requests in dev env
- **Webpack for TypeScript compilation** for minimum possible bundle with obsfucation and minification
- Build includes **inline-source-map** for efficient debugging of build
- **Docker-compose for DB** - runs both redis and postgres containers
- **Docker-compose for API** - runs and exposes the API on http://localhost:4000
- Single-instance DB and cache connection
- Unit tests in Jest
- Aesc and Desc **sorting based on shortlink, createdAt, updatedAt, no of visits (shortlink hits)**
- Searching based on shortlink (even the substrings work), url, visibility, tags, urls visits (without or within any range)
- Shortcut visbility option (Workspace/Private): Defaults to Workspace
- List parameters can be combined to create a combination of 8 different requests and sorting parameters
- Search parameters can be combined to form over 6! (6 factorial) combinations to search.
