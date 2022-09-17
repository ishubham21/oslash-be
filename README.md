## Oslash

Unique Points -

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

#### Postman Collection can be found [here](https://www.postman.com/dark-resonance-160564/workspace/646a5acd-0790-45a7-a1d6-ab3b78e1452e/collection/13812176-1c6429c9-f7de-4805-a12a-c01963df2d9a?action=share&creator=13812176)

API Documentation and use-guide can be accessed from the collection itself. Steps are -
- Near the _oslash_ folder, click on the three buttons to expand options
- From the options, select _View Documentation_

#### Todo

- [] Readme Documentation
- [] Tests
- [] Add Redis HOST, and Prisma DB_URL in vercel env
- [] Complete comments in the code
