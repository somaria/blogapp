import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useParams,
} from '@remix-run/react'
import { useLoaderData } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { getUser } from '../../utils/session.server'

export const loader = async ({ request, params }) => {
  const user = await getUser(request)

  const post = await db.post.findUnique({
    where: { id: params.postId },
    include: {
      user: true,
    },
  })

  if (!post) throw new Error('Post not found')

  const data = { post, user }
  return data
}

export const action = async ({ request, params }) => {
  const form = await request.formData()
  if (form.get('_method') === 'delete') {
    const user = await getUser(request)

    const post = await db.post.findUnique({
      where: { id: params.postId },
    })

    if (!post) throw new Error('Post not found')

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.postId } })
    }

    return redirect('/posts')
  }
}

const Post = () => {
  const params = useParams()
  const { post, user } = useLoaderData()
  return (
    <div>
      <div className='page-header'>
        <h1>{post.title}</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>
      <div className='page-content'>{post.body}</div>
      <div className='page-content'>{post.user.username}</div>
      <div className='page-footer'>
        {user.id === post.userId && (
          <form method='post'>
            <input type='hidden' name='_method' value='delete' />
            <button className='btn btn-delete'>Delete</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Post
