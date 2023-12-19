# Leads App

This is a backend API built using Express.js framework for an leads app . The API provides several features including:

- Register user
- Login user
- Create plans
- Subscriptions to Plan
- Search leads
- Limit leads based on subscriptions to Plan
- Data Validation and sanitazation

## INSTALLATION

### Requirements

> For development, you need to have node installed and npm package installed in your environment.

#### Node

##### Node installation on windows

> Just go to the [Nodejs website](https://nodejs.org) and download the installer.
> in addition, make sure you have `git` available in your path. `npm` migth need it. Find it [here](https://git-scm.com)

##### Node installation on Linux and other operating system

> Refer to the [documentation](https://nodejs.org) and offical npm website [npm website](https://npmjs.com)

#### NPM installation

```ps
npm install
```

### Project Installaton

> clone the project, by running the commands below in your terminal.

```ps
git clone https://github.com/leandreAlly/leads-b.git
```

```ps
cd leads-b
```

> package installation

```ps
npm install
```

### Running the app

> Before running the project locally, make sure you have all required environment variables in your .env file.
> you can find the required environment variables in `.env.example` file.

#### Database Url Connection

You can add your mongodb connection url string in .env fille

> development mode

```ps
npm run dev
```

> production mode

```ps
npm run start
```
