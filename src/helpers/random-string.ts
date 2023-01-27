/* Generate a random string for the password */
export const generateRandomString = (num = 7) => {
    let stringGenerated = Math.random().toString(36).substring(0, num);

    return stringGenerated;
}