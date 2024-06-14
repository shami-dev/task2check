import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "@radix-ui/themes/styles.css";
import { Container, Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/react";

export const config = {
  maxDuration: 30,
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme accentColor="blue" scaling="100%">
          <Container maxWidth="1024px">{children}</Container>
          <Analytics />
        </Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
