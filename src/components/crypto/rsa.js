let crypto = require('crypto');
let utils = require('./utils');
const params = {
    serverPrivateKey: '-----BEGIN RSA PRIVATE KEY-----' +
        'MIICXQIBAAKBgQDehpUl0m636SM6soC1P6x56pePSdBnhVs2dnxbtJR9kl0kwOFF' +
        '5yx+DazptAYKPXe4VWCTkzGPkhC9/MyJiWhW6mTyc57gyJAmJ9yM2k6YYF9tJDPe' +
        'egFcxh6wDYiytGckrh4mfrQ4zhZ+xx9amt0dBTDHaOgW9VoFsogy1j6yJQIDAQAB' +
        'AoGBAJNjcMZsawlFUiA+uyFR21ulFl3B9lea7J9WO2hCY1gI6ci+OHekdsPHKxBg' +
        'PN/rdrCRXDZi+CCwDobIOnGeoYwz5Mv/l6rGHrB4079fqpnqp0SkS2rkTtITZC7I' +
        '510oN6S1cHIHJKULWHTs4Jiphi2tCoEkeipuP9Keyw5v7bTBAkEA8HWhz0Rn72X0' +
        'BBN7hgdLNPNYihgBI7IjvO30TZ5S7nilnig5Z2vxDzNFXxjJz48gl6VS9wjNRpY9' +
        'dQSoiLFhpwJBAOzoPRVgKrsaNcaISbyVF6LgJeVofXfwWlUE7/K9VBMvPuoXeXRg' +
        'dYKzSZrad3IkDCrInHWsn2gfZq4BVs/Kz1MCQCI7fOe3A1zvlMenxmQUUb6eDjLK' +
        'rA7a43+YGLmcGo5cmqdjbpiso0rYr72UF9b2t1sfbCpDFIZCCUnJefzL0+0CQEBT' +
        'kvpx4Uhqhn2A1hy5kvBr0n5nD+J4Rd7d91U+6UxIQNoJQ7ZA1seFbQ/6EALTHOal' +
        'EC63j5UTKatHu82yMPcCQQCQPNJGHZf4HgRGTadkrcQZ93EvzELd6ojEDxJexPle' +
        'wN2h5qo/XYrAbN3P3OH9cCLuteoT3buxo7X37STlQ0XL' +
        '-----END RSA PRIVATE KEY-----'
    ,
    clientPublicKey: '-----BEGIN PUBLIC KEY-----' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCO6eZnkYITYiLJq4YyMHWEoOQ9' +
        'dqzKp+ZUpimB5llEXj8Pl43ZB5vzVR0XnPgitCImw7nIy+ke4/tYpotBp14SoEue' +
        'kM0Iq2d+6NhEEFNELkWpWexfVrPulVSudN5ATy2vef91mfcQaEsCycDmtJOOuSk7' +
        'CTVQDu2oAyprL/eZhwIDAQAB' +
        '-----END PUBLIC KEY-----'
}
module.exports = function aes256(forEncryption, text) {

    let result = [];
    if (forEncryption) {
        let buffer = Buffer.from(text);
        let arrays = sliceArray(buffer, 127);
        for (let i = 0; i < arrays.length; i++) {
            let cipherText = crypto.publicEncrypt({
                    key: params.clientPublicKey,
                    padding: crypto.constants.RSA_NO_PADDING
                },
                arrays[i]);

            result = Array.prototype.concat(result, Array.from(cipherText));
        }

        return result;
    } else {
        let buffer = Buffer.from(utils.hexToBytes(text));
        let arrays = sliceArray(buffer, 128);
        for (let i = 0; i < arrays.length; i++) {
            let cipherText = crypto.privateDecrypt({
                    key: params.serverPrivateKey,
                    padding: crypto.constants.RSA_NO_PADDING
                },
                arrays[i]);

            cipherText = removeEmptyBytes(cipherText);
            result = Array.prototype.concat(result, Array.from(cipherText));
        }
        return utils.bin2String(result);
    }
}

function sliceArray(array, blockLength) {
    let count = Math.floor(array.length / blockLength);
    if (array.length % blockLength !== 0) {
        count++;
    }
    let arrays = new Array(count);
    for (let i = 0; i < count; i++) {
        let arrayLength = blockLength;
        if (i === arrays.length - 1 && array.length % blockLength !== 0) {
            arrayLength = array.length % blockLength;
        }
        arrays[i] = array.subarray(i * blockLength, i * blockLength + arrayLength);
    }
    return arrays;
}

function removeEmptyBytes(array) {
    let index = 0;

    while (array[index] === 0) {
        index++;
    }

    return array.slice(index, array.length);
}