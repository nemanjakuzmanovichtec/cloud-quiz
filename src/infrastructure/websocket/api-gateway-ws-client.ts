import {
  ApiGatewayManagementApiClient,
  ApiGatewayManagementApiClientConfig,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { AnyObj } from '@utils/types';

interface Dependencies {
  apiGatewayClient: ApiGatewayManagementApiClient;
}

export const makeApiGatewayWSClient = ({ apiGatewayClient }: Dependencies) => {
  const postToConnection = async (ConnectionId: string, Data: Uint8Array) => {
    try {
      console.log('Executing PostToConnectionCommand with:', {
        ConnectionId,
        Data,
      });

      const command = new PostToConnectionCommand({ ConnectionId, Data });
      const output = await apiGatewayClient.send(command);

      console.log('PostToConnectionCommand executed successfully:', output);

      return output;
    } catch (error) {
      console.error('Websocket ERROR:', error);
    }
  };

  const serializePayload = (payload: AnyObj) => {
    return new Uint8Array(Buffer.from(JSON.stringify(payload)));
  };

  return { postToConnection, serializePayload };
};

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

const buildApiGWClient = (config: ApiGatewayManagementApiClientConfig) => {
  return new ApiGatewayManagementApiClient(config);
};

const config = buildConfig();
const apiGatewayClient = buildApiGWClient(config);
const client = makeApiGatewayWSClient({ apiGatewayClient });

export { client as ApiGatewayWSClient };
