# Restart Words 
Restart Words is a puzzle game, inspired by a certain other word game. It contains daily puzzles or custom puzzles up to 10 characters long. You can also create an account using Discord, to track your progress across devices every day!

## Using Restart Words
To use Restart Words, you have 2 options.

### Using the hosted instance
If you don't want to self host, you can use the instance that I host at https://words.restartb.xyz

### Self hosting
If you want to self host your own instance of Restart Words, follow these instructions:
1. pull the repo from GitHub
2. run `npm install` to install dependencies
3. copy the example `.env.example` file to `.env`, then fill in the required information
4. run `npm run db:push` to create the database and required tables
5. run `npm run build` to build the project
6. run `node --env-file=.env build` to run the server

### Developing
If you wish to contribute to Restart Words, here's how to run the dev server:
1. pull the repo from GitHub
2. run `npm install` to install dependencies
3. copy the example `.env.example` file to `.env`, then fill in the required information
4. run `npm run db:push` to create the database and required tables
5. run `npm run dev` to start the Vite dev server

It is recommended to format your code using Prettier, and lint with eslint.
