import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const { data: user, mutate: mutateUser } = useSWR("/api/user");

  console.log("USEUSER!")
  console.log(user)


  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) {
      return;
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }

    // if (redirectTo) {
    //   Router.push(redirectTo);
    // }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}

// import { withIronSessionApiRoute } from "iron-session/next"
// import { ironOptions } from "/src/lib/config"

// export default withIronSessionApiRoute(userRoute, ironOptions)

// async function userRoute(req, res) {
//   console.log("USER")
//   console.log(req.session)
//   if (req.session.user) {
//     // in a real world application you might read the user id from the session and then do a database request
//     // to get more information on the user if needed
//     res.json({
//       ...req.session.user,
//       isLoggedIn: true,
//     })
//   } else {
//     res.json({
//       isLoggedIn: false,
//       login: ""
//     });
//   }
// }