import jwt from 'jsonwebtoken';

export const generateJwt = (id: number) => {
    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(payload, `${process.env.TOKEN_SEED}`, {
            expiresIn: '24h'
        }, (err, token) => {
            (err) ? reject('No se pudo generar el token') : resolve(token);
        });
    });
}
