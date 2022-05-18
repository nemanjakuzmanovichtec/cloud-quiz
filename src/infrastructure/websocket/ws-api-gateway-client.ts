import {
  ApiGatewayManagementApiClient,
  ApiGatewayManagementApiClientConfig,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

export const makeWSClient = (
  configuration: ApiGatewayManagementApiClientConfig
) => {
  const client = new ApiGatewayManagementApiClient(configuration);

  const sendToOne = async (
    connectionId: string | undefined,
    payload: Record<string, unknown>
  ) => {
    if (!connectionId) {
      throw new Error('connectionId is required to send a message');
    }

    const params = {
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify(payload)),
    };

    const command = new PostToConnectionCommand(params);

    try {
      return await client.send(command);
    } catch (error) {
      throw new Error('PostToConnectionCommand unsuccessful');
    }
  };

  const sendToMany = async (
    connectionIds: string[],
    payload: Record<string, unknown>
  ) => {
    const all = connectionIds.map((connectionId) =>
      sendToOne(connectionId, payload)
    );

    return Promise.all(all);
  };

  return { sendToOne, sendToMany };
};

export const makeEndpoint = () => {
  const isServerlessOffline = !!process.env.IS_OFFLINE;
  const endpoint = isServerlessOffline
    ? 'http://localhost:3001'
    : process.env.WS_ENDPOINT;

  return endpoint;
};

const WSApiGatewayClient = makeWSClient({ endpoint: makeEndpoint() });

export { WSApiGatewayClient };
