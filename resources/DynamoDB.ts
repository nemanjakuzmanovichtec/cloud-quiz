import type { AWS } from '@serverless/typescript';

const DynamoResources: AWS['resources']['Resources'] = {
  ConnectionsTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: 'ConnectionsTable',
      AttributeDefinitions: [
        {
          AttributeName: 'roomId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'connectionId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'roomId',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'connectionId',
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
