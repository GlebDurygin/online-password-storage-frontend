let crypto = require('crypto');
module.exports = function aes256(forEncryption, key, text) {
    let keyBytes = hexToBytes(key);

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

        text = hexToBytes(text);
        let buffer = Buffer.from(text);
        let decrypted = decipher.update(buffer);
        return bin2String(removePadding(decrypted));
    }
}

function bin2String(array) {
    let result = "";
    for (let i = 0; i < array.length; i++) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}

function hexToBytes(hex) {
    let bytes = [];
    let c = 0;
    let signum = 1;
    if (hex.charAt(c) === '-') {
        c += 1;
        signum = -1;
    }

    while (c < hex.length) {
        let number;
        if (signum === -1) {
            if (c !== (hex.length - 2)) {
                number = 255 - parseInt(hex.substr(c, 2), 16);
            } else {
                number = 256 - parseInt(hex.substr(c, 2), 16);
            }
        } else {
            number = parseInt(hex.substr(c, 2), 16);
        }
        if (number > 127) {
            number -= 256;
        }

        c += 2;

        bytes.push(number);
    }
    return bytes;
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