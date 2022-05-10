import type { AWS } from '@serverless/typescript';

const CognitoResources: AWS['resources']['Resources'] = {
  CognitoUserPool: {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
      UserPoolName: '${self:service}-user-pool-${sls:stage}',
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireUppercase: false,
          RequireSymbols: false,
        },
      },
      // AdminCreateUserConfig: {
      //   AllowAdminCreateUserOnly: true,
      // },
      AccountRecoverySetting: {
        RecoveryMechanisms: [
          {
            Name: 'verified_email',
            Priority: 1,
          },
        ],
      },
    },
  },
  CognitoUserPoolClient: {
    Type: 'AWS::Cognito::UserPoolClient',
    Properties: {
      ClientName: '${self:service}-user-pool-client-${sls:stage}',
      UserPoolId: { Ref: 'CognitoUserPool' },
      CallbackURLs: [
        '${self:custom.clientOrigins.${sls:stage}, "http://localhost:3000/callback"}',
      ],
      DefaultRedirectURI:
        '${self:custom.clientOrigins.${sls:stage}, "http://localhost:3000/callback"}',
      SupportedIdentityProviders: ['COGNITO'],
      ExplicitAuthFlows: [
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
      GenerateSecret: false,
      PreventUserExistenceErrors: 'ENABLED',
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthFlows: ['implicit'],
      AllowedOAuthScopes: ['email', 'openid'],
    },
  },
  UserPoolDomain: {
    Type: 'AWS::Cognito::UserPoolDomain',
    Properties: {
      Domain: '${self:service}-${sls:stage}',
      UserPoolId: { Ref: 'CognitoUserPool' },
    },
  },
  // CognitoIdentityPool: {
  //   Type: 'AWS::Cognito::IdentityPool',
  //   Properties: {
  //     AllowUnauthenticatedIdentities: false,
  //     CognitoIdentityProviders: [
  //       {
  //         ClientId: { Ref: 'CognitoUserPoolClient' },
  //         ProviderName: { 'Fn::GetAtt': ['CognitoUserPool', 'ProviderName'] },
  //       },
  //     ],
  //   },
  // },
  // IdentityPoolRoleAttachment: {
  //   Type: 'AWS::Cognito::IdentityPoolRoleAttachment',
  //   Properties: {
  //     IdentityPoolId: { Ref: 'CognitoIdentityPool' },
  //     Roles: {
  //       authenticated: {
  //         'Fn::GetAtt': ['CognitoAuthRole', 'Arn'],
  //       },
  //     },
  //   },
  // },
  // CognitoAuthRole: {
  //   Type: 'AWS::IAM::Role',
  //   Properties: {
  //     AssumeRolePolicyDocument: {
  //       Version: '2012-10-17',
  //       Statement: [
  //         {
  //           Effect: 'Allow',
  //           Principal: {
  //             Federated: 'cognito-identity.amazonaws.com',
  //           },
  //           Action: ['sts:AssumeRoleWithWebIdentity'],
  //         },
  //       ],
  //     },
  //     Policies: [
  //       // add whatever policies you need here
  //     ],
  //   },
  // },
};

export default CognitoResources;
