import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { styled } from '@linaria/react';
import './globals.css';
import { Toaster } from "@/components/ui/sonner"

const StyledLayout = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding:0 1rem;
`

export function Layout({ children }: {children: JSX.Element}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <StyledLayout>
          {children}
        </StyledLayout>
        <Scripts />
        <ScrollRestoration />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      {/* @ts-expect-error */}
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}