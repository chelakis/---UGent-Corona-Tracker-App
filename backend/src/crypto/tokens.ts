import crypto from "crypto";
import fs from "fs";

export const randomSecureToken = (size = 48) => {
    return crypto.randomBytes(size).toString('hex')
};

if (!fs.existsSync("./keys"))
    fs.mkdirSync("./keys");

if (!fs.existsSync("./keys/private.key"))
    fs.writeFileSync("./keys/private.key", randomSecureToken(40));

if (!fs.existsSync("./keys/encryption.key")) {
    fs.writeFileSync("./keys/encryption.key", randomSecureToken(40));
}

const signingSecret = fs.readFileSync("./keys/private.key");
const cryptoSecret = fs.readFileSync("./keys/encryption.key");

const algorithm = 'aes256';
const encodingIn = 'utf8';
const encodingOut = 'hex';
const ivLength = 16;
const key = crypto.createHash('sha256').update(cryptoSecret).digest('base64').substr(0, 32);

// Encrypt a text with auto generated secret
export const encrypt = (text: string) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const ciphered = cipher.update(text, encodingIn, encodingOut) + cipher.final(encodingOut);
    return iv.toString(encodingOut) + ':' + ciphered
}

// Decrypt text with auto generated secret
export const decrypt = (ciphertext: string) => {
    const components = ciphertext.split(':');
    const ivFromText = Buffer.from(components.shift(), encodingOut);
    const decipher = crypto.createDecipheriv(algorithm, key, ivFromText);
    let deciphered = decipher.update(components.join(':'), encodingOut, encodingIn);
    deciphered += decipher.final(encodingIn);
    return deciphered;
}

export const signingKey = () => {
    return signingSecret;
};