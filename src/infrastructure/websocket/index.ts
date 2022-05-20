import {
  ApiGatewayManagementApiClient,
  ApiGatewayManagementApiClientConfig,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { makeWSClient } from './ws-client';

export const buildConfig = (): ApiGatewayManagementApiClientConfig => {
  const isServerlessOffline = !!process.env.IS_OFFLINE;

  const config: ApiGatewayManagementApiClientConfig = {
    region: process.env.REGION,
    endpoint: process.env.WS_ENDPOINT,
  };

  if (isServerlessOffline) {
    return { ...config, endpoint: 'http://localhost:3001' };
  }

  return config;
};

const makeApiGatewayWSClient = (
  config: ApiGatewayManagementApiClientConfig
) => {
  return new ApiGatewayManagementApiClient(config);
};

const config = buildConfig();
const client = makeApiGatewayWSClient(config);
const WSClient = makeWSClient({ client });

export { WSClient };
