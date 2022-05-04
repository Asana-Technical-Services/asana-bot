import { SessionProvider, useSession, signIn } from "next-auth/react";
import React from "react";
import "/src/styles/index.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true });
  console.log("auth:");

  console.log(session);
  console.log(status);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
