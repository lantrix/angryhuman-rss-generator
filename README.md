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

### Configuration

Populate the YML configuration file `config.yml`

```yaml
# Serverless.yml config
globalSchedule: rate(1 hour) #event schedule as per http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
bucket: angryhumanrss #The S3 bucket to create
region: us-east-1 #AWS region to publish lambda functions to

# Handler runtime config set
default:
  sourceRssUri: http://www.mediafire.com/rss.php?key=jyk6j7ogc076r #Source RSS of published mp3s
  bucket: angryhumanrss #The S3 bucket to host the data and XML (same as above)
  region: us-east-1 #AWS region to use for aws-sdk in the function
  dataKey: data/rssdata #The S3 key to read known RSS items from
  dataOutKey: data/rssdata-out #The S3 key to write updated known RSS items to (different for debugging; same for prod)
  rssKey: angryhuman.xml #The S3 key to publish the RSS XML to
```

### Deploy function

| **Step** | **Command** |**Description**|
|---|-------|------|
|  1.  | `serverless deploy -v` | Deploy to your AWS account  |
|  2.  | `serverless invoke --function generaterss` | Run the function we just deployed  |

### Find out published XML URI

    aws cloudformation describe-stacks --stack-name angryhuman-rss-generator-dev --query Stacks[].Outputs[]

The xml is published on the S3 backed website at `/angryhuman.xml`