/**
 * A payload of a JWT token. Note: this declaration lists its keys as
 * being certainly present instead of being optional. This is where this
 * interface and the JwtPayload type in jsonwebtoken differ.
 */
export interface CustomJwtPayload {
  iss: string
  sub: string
  iat: number
  exp: number
}
