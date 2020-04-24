let crypto = require('crypto');
let utils = require('./utils');
module.exports = function aes256(forEncryption, key, text) {
    let keyBytes = utils.hexToBytes(key);

    if (forEncryption) {
        let cipher = crypto.createCipheriv('aes-256-ecb', keyBytes, '');

        let textBytes = new TextEncoder().encode(text);
        if (textBytes.length % 16 !== 0) {
            textBytes = addPadding(textBytes);
        }

        let cipherText = cipher.update(Buffer.from(textBytes));
        return Array.from(cipherText);
    } else {
        let decipher = crypto.createDecipheriv('aes-256-ecb', keyBytes, '');
        decipher.setAutoPadding(false);

        text = utils.hexToBytes(text);
        let buffer = Buffer.from(text);
        let decrypted = decipher.update(buffer);
        return utils.bin2String(removePadding(decrypted));
    }
}

function addPadding(text) {
    let length = text.length;

    let padding = 16 - (length % 16);
    let paddingArray = new Uint8Array(padding);
    paddingArray[0] = 80;
    if (padding > 1) {
        paddingArray.fill(0, 1, padding - 1);
    }

    return Array.prototype.concat(Array.from(text), Array.from(paddingArray));
}

function removePadding(text) {
    let padding = 0;
    let index = text.length - 1;

    while (text[index] === 0) {
        padding++;
        index--;
    }

    if (text[index] === 80) {
        padding++;
    } else {
        padding = 0;
    }

    return text.subarray(0, text.length - padding);
}