const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
    "1053905395251-u1bk8clkn58ehucvjritv6imo9fgpcs1.apps.googleusercontent.com"
);

async function authenticate(req, res, next) {
    const token = req.cookies["session-token"];
    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience:
            "1053905395251-u1bk8clkn58ehucvjritv6imo9fgpcs1.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload);
    next();
}

module.exports = { authenticate };
