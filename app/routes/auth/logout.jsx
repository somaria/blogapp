import { useLoaderData, Links, Link, useActionData } from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { logout } from '~/utils/session.server'

export const action = async ({ request }) => {
  return logout(request)
}

export const loader = async () => {
  return redirect('/')
}
