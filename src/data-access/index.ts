import { DB } from '@infrastructure/db';

import { makeConnectionDb } from './connection-db';

const connectionDb = makeConnectionDb({ DB });

export { connectionDb };
