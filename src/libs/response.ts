import { APIGatewayProxyResult } from 'aws-lambda';

enum ResponseCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INVALID_SERVER_ERROR = 500,
}

enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

type ResponseBody = Record<string, unknown> | string;
type ResponseHeaders = { [k: string]: unknown };
type ResponseMethod = (
  body?: ResponseBody,
  headers?: ResponseHeaders
) => APIGatewayProxyResult;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
};

const response = (
  statusCode: number,
  body: ResponseBody,
  headers?: ResponseHeaders
): APIGatewayProxyResult => ({
  statusCode,
  body: typeof body === 'string' ? body : JSON.stringify(body),
  headers: { ...defaultHeaders, ...headers },
});

const responseMethod =
  (status: number): ResponseMethod =>
  (body = {}, headers) => {
    const wrappedBody = {
      status:
        status === ResponseCode.OK
          ? ResponseStatus.SUCCESS
          : ResponseStatus.ERROR,
      statusCode: status,
      data: body,
    };

    console.log(`Returning a ${status} response with body: `, wrappedBody);

    return response(status, wrappedBody, headers);
  };

export const OK = responseMethod(ResponseCode.OK);
export const BAD_REQUEST = responseMethod(ResponseCode.BAD_REQUEST);
export const UNAUTHORIZED = responseMethod(ResponseCode.UNAUTHORIZED);
export const FORBIDDEN = responseMethod(ResponseCode.FORBIDDEN);
export const NOT_FOUND = responseMethod(ResponseCode.NOT_FOUND);
export const SERVER_ERROR = responseMethod(ResponseCode.INVALID_SERVER_ERROR);
