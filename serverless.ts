import type { AWS } from '@serverless/typescript';
import * as functions from '@functions';

// General
const SERVICE_NAME = 'cloud-quiz';
const FRAMEWORK_VERSION = '3';
const PROVIDER_NAME = 'aws';
const RUNTIME = 'nodejs14.x';
const REGION: AWS['provider']['region'] = 'eu-central-1';

// Lambda
const DEFAULT_LAMBDA_MEMORY_SIZE_MB = 128;
const DEFAULT_LAMBDA_TIMEOUT_SECONDS = 3;
const LOG_RETENTION_IN_DAYS = 7;

// Websockets
const WS_API_NAME = 'cloud-quiz-ws-api-${sls:stage}';
const WS_API_ROUTE_SELECTION_EXPRESSION = '$request.body.action';

const serverlessConfiguration: AWS = {
  service: SERVICE_NAME,
  frameworkVersion: FRAMEWORK_VERSION,
  useDotenv: true,
  provider: {
    name: PROVIDER_NAME,
    runtime: RUNTIME,
    region: REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    memorySize: DEFAULT_LAMBDA_MEMORY_SIZE_MB,
    timeout: DEFAULT_LAMBDA_TIMEOUT_SECONDS,
    logRetentionInDays: LOG_RETENTION_IN_DAYS,
    versionFunctions: false,
    websocketsApiName: WS_API_NAME,
    websocketsApiRouteSelectionExpression: WS_API_ROUTE_SELECTION_EXPRESSION,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      WS_ENDPOINT: {
        'Fn::Join': [
          '',
          [
            'https://',
            { Ref: 'WebsocketsApi' },
            '.execute-api.${self:provider.region}.amazonaws.com/${sls:stage}',
          ],
        ],
      },
    },
  },
  package: { individually: true },
  plugins: ['serverless-esbuild', 'serverless-offline'],
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  functions: { ...functions },
};

module.exports = serverlessConfiguration;
