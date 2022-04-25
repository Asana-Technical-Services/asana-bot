import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "/src/lib/config"

export default withIronSessionApiRoute(userRoute, ironOptions)

async function userRoute(req, res) {
  console.log("USER")
  console.log(req.session)
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    })
  } else {
    res.json({
      isLoggedIn: false,
      login: ""
    });
  }
}