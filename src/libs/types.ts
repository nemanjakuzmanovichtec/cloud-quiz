/* eslint-disable @typescript-eslint/ban-types */
import {
  Context,
  APIGatewayProxyEvent as AWSEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { AWS } from '@serverless/typescript';

export type LambdaFunction = AWS['functions'][''];
export type AWSContext = Context;
export type AnyObj = Record<string, unknown>;
export type EmptyObj = Record<string, never>;

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
