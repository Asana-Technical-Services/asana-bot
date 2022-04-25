import React, { useEffect } from "react"
import useUser from "/src/lib/useUser";

// import Menu from '../components/Menu'
import WebhooksPage from "./scenes/webhooks"
import useBreakpoint from '/src/hooks/useBreakpoint'

const HomeScene = () => {
  const { user } = useUser({
    redirectTo: "/",
  });
  return user ? (
  // <Menu isStatic={isStatic} isClosed={isClosed} setClosed={setClosed}>
      <WebhooksPage />
    // </Menu>
  ) : <div />
}

export default HomeScene