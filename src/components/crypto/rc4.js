module.exports = function rc4(forEncryption, key, str) {
    let bytes;
    if (!forEncryption) {
        bytes = hexToBytes(str);
        str = bin2String(bytes);
    }
    if (key.length > 64) {
        key = key.substr(1, key.length - 1);
    }
    let s = [], t = [], j = 0, res = [];
    for (let i = 0; i < 256; i++) {
        s[i] = i;
        t[i] = key.charCodeAt(i % key.length);
    }

    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + t[i]) % 256;
        s[i] ^= s[j];
        s[j] ^= s[i];
        s[i] ^= s[j];
    }

    let i = 0;
    j = 0;
    let k, q;
    for (let y = 0; y < str.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        s[i] ^= s[j];
        s[j] ^= s[i];
        s[i] ^= s[j];
        q = (s[i] + s[j]) % 256;
        k = s[q];
        res[y] = str.charCodeAt(y) ^ k;
    }

    return forEncryption
        ? res
        : bin2String(res);
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
        c += 2;

        bytes.push(number);
    }
    return bytes;
}