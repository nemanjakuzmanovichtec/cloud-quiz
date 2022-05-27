/* eslint-disable @typescript-eslint/ban-types */
import {
  Context,
  APIGatewayProxyEvent as AWSEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { AWS, AwsIamPolicyStatements } from '@serverless/typescript';
import { AnyObj } from '@utils/types';

export type LambdaFunction = AWS['functions'][''];
export type LambdaFunctionWithIam = LambdaFunction & {
  iamRoleStatements?: AwsIamPolicyStatements;
};
export type AWSContext = Context;

type Obj = {
  [k: string]: unknown;
};
type ObjWithStringValues = {
  [k: string]: string | undefined;
};
type ObjWithStringArrayValues = {
  [k: string]: string[] | undefined;
};
type AsyncHandler<TEvent = AnyObj, TResult = AnyObj> = (
  event: TEvent,
  context: Context
) => void | Promise<TResult>;

export interface APIGatewayProxyEvent<
  Body extends Obj = {},
  PathParameters extends ObjWithStringValues = {},
  QueryStringParameters extends ObjWithStringValues = {},
  MultiValueQueryStringParameters extends ObjWithStringArrayValues = Record<
    string,
    never
  >
> extends Omit<
    AWSEvent,
    | 'body'
    | 'pathParameters'
    | 'queryStringParameters'
    | 'multiValueQueryStringParameters'
  > {
  body: Body;
  pathParameters: PathParameters;
  queryStringParameters: QueryStringParameters;
  multiValueQueryStringParameters: MultiValueQueryStringParameters;
}

export type APIGatewayProxyHandler<
  Body extends Obj = {},
  PathParameters extends ObjWithStringValues = {},
  QueryStringParameters extends ObjWithStringValues = {},
  MultiValueQueryStringParameters extends ObjWithStringArrayValues = Record<
    string,
    never
  >
> = AsyncHandler<
  APIGatewayProxyEvent<
    Body,
    PathParameters,
    QueryStringParameters,
    MultiValueQueryStringParameters
  >,
  APIGatewayProxyResult
>;
