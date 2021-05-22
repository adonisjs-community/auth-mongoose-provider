# AdonisJS Mongoose Auth provider
> An implementation of AdonisJS auth user provider using the mongoose ORM.

Make sure to read the documentation for the [Custom user provider](https://docs.adonisjs.com/guides/auth/custom-user-provider) and then go through the implementation of **MongoDBAuthProvider**.

- The source code is stored inside the `providers/MongoDbAuthProvider/index.ts` file.
- The provider is registerd with the auth module inside the `providers/AppProvider.ts` file.
- Everything else is just using the same AdonisJS API's to login and authenticate a user.


## Usage

- Clone the repo
- Run `npm install` to install the dependencies
- Copy the `.env.example` file to `.env`
- Make sure you have MongoDB installed and double check the `start/mongoose.ts` file to check the connection details
- Create a dummy user using the REPL.
- Open browser and try login
