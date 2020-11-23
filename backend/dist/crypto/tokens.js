"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
exports.randomSecureToken = (size = 48) => {
    return crypto_1.default.randomBytes(size).toString('hex');
};
if (!fs_1.default.existsSync("./keys"))
    fs_1.default.mkdirSync("./keys");
if (!fs_1.default.existsSync("./keys/private.key"))
    fs_1.default.writeFileSync("./keys/private.key", exports.randomSecureToken(40));
if (!fs_1.default.existsSync("./keys/encryption.key")) {
    fs_1.default.writeFileSync("./keys/encryption.key", exports.randomSecureToken(40));
}
const signingSecret = fs_1.default.readFileSync("./keys/private.key");
const cryptoSecret = fs_1.default.readFileSync("./keys/encryption.key");
const algorithm = 'aes256';
const encodingIn = 'utf8';
const encodingOut = 'hex';
const ivLength = 16;
const key = crypto_1.default.createHash('sha256').update(cryptoSecret).digest('base64').substr(0, 32);
// Encrypt a text with auto generated secret
exports.encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(ivLength);
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    const ciphered = cipher.update(text, encodingIn, encodingOut) + cipher.final(encodingOut);
    return iv.toString(encodingOut) + ':' + ciphered;
};
// Decrypt text with auto generated secret
exports.decrypt = (ciphertext) => {
    const components = ciphertext.split(':');
    const ivFromText = Buffer.from(components.shift(), encodingOut);
    const decipher = crypto_1.default.createDecipheriv(algorithm, key, ivFromText);
    let deciphered = decipher.update(components.join(':'), encodingOut, encodingIn);
    deciphered += decipher.final(encodingIn);
    return deciphered;
};
exports.signingKey = () => {
    return signingSecret;
};
//# sourceMappingURL=tokens.js.map