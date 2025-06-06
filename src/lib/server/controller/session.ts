import type { Cookies } from "@sveltejs/kit";
import type { User, Session } from "$lib/app-types";

import { env } from "$env/dynamic/private";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import { tblSessions } from "$lib/schema/schema";
import { db } from "$lib/server/database/db-client"
import { eq } from "drizzle-orm";


const MAX_SESSION = (parseInt(env.EXPIRATION_HOURS) || 10) * 60 * 60 * 1000;
const SESSION_NAME = env.SESSION_NAME || "chronoz_session";
export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

type DatabaseClientType = typeof db;

class SessionController {
  private static instance: SessionController;
  private db: DatabaseClientType;

  private constructor(db: DatabaseClientType) {
    this.db = db;
  }

  public static getInstance(db: DatabaseClientType): SessionController {
    if (!SessionController.instance) {
      SessionController.instance = new SessionController(db);
    }

    return SessionController.instance;
  }

  public async createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + MAX_SESSION)
    }

    //Delete any duplicate session
    await this.invalidateAllSessions(userId);

    //Create the session
    await db.insert(tblSessions).values({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt
    });

    return session
  }

  public async validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const userSession = await this.db.query.tblSessions.findFirst({
      where: (session, { eq }) => eq(session.id, sessionId),
      with: {
        user: {
          columns: {
            id: true,
            active: true,
            name: true,
            preferences: true,
          },
          with: {
            role: { columns: { code: true } },
            permissions: {
              columns: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
              with: {
                resource: {
                  columns: { code: true }
                }
              }
            }
          }
        }
      }
    })

    if (!userSession || !userSession.userId || !userSession.user) {
      return { session: null, user: null }
    }

    const session: Session = {
      id: userSession.id,
      userId: userSession.userId,
      expiresAt: userSession.expiresAt
    }

    const user: User = _toUser(userSession.user)

    if (Date.now() >= session.expiresAt.getTime()) {
      this.invalidateSession(session.id)
      return { session: null, user: null };
    }

    if (Date.now() >= session.expiresAt.getTime() - MAX_SESSION / 2) {
      session.expiresAt = new Date(Date.now() + MAX_SESSION);
      await this.db.update(tblSessions).set({ expiresAt: session.expiresAt }).where(eq(tblSessions.id, session.id));
    }

    return { session, user }
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    await this.db.delete(tblSessions).where(eq(tblSessions.id, sessionId))
  }

  public async invalidateAllSessions(userId: number): Promise<void> {
    await this.db.delete(tblSessions).where(eq(tblSessions.userId, userId))
  }

  public setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
    cookies.set(SESSION_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/"
    });
  }

  public deleteSessionTokenCookie(cookies: Cookies): void {
    cookies.set(SESSION_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    })
  }

  public getSessionToken(cookies: Cookies): string | null {
    return cookies.get(SESSION_NAME) ?? null;
  }
}

function _toUser(data: Record<string, any>): User {

  const permissions = data.permissions.reduce((obj: { [x: string]: any; }, perm: { [x: string]: any; resource: any; }) => {
    const { resource, ...actions } = perm;
    obj[resource.code] = actions;
    return obj
  }, {})

  return {
    id: data.id,
    active: data.active,
    name: data.name,
    preferences: data.preferences,
    role: data.role.code,
    permissions
  }
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export const sessionClient = SessionController.getInstance(db);