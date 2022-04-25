export const ironOptions = {
    cookieName: process.env.AUTH_COOKIE,
    password: process.env.AUTH_SECRET,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production"
    }
  };