/* Enviroment variables default */

/* PORT */
process.env.PORT = process.env.PORT || "8003" as string

/* DATABASE URL CONNECTION */
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:Zq3zRNud8VTz0Mwo6Li7@containers-us-west-37.railway.app:7075/railway" as string

/* ROLES ID */
process.env.ADMIN_ID = process.env.ADMIN_ID || "1";
process.env.USER_ID = process.env.USER_ID || "2";

/* TOKEN SEED */
process.env.TOKEN_SEED = process.env.TOKEN_SEED || "T0k3nSe3dB30n3_@";

/* EMAIL CREDENTIALS */
process.env.MAIL_USER = process.env.MAIL_USER || "cristhianalejandroguadalupe@gmail.com";
process.env.MAIL_PSWD = process.env.MAIL_PSWD || "qravllwtyhecyewi";

/* CLOUDINARY */
process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL || "cloudinary://129278158545247:J02i5Q-zlOqUyu7__UK4wIqMGvk@db6g5aoec";

/* GOOGLE CLIENT ID */
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "973875313510-l7mikitkuip1g8ebettjl22k5fg9pj1o.apps.googleusercontent.com";

/* FACEBOOK CLIENT ID */
process.env.FACEBOOK_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "509866598005800";

/* RECOVER PASSWORD URL */
process.env.URL_RECOVER_PASSWORD_USER = process.env.URL_RECOVER_PASSWORD_USER || "http://localhost:5173/Recover";
process.env.URL_RECOVER_PASSWORD_ADMIN = process.env.URL_RECOVER_PASSWORD_ADMIN || "http://127.0.0.1:3001/passwordreset";

