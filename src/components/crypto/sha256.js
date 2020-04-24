let crypto = require('crypto');
let utils = require('./utils');

module.exports = function sha256(...args) {
    const h = crypto.createHash('sha256')

    for (const arg of args) {
        if (typeof arg === 'string') {
            h.update(arg)
        } else {
            throw new TypeError('Expected string')
        }
    }
    return utils.byteArrayToHex(h.digest());
}
