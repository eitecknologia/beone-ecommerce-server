/* Enviroment variables default */

/* PORT */
process.env.PORT = process.env.PORT || "8002" as string

/* DATABASE URL CONNECTION */
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://beone:rBzS5SIMjgi1wr5zejXMv3NZx9yBVKNt@dpg-cf9tljcgqg47p3oogp0g-a.oregon-postgres.render.com/beonedb" as string

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
process.env.URL_RECOVER_PASSWORD_USER = process.env.URL_RECOVER_PASSWORD_USER || "http://localhost/";
process.env.URL_RECOVER_PASSWORD_ADMIN = process.env.URL_RECOVER_PASSWORD_ADMIN || "http://localhost/";

