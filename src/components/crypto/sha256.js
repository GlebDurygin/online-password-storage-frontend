const crypto = require('crypto')

module.exports = function sha256(...args) {
    const h = crypto.createHash('sha256')

    for (const arg of args) {
        if (typeof arg === 'string') {
            h.update(arg)
        } else {
            throw new TypeError('Expected string')
        }
    }
    return byteArrayToHex(h.digest());
}

function byteArrayToHex(byteArray) {
    let hex = "";
    let signum = 1;
    if (byteArray[0] > 127) {
        signum = -1;
        hex += "-";
    }

    for (let i = 0; i < byteArray.length; i++) {
        if (signum === -1) {
            if (i === 0) {
                hex += Number.parseInt(255 - byteArray[i]).toString(16);
            } else if (i === byteArray.length - 1) {
                hex += Number.parseInt(256 - byteArray[i]).toString(16).padStart(2, '0');
            } else {
                hex += Number.parseInt(255 - byteArray[i]).toString(16).padStart(2, '0');
            }
        } else {
            if (i === 0) {
                hex += byteArray[i].toString(16);
            } else {
                hex += byteArray[i].toString(16).padStart(2, '0');
            }
        }
    }

    return hex;
}
