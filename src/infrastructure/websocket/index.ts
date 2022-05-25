import { ApiGatewayWSClient } from './api-gateway-ws-client';
import { makeWSClient } from './ws-client';

const WSClient = makeWSClient({ client: ApiGatewayWSClient });

export { WSClient };
