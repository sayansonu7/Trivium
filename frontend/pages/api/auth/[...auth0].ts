import {
  handleAuth,
  handleLogin,
  handleLogout,
  handleCallback,
} from "@auth0/nextjs-auth0";

export default handleAuth({
  login: handleLogin({
    returnTo: "/",
  }),
  logout: handleLogout({
    returnTo: "/",
  }),
  callback: handleCallback({
    afterCallback: (req, res, session, state) => {
      return session;
    },
  }),
  onError(req, res, error) {
    console.error("Auth0 Error:", error);
    // Redirect to homepage on any Auth0 error
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
  },
});
