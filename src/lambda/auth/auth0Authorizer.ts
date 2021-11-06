import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
// import Axios from 'axios'

import { createLogger } from '../../utils/logger'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// [TODO]: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-5lq53hqm.us.auth0.com/.well-known/jwks.json'
const signingCert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJZHfPAkmPEfAtMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi01bHE1M2hxbS51cy5hdXRoMC5jb20wHhcNMjExMTA1MDkyMzM2WhcN
MzUwNzE1MDkyMzM2WjAkMSIwIAYDVQQDExlkZXYtNWxxNTNocW0udXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArje1BsBgO6mqw/jM
cZg51hnX7Ts6pQxZNQWr2s5oT1H8mzrrEhrBitEjajmjWUKHHITyqLl3yyha7aEu
lcwOkcznOStuY7AV9C6VnTbE40PiN/K3gZLMIk/numi8K3oF+En4dxmfDVq86O4o
IrPNchgEbaVGfSsWCNNSpfQFrE4u1siBWE8ma987ZWQM57GCE+J4YGAnTPzxkb1D
yYKJCL05NxKcAKqxrsgCk848ZzV8ZmDj+7oRs1OOdgZ+WoK1Ibykzz3u9F961pnn
QUQGTdHDt1xEcyA6N5zNkY+h8Uj1wB2ijfzzJGZXmyebWboN3VzrJ0F2s2WtLIzN
OjAsAwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQt4/svQGHo
3Bnxp9tQeUmhAzhRzzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHf3rEhXlIv4A6VApIO5PXgtNN3SEcmrQjjpJJzDUiN93bYRkK77/32sIseKOvrr
99LT6rl/M0h5WO9wBDJFYJv5eJtZZaamcXeICuifU+7fEnvGhe3nQ+uvGaG+Qc5r
3H/y7F+xZmTS6kb5cYovDI6FmUMFwPby8y44hpgN9f004jlCLi+PlYRAowWNbvvH
l0QsUv183xsWv3HBs6YcnoWeHmxrPik6hDXelA6WkivV4xo5oTCNzmsPmh9ccI/N
hB3WUvEF9wNlMIcnRaQpv8zmR3qrtH0nvxC3ACK9nyp30EKul1hVotCYLMfM0Mcd
2LbRH7UWQLZDPpza0z+saBM=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    // const jwtToken = await verifyToken(event.authorizationToken)
    const jwtToken = verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

// TODO: async function verifyToken(authHeader: string): Promise<JwtPayload> {
function verifyToken(authHeader: string): JwtPayload {
  const token = getTokenFromAuthHeader(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, signingCert, { algorithms: ["RS256"] }) as JwtPayload
}

function getTokenFromAuthHeader(authHeader: string): string {
  if (!authHeader) {
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
