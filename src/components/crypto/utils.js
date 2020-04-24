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

module.exports = {
    bin2String: bin2String,
    hexToBytes: hexToBytes,
    byteArrayToHex: byteArrayToHex
}