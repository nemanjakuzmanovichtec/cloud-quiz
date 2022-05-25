import {
  ApiGatewayManagementApiClient,
  ApiGatewayManagementApiClientConfig,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { AnyObj } from '@utils/types';

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
  const client = new ApiGatewayManagementApiClient(config);

  const postToConnection = async (ConnectionId: string, Data: Uint8Array) => {
    try {
      console.log('Executing PostToConnectionCommand with:', {
        ConnectionId,
        Data,
      });

      const command = new PostToConnectionCommand({ ConnectionId, Data });
      const output = await client.send(command);

      console.log('PostToConnectionCommand executed successfully:', output);

      return output;
    } catch (error) {
      console.error('Websocket ERROR:', error);
    }
  };

  const serializePayload = (payload: AnyObj) => {
    return Buffer.from(JSON.stringify(payload));
  };

  return { postToConnection, serializePayload };
};

const config = buildConfig();
const client = makeApiGatewayWSClient(config);

export { client as ApiGatewayWSClient };
