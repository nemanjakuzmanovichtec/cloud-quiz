import type { AWS } from '@serverless/typescript';

const DynamoResources: AWS['resources']['Resources'] = {
  ConnectionsTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      AttributeDefinitions: [
        {
          AttributeName: 'connectionId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'roomId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'connectionId',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'roomId',
          KeyType: 'RANGE',
        },
      ],
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      TimeToLiveSpecification: {
        AttributeName: 'TTL',
        Enabled: true,
      },
    },
  },
};

export default DynamoResources;
