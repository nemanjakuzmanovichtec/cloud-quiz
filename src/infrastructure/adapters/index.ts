import { makeDynamoDBAdapter } from './dynamo';
import { makeWSApiGatewayClientAdapter } from './ws-client.adapter';
import { DynamoClient } from '../db/dynamo-client';
import { WSApiGatewayClient } from '../websocket/ws-api-gateway-client';

const DynamoDBAdapter = makeDynamoDBAdapter({ DynamoDB: DynamoClient });
const WSApiGatewayClientAdapter = makeWSApiGatewayClientAdapter({
  client: WSApiGatewayClient,
});

export { DynamoDBAdapter, WSApiGatewayClientAdapter };
