### Server Folder structure
```
/src
│
├── /config # Contains app configuration files
│ └── db.js # Database connection setup
│
├── /controllers # Contains controller logic for routes
│ └── auth.controller.js
│
├── /models # database interaction
│ └── user.js
│
├── /routes # Contains route definitions
│ └── auth.route.js
│
├── /services # Contains business logic and database interaction
│ └── authServices.js
│
├── /utils # Contains utility functions (e.g., error handling)
│ └── token.js
│
├── /middlewares # Contains middleware (e.g., auth)
│ └── requireAuth.js
│
├── /errors # errors handling instance(e.g., `APIError`)
│ └── index.js
│
├── index.js # Express app setup
├── package.json
└── README.md
```

### Architecture

- Three layer approach
```
client ---> routes ----> (layer 1) controllers -------> (layer 2) services (business logic) -------> (layer 3) models (access resource from database)
```
