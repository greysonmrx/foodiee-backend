<div align="center">
  <img src="./.github/logo.png" height="200px" alt="Foodiee"/>
</div>

<h3 align="center">
  A food delivery system - Delivery in minutes to your Home
</h3>

<div align="center">
  <img alt="Made by Greyson Mascarenhas" src="https://img.shields.io/badge/made%20by-Greyson%20Mascarenhas-%23144DDE"/>
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/greysonmrx/foodiee?color=%23144DDE">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-%23144DDE"/>
</div>

<p align="center">
  <a href="#features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#repositories">Repositories</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">License</a>
</p>

## :rocket: Technologies

Technologies I used to develop this api

- **Express** — Fast, unopinionated, minimalist web framework for Node.js.
- **BcryptJS** - Optimized bcrypt in plain JavaScript with zero dependencies.
- **Class Transformer** - Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors.
- **Cors** - Node.js CORS middleware.
- **Celebrate** -A joi validation middleware for Express.
- **Dotenv** - Loads environment variables from .env for nodejs projects.
- **Tsyringe** - Lightweight dependency injection container for JavaScript/TypeScript.
- **Husky** - Git hooks made easy.
- **Commitlint** - Lint commit messages.
- **Jest** - Delightful JavaScript Testing.
- **Supertest** - Super-agent driven library for testing node.js HTTP servers using a fluent API.
- **Commitizen** - Create committing rules for projects.
- **Lint Staged** - Run linters on git staged files.
- **Express Async Errors** - A dead simple ES6 async/await support hack for ExpressJS.
- **Json Web Token** - JsonWebToken implementation for Node.js.
- **Multer** -  Node.js middleware for handling multipart/form-data.
- **Typeorm** -  ORM for TypeScript and JavaScript.
- **Date Fns** - Modern JavaScript date utility library.
- **Eslint** - Pluggable JavaScript linter.
- **Prettier** - An opinionated code formatter.
- **VS Code** - Code Editing.
- **EditorConfig** - Helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs.

## :hammer_and_wrench: Tests

Tests I did to develop this api (more than 350)

<details>
  <summary>Users</summary>

  - **List users**
      - [x] should be able to list all users
      - [x] should not be able to list all users without a token
      - [x] should not be able to list all users with a invalid token
      - [x] should not be able to list the user accessing the route
  - **Create users**
      - [x] should be able to create a new user
      - [x] should not be able to create a new user without a token
      - [x] should not be able to create a new user with a invalid token
      - [x] should not be able to create two users with the same email
      - [x] should not be able to create a new user with no name
      - [x] should not be able to create a new user without e-mail
      - [x] should not be able to create a new user with an invalid e-mail
      - [x] should not be able to create a new user without a password
      - [x] should not be able to create a new user with a password of less than 6 digits
  - **Update users**
      - [x] should be able to update a user profile
      - [x] should not be able to update a user without a token
      - [x] should not be able to update a user with a invalid token
      - [x] should not be able to update the profile of a non-existent user
      - [x] should not be able to update a user profile with no name
      - [x] should not be able to update a user profile without a e-mail
      - [x] should not be able to update user profile with duplicate email
      - [x] should not be able to update a user profile with a invalid e-mail
      - [x] should not be able to update a user profile without the current password when a new password exists
      - [x] should not be able to update user profile with an incorrect password
      - [x] should not be able to update user profile with a new password of less than 6 digits
      - [x] should not be able to update user profile with a current password of less than 6 digits
  - **Delete users**
      - [x] should not be able to delete a user without a token
      - [x] should be able to delete a user
      - [x] should not be able to delete a user with a invalid token
      - [x] should not be able to delete a non-existing user
  - **Authentication users**
      - [x] should be able to authenticate a user with valid credentials
      - [x] should not be able to authenticate a user with the wrong e-mail
      - [x] should not be able to authenticate a user with the wrong password
      - [x] should not be able to authenticate a user without e-mail
      - [x] should not be able to authenticate a user with an invalid e-mail
      - [x] should not be able to authenticate a user without a password
      - [x] should not be able to authenticate a user with a password of less than 6 digits
  - **Update the user avatar**
      - [x] should be able to update the user avatar
      - [x] should not be able to update the user avatar without a token
      - [x] should not be able to update the user avatar with a invalid token
      - [x] should not be able to update the user avatar with invalid file id
      - [x] should not be able to update avatar with a non-existing file
      - [x] should not be able to update avatar of a non-existing user
</details>

---
<details>
  <summary>Tenants</summary>

  - **List tenants**
    - [x] should be able to list all tenants
    - [x] should not be able to list all tenants without a token
    - [x] should not be able to list all tenants with a invalid token
  - **Create tenants**
      - [x] should be able to create a new tenant
      - [x] should not be able to create a new tenant without a token
      - [x] should not be able to create a new tenant with a invalid token
      - [x] should not be able to create a new tenant with duplicate slug
      - [x] should not be able to create a new tenant with no name
      - [x] should not be able to create a new tenant without a slug
  - **Update tenants**
      - [x] should be able to update a tenant
      - [x] should not be able to update a tenant without a token
      - [x] should not be able to update a tenant with a invalid token
      - [x] should not be able to update a non-existing tenant
      - [x] should not be able to update a tenant with duplicate slug
      - [x] should not be able to update a tenant with no name
      - [x] should not be able to update a tenant without a slug
      - [x] should not be able to update a tenant with an invalid id
  - **Update tenant logo**
      - [x] should be able to update a tenant logo
      - [x] should be able to delete the old tenant logo when updating a new one
      - [x] should not be able to update a tenant logo without a token
      - [x] should not be able to update a tenant with a invalid token
      - [x] should not be able to update the logo of a non-existing tenant
      - [x] should not be able to update the logo with an invalid tenant id
      - [x] should not be able to update the tenant logo with an invalid id
      - [x] should not be able to update the tenant logo with a non-existing file
  - **Delete tenants**
      - [x] should not be able to delete a tenant without a token
      - [x] should be able to delete the tenant logo when deleting a tenant
      - [x] should not be able to delete a tenant with a invalid token
      - [x] should not be able to delete a tenant with invalid id
      - [x] should not be able to delete a non-existing tenant
</details>

---
<details>
  <summary>Customers</summary>

  - **Create customers**
      - [x] should be able to create a new customer
      - [x] should not be able to create two customers with the same phone
      - [x] should not be able to create two customers with the same email
      - [x] should not be able to create a new customer with no name
      - [x] should not be able to create a new customer without a email
      - [x] should not be able to create a new customer with a invalid email
      - [x] should not be able to create a new customer without a phone
      - [x] should not be able to create a new customer with a invalid phone
  - **Update customers**
      - [x] should be able to update a customer
      - [x] should not be able to update a customer without a token
      - [x] should not be able to update a customer with a invalid token
      - [x] should not be able to update a non-existing customer
      - [x] should not be able to update a customer with duplicate phone
      - [x] should not be able to update a customer with no name
      - [x] should not be able to update a customer without a phone
      - [x] should not be able to update a customer with a invalid phone
      - [x] should not be able to update a customer with a invalid social security
  - **Delete customers**
      - [x] should be able to delete a customer
      - [x] should not be able to delete a customer without a token
      - [x] should not be able to delete a customer with a invalid token
      - [x] should not be able to delete a non-existing customer
  - **Send customer token**
      - [x] should be able to send a customer token
      - [x] should not be able to send a customer token with a non-existing customer
      - [x] should not be able to send a customer token without a phone
      - [x] should not be able to send a customer token with a invalid phone
  - **Validate customer token**
      - [x] should be able to validate a customer token
      - [x] should not be able to validate a customer token with a non-existing customer
      - [x] should not be able to validate a non-existing customer token
      - [x] should not be able to validate a customer token from a different customer
      - [x] should not be able to validate a customer token if passed more than fifteen minutes
      - [x] should not be able to validate a customer token without a phone
      - [x] should not be able to validate a customer token with a invalid phone
      - [x] should not be able to validate a customer token without a token
      - [x] should not be able to validate a customer token with a invalid token
</details>

---
<details>
  <summary>Products</summary>

  - **List products**
    - [x] should be able to list all products
    - [x] should not be able to list all products without a token
    - [x] should not be able to list all products with a invalid token
    - [x] should not be able to list all products with a non-existing tenant
  - **Create products**
      - [x] should be able to create a new product
      - [x] should not be able to create a new product without a token
      - [x] should not be able to create a new product with a invalid token
      - [x] should not be able to create a new product with a non-existing tenant
      - [x] should not be able to create a new product with a non-existing category
      - [x] should not be able to create a new product with a non-existing file
      - [x] should not be able to create a new product with no name
      - [x] should not be able to create a new product without a description
      - [x] should not be able to create a new product without a price
      - [x] should not be able to create a new product with a invalid price
      - [x] should not be able to create a new product with a invalid promotion price
      - [x] should not be able to create a new product without a category id
      - [x] should not be able to create a new product with a invalid category id
      - [x] should not be able to create a new product with a invalid image id
      - [x] should not be able to create a new product with a invalid paused value
      - [x] should not be able to create a new product with a invalid tenant id
  - **Update products**
      - [x] should be able to update a product
      - [x] should not be able to update a product without a token
      - [x] should not be able to update a product with a invalid token
      - [x] should not be able to update a product with a non-existing tenant
      - [x] should not be able to update a product with a non-existing category
      - [x] should not be able to update a non-existing product
      - [x] should not be able to update a product with a non-existing file
      - [x] should not be able to update a product with no name
      - [x] should not be able to update a product without a product id
      - [x] should not be able to update a product with a invalid product id
      - [x] should not be able to update a product without a description
      - [x] should not be able to update a product without a price
      - [x] should not be able to update a product with a invalid price
      - [x] should not be able to update a product with a invalid promotion price
      - [x] should not be able to update a product without a category id
      - [x] should not be able to update a product with a invalid category id
      - [x] should not be able to update a product with a invalid image id
      - [x] should not be able to update a product with a invalid paused value
      - [x] should not be able to update a product with a invalid tenant id
  - **Delete products**
      - [x] should be able to delete a product
      - [x] should not be able to delete a product without a token
      - [x] should not be able to delete a product with a invalid token
      - [x] should not be able to delete a product with a non-existing tenant
      - [x] should not be able to delete a non-existing product
</details>

---
<details>
  <summary>Product Categories</summary>

  - **List product categories**
    - [x] should be able to list all product categories
    - [x] should not be able to list all product categories without a token
    - [x] should not be able to list all product categories with a invalid token
    - [x] should not be able to list all product categories with a non-existing tenant
    - [x] should not be able to list all product categories with a invalid tenant id
  - **Create product categories**
      - [x] should be able to create a new product category
      - [x] should not be able to create a new product category without a token
      - [x] should not be able to create a new product category with a invalid token
      - [x] should not be able to create a new product category with a non-existing tenant
      - [x] should not be able to create a new product category with duplicate name
      - [x] should not be able to create a new product category with no name
      - [x] should not be able to create a new product category with a invalid tenant id
  - **Update product categories**
      - [x] should be able to update a product category
      - [x] should not be able to update a product category without a token
      - [x] should not be able to update a product category with a invalid token
      - [x] should not be able to update a product category with a non-existing tenant
      - [x] should not be able to update a non-existing product category
      - [x] should not be able to update a product category with duplicate name
      - [x] should not be able to update a product category with no name
      - [x] should not be able to update a product category with a invalid tenant id
      - [x] should not be able to update a product category without id
      - [x] should not be able to update a product category with a invalid id
  - **Delete product categories**
      - [x] should be able to delete a product category
      - [x] should not be able to delete a product category without a token
      - [x] should not be able to delete a product category with a invalid token
      - [x] should not be able to delete a product category with a non-existing tenant
      - [x] should not be able to delete a non-existing product category
      - [x] should not be able to delete a product category with a invalid tenant id
      - [x] should not be able to delete a product category with a invalid id
</details>

---
<details>
  <summary>Complements</summary>

  - **Create complements**
      - [x] should be able to create a new complement
      - [x] should not be able to create a new complement without a token
      - [x] should not be able to create a new complement with a invalid token
      - [x] should not be able to create a new complement with a non-existing category
      - [x] should not be able to create a new complement with no name
      - [x] should not be able to create a new complement without a category id
      - [x] should not be able to create a new complement with a invalid category id
      - [x] should not be able to create a new complement without a price
      - [x] should not be able to create a new complement with a invalid price
  - **Update complements**
      - [x] should be able to update a complement
      - [x] should not be able to update a complement without a token
      - [x] should not be able to update a complement with a invalid token
      - [x] should not be able to update a non-existing complement
      - [x] should not be able to update a complement with no name
      - [x] should not be able to update a complement without a price
      - [x] should not be able to update a complement with a invalid price
  - **Delete complements**
      - [x] should be able to delete a complement
      - [x] should not be able to delete a complement without a token
      - [x] should not be able to delete a complement with a invalid token
      - [x] should not be able to delete a non-existing complement
</details>

---
<details>
  <summary>Complement Categories</summary>

  - **List complement categories**
    - [x] should be able to list all complement categories
    - [x] should not be able to list all complement categories without a token
    - [x] should not be able to list all complement categories with a invalid token
    - [x] should not be able to list all complement categories with invalid product id
  - **Create complement categories**
      - [x] should be able to create a new complement category
      - [x] should not be able to create a new complement category without a token
      - [x] should not be able to create a new complement category with a invalid token
      - [x] should not be able to create a new complement category with a non-existing product
      - [x] should not be able to create a new complement category with no name
      - [x] should not be able to create a new complement category with a invalid tenant id
      - [x] should not be able to create a new complement category without a minimum amount
      - [x] should not be able to create a new complement category with a invalid minimum amount
      - [x] should not be able to create a new complement category without a maximum amount
      - [x] should not be able to create a new complement category with a invalid maximum amount
      - [x] should not be able to create a new complement category without a required value
      - [x] should not be able to create a new complement category with a invalid required value
      - [x] should not be able to create a new complement category without a product id
      - [x] should not be able to create a new complement category with a invalid product id
  - **Update complement categories**
      - [x] should be able to update a complement category
      - [x] should not be able to update a complement category without a token
      - [x] should not be able to update a complement category with a invalid token
      - [x] should not be able to update a non-existing complement category
      - [x] should not be able to update a complement category with no name
      - [x] should not be able to update a complement category with a invalid id
      - [x] should not be able to update a complement category without a minimum amount
      - [x] should not be able to update a complement category with a invalid minimum amount
      - [x] should not be able to update a complement category without a maximum amount
      - [x] should not be able to update a complement category with a invalid maximum amount
      - [x] should not be able to update a complement category without a required value
      - [x] should not be able to update a complement category with a invalid required value
  - **Delete complement categories**
      - [x] should be able to delete a complement category
      - [x] should not be able to delete a complement category without a token
      - [x] should not be able to delete a complement category with a invalid token
      - [x] should not be able to delete a non-existing complement category
      - [x] should not be able to delete a complement category with invalid id
</details>

---
<details>
  <summary>Files</summary>

  - **Create files**
      - [x] should be able to create a new file
      - [x] should not be able to create a new file without a token
      - [x] should not be able to create a new file with a invalid token
</details>

## :information_source: How To Use

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: I recommend use docker

**Clone the project and access the folder**

```bash
$ git clone https://github.com/greysonmrx/foodiee-backend.git && cd foodiee-backend
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment
$ cp .env.example .env

# Create the instance of postgreSQL using docker
$ docker run --name foodiee-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=gobarber -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Create the instance of mongoDB using docker
$ docker run --name foodiee-mongodb -p 27017:27017 -d -t mongo

# Create the instance of redis using docker
$ docker run --name foodiee-redis -p 6379:6379 -d -t redis:alpine

# Once the services are running, run the migrations
$ yarn typeorm migration:run

# To finish, run the api service
$ yarn dev:server

# Well done, project is started!
```

## :memo: License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.

---

Made with :hearts: by Greyson :wave: [See my linkedin](https://www.linkedin.com/in/greyson-mascarenhas-5a21ab1a2/)
