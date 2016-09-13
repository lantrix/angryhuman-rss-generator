# Angry Human RSS Generator

## Deployments

Deployments to AWS Lambda are done with [Serverless](https://serverless.com/)

### Deployment Setup

Details below are from the [Install Serverless](https://github.com/serverless/serverless#quick-start) Quick Start Guide.

| **Step** | **Command** |**Description**|
|---|-------|------|
|  1.  | `npm install -g serverless` | Install Serverless CLI  |
|  2.  | [Set up your Provider credentials](https://github.com/serverless/serverless/blob/master/docs/02-providers/aws/01-setup.md) | Connect Serverless with your provider |
|  3.  | `cd angryhuman-rss-generator` | Change into your service directory  |
|  4.  | `serverless deploy` | Deploy to your AWS account  |
|  5.  | `serverless invoke --function hello` | Run the function we just deployed  |
