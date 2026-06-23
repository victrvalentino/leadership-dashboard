import { cookies } from 'next/headers'

export type AuthUser = {
  name: string
  role: string
  is_active: boolean
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()

  console.log(
    'ALL COOKIES:',
    cookieStore.getAll()
  )

  const roleCookie = cookieStore.get('user-role')
  const nameCookie = cookieStore.get('user-name')

  console.log('ROLE COOKIE:', roleCookie)
  console.log('NAME COOKIE:', nameCookie)

  const role = roleCookie?.value
  const name = nameCookie?.value

  if (!role) {
    console.log('NO ROLE COOKIE FOUND')
    return null
  }

  return {
    name: name || 'Unknown User',
    role,
    is_active: true,
  }
}

export async function requireRole(
  allowedRoles: string[]
) {
  const user = await getCurrentUser()

  console.log('CURRENT USER:', user)
  console.log('ALLOWED ROLES:', allowedRoles)

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `Forbidden: role=${user.role}`
    )
  }

  return user
}