import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { withApiHooks } from '@application/hooks/withApiHooks';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

type IdToken = CognitoIdTokenPayload & { email?: string };

const UserPoolId = process.env.USER_POOL_ID;
const AppClientId = process.env.APP_CLIENT_ID;

export const handler: APIGatewayRequestAuthorizerHandler = async (event) => {
  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: UserPoolId,
      tokenUse: 'id',
      clientId: AppClientId,
    });

    const encodedToken = event.headers.Auth;
    const payload = await verifier.verify(encodedToken);
    console.log('Token is valid. Payload:', payload);

    return allowPolicy(event.methodArn, payload);
  } catch (error) {
    console.log(error.message);
    return denyAllPolicy();
  }
};

const denyAllPolicy = () => {
  return {
    principalId: '*',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: '*',
          Effect: 'Deny',
          Resource: '*',
        },
      ],
    },
  };
};

const allowPolicy = (methodArn: string, idToken: IdToken) => {
  return {
    principalId: idToken.sub,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: methodArn,
        },
      ],
    },
    context: {
      userId: idToken.sub,
      email: idToken.email,
    },
  };
};

export const main = withApiHooks(handler);
