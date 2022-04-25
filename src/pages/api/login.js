import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "/src/lib/config"

export default withIronSessionApiRoute(loginRoute, ironOptions)

async function loginRoute(req, res) {
  const { username, password} = await req.body
  // TODO: This authentication simply validates a pre-defined user/password
  if (username === process.env.AUTH_USER && password === process.env.AUTH_PASSWD) {
    req.session.user = {
      isLoggedIn: true,
      admin: true,
      user: username
    };
    await req.session.save()
    res.json(req.session.user)
  } else {
    req.session.user = {
      isLoggedIn: false,
      admin: false
    }
    res.json(req.session.user)
  }
}