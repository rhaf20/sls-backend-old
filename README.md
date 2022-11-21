# Serverless framework for IoT Web Portal

## Project Structure
+ DB management
+ Deployment configuration
+ Interfaces
+ Lib
    + Response map
    + Request validator
    + Auth wrapper
    + Utility
+ Serverless
    + Building
    + System
    + User
    + Command
    + Control
    + Process

## Tech stack
[Serverless Framework](https://github.com/serverless)
[Node.js](https://nodejs.org)
[Typescript](https://www.typescriptlang.org/)
[AWS SDK](https://aws.amazon.com/tools/)
[AWS Lambda](https://aws.amazon.com/lambda/)
[AWS IoT Core](https://aws.amazon.com/iot-core/)
[MySQL](https://www.mysql.com/)
[DynamoDB](https://aws.amazon.com/dynamodb/)

## Installation

* [Install latest node.js](https://nodejs.org​)
* [Install latest serverless](https://www.serverless.com/framework/docs/getting-started/)
* [Install AWS CLI](https://aws.amazon.com/cli/)

## Install serverless
`npm install -g serverless`

## Install AWS CLI and set serverless config credentials
`serverless config credentials --provider aws --key AWS_ACCESS_KEY --secret AWS_ACCESS_SECRET --overwrite`
If you use same OS for Frontend (React) and already export the key and secret, no need to config again. Because they are same.

## Install node packages
`npm install`

## Run local server
`npm run start:admin:dev`

## Generate migration files for MySQL
`npm run generate:migration:dev`

## Migrate migration files
`npm run migrate:dev`

## Deploy to AWS
`npm run deploy:admin:dev`
