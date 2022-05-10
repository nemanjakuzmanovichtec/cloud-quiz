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
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
      },
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
      ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
      GenerateSecret: false,
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
