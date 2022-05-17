import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from '@remix-run/react'
import globalStylesUrl from '../app/styles/global.css'

export const meta = () => ({
  description: 'A cool blog built with Remix',
  keywords: 'remix, blog',
  charset: 'utf-8',
  title: 'The New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl }]

const App = () => {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

const Document = ({ children, title }) => {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
        <title>{title ? title : 'My Remix Blog'}</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV !== 'production' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

const Layout = ({ children }) => {
  return (
    <div>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Remix
        </Link>
        <ul className='nav'>
          <li>
            <Link to='/posts' className=''>
              Posts
            </Link>
          </li>
          <li>
            <Link to='/auth/login' className=''>
              Login
            </Link>
          </li>
        </ul>
      </nav>

      <div className='container'>{children}</div>
    </div>
  )
}

export const ErrorBoundary = ({ error }) => {
  console.log(error)
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  )
}

export default App
