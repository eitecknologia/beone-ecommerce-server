import fileUpload from "express-fileupload";
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const imagesPath = 'eiteck/beone/images';

/* Upload a file in cloudinary Function */
export const uploadFiles = (file: fileUpload.UploadedFile | fileUpload.UploadedFile[] | undefined,
    validatedExt = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'webp', 'psd', 'bmp']
): Promise<string> => {

    return new Promise(async (resolve, reject) => {
        try {
            /* Get the extension */
            const { name, tempFilePath }: any = file;
            const cutName: string[] = name.split('.');
            const extension = cutName[cutName.length - 1];

            /* Validate if the extension is valid */
            if (!validatedExt.includes(extension)) {
                return reject(`La extensión ${extension} no es permitida, Extensiones Validas: ${validatedExt}`);
            }

            /* Upload the image in cloudinary */
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { upload_preset: "beone" });

            resolve(secure_url)
        } catch (error) {
            reject(error)
        }
    })

}

/* Delete an Image in cloudinary Function */
export const deleteFiles = (url: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            /* Get the name of file */
            const cutName: string[] = url.split('/');
            const nameFile: string = cutName[cutName.length - 1];
            const [public_id] = nameFile.split('.');

            /* Delete the image of clouginary */
            await cloudinary.uploader.destroy(`${imagesPath}/${public_id}`);
            resolve('Archivo Eliminado');
        } catch (error) {
            reject(error);
        }
    })
}
