import { JwtHeader } from 'jsonwebtoken'

import { CustomJwtPayload } from './CustomJwtPayload'

/**
 * Interface representing a JWT token
 */
export interface Jwt {
  header: JwtHeader
  payload: CustomJwtPayload
}
