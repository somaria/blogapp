import { LoaderFunction } from '@remix-run/node' // or "@remix-run/cloudflare"
import { json } from '@remix-run/node' // or "@remix-run/cloudflare"
import { useLoaderData, Links, Link } from '@remix-run/react'
import { db } from '~/utils/db.server'

export const loader = async () => {
  console.log(1234)
  const data = {
    posts: await db.post.findMany({
      take: 20,
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
      },
    }),
  }
  console.log(data)
  return data
}

const PostItems = () => {
  const { posts } = useLoaderData()

  return (
    <div>
      <div className='page-header'>
        <h1>Posts</h1>
        <Link to='/posts/new' className='btn'>
          New Post
        </Link>
      </div>

      <ul className='posts-list'>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.id}>
              <h3>{post.title}</h3>
              <h3>{post.body}</h3>
              <h3>{post.user.username}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostItems
