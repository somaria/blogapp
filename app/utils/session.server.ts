import bcrypt from 'bcrypt'
import { db } from '~/utils/db.server'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

export const login = async ({
  username,
  password,
}: {
  username: string
  password: string
}) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPassword) return null

  console.log('password is correct')

  return user
}

export const register = async ({
  username,
  password,
}: {
  username: string
  password: string
}) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return db.user.create({
    data: { username, passwordHash },
  })
}

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('No session secret')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'remixblog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 60,
    httpOnly: true,
  },
})

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

//Get user session

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'))
}

//Get user

export const getUser = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export const logout = async (request: Request) => {
  const session = await storage.getSession(request.headers.get('Cookie'))

  return redirect('/auth/logout', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
