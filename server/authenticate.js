const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("YOUR_CLIENT_ID");

async function authenticate(req, res, next) {
    const token = req.cookies["session-token"];
    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "YOUR_CLIENT_ID", // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload);
    return payload;
}

module.exports = { authenticate };
