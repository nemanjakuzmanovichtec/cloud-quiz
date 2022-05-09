import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

const isServerlessOffline = !!process.env.IS_OFFLINE;
const endpoint = isServerlessOffline
  ? 'http://localhost:3001'
  : process.env.WS_ENDPOINT;

const client = new ApiGatewayManagementApiClient({ endpoint });

const sendToAll = async (
  connectionIds: string[],
  payload: Record<string, unknown>
) => {
  const all = connectionIds.map((connectionId) =>
    sendToOne(connectionId, payload)
  );

  return Promise.all(all);
};

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
    return client.send(command);
  } catch (error) {
    throw new Error('PostToConnectionCommand unsuccessful');
  }
};

export { sendToOne, sendToAll };
