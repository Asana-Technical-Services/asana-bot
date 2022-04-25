import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "/src/lib/config"

export default withIronSessionApiRoute(logoutRoute, ironOptions)

function logoutRoute(req, res, session) {
  console.log("LOGOUT")
  console.log(req.session)
  console.log(session)
  req.session.destroy();
  res.send({ ok: true });
}