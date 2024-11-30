import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { UserInSession } from "../../user"

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: UserInSession, done: (err: Error | null, user: UserInSession) => void): any {
    done(null, user)
  }
  deserializeUser(
    payload: any,
    done: (err: Error | null, payload: string) => void
  ): any {
    done(null, payload)
  }
}