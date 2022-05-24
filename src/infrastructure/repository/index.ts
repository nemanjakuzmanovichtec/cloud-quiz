import { makeConnectionDb } from './connection-db';
import { ddbBaseRepository } from './ddb-base-repository';

const connectionDb = makeConnectionDb({ repository: ddbBaseRepository });

export { connectionDb };
