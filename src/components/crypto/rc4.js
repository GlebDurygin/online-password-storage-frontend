module.exports = function rc4(key, str) {
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
    return res;
}

function uintArrayToString(byteArray) {
    let str = "";
/*    let signum = 1;
    if (byteArray[0] > 127) {
        signum = -1;
    }

    for (let i = 0; i < byteArray.length; i++) {
        if (signum === -1) {
            if (i === 0) {
                str += String.fromCharCode(Number.parseInt(255 - byteArray[i]));
            } else if (i === byteArray.length - 1) {
                str += String.fromCharCode(Number.parseInt(256 - byteArray[i]));
            } else {
                str += String.fromCharCode(Number.parseInt(255 - byteArray[i]).toString(16).padStart(2, '0'));
            }
        } else {
            if (i === 0) {
                str += String.fromCharCode(byteArray[i].toString(16));
            } else {
                str += String.fromCharCode(byteArray[i].toString(16).padStart(2, '0'));
            }
        }
    }*/
    let d = 'mTїт';
    let d1 = d.charCodeAt(2);
    let d2 = d.charCodeAt(3);
    let d3 = d.charCodeAt(4);


    for (let i = 0; i < byteArray.length; i++) {
        let x;
        if (byteArray[i] > 127) {
            x = -(256 - byteArray[i]);
        } else {
            x = byteArray[i];
        }
        str += String.fromCharCode(x);
    }

    return str;
}