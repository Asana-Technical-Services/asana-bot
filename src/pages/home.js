import React, { useEffect, useState } from "react";
import useUser from "/src/lib/useUser";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import Menu from '../components/Menu'
import WebhooksPage from "./scenes/webhooks";
import useBreakpoint from "/src/hooks/useBreakpoint";

const HomeScene = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const user = useState();

  return user ? (
    // <Menu isStatic={isStatic} isClosed={isClosed} setClosed={setClosed}>
    <WebhooksPage />
  ) : (
    // </Menu>
    <div />
  );
};

HomeScene.auth = true;

export default HomeScene;
