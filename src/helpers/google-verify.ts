import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerify = async (idToken = '') => {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const given_name = ticket.getPayload()?.given_name;
    const family_name = ticket.getPayload()?.family_name;
    const email = ticket.getPayload()?.email;
    const sub = ticket.getPayload()?.sub;

    return { given_name, family_name, email,sub };
};
