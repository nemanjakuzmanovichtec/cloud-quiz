import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables generated from serverless.yml
config({ path: resolve(__dirname, '../../.env') });
