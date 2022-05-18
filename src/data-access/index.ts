import { DynamoDBAdapter } from '@infrastructure/adapters';

import { makeConnectionDb } from './connection-db';

const connectionDb = makeConnectionDb({
  db: DynamoDBAdapter,
});

export { connectionDb };
