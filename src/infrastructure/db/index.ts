import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { makeDynamoDb } from './dynamo-client';

export const buildConfig = (): DynamoDBClientConfig => {
  const isServerlessOffline = !!process.env.IS_OFFLINE;

  const config = { region: process.env.REGION };

  if (isServerlessOffline) {
    return { ...config, endpoint: 'http://localhost:8000' };
  }

  return config;
};

const makeDocumentClient = (config: DynamoDBClientConfig) => {
  const bareBonesClient = new DynamoDBClient(config);

  const marshallOptions = {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
  };

  const unmarshallOptions = {
    wrapNumbers: false,
  };

  const translateConfig = { marshallOptions, unmarshallOptions };

  return DynamoDBDocumentClient.from(bareBonesClient, translateConfig);
};

const config = buildConfig();
const client = makeDocumentClient(config);
const dynamoDb = makeDynamoDb({ client });

export { dynamoDb as DB };
