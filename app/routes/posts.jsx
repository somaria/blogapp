import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from '@remix-run/react';

const Posts = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Posts;
