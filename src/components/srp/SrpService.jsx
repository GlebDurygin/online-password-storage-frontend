let params = require('./params');
let hash = require('./sha256');
let bigInt = require("big-integer");
let randomHex = require('crypto-random-hex')

function computeEmphaticKeyA() {
    let random = generateRandom();
    let a = bigInt(random, 16);

    return {
        emphaticKeyA: params.g.modPow(a, params.N),
        randomA: a
    };
}

function generateRandom() {
    return randomHex(32)
}

function computeMaskValue(emphaticKeyA, emphaticKeyB) {
    return hash(emphaticKeyA, emphaticKeyB);
}

function computePrivateKey(salt, username, password) {
    let usernameWithPassword = username + " : " + password;
    let usernameWithPasswordHash = hash(usernameWithPassword);
    return hash(salt, usernameWithPasswordHash);
}

function computeSessionKey(emphaticKeyB, randomA, privateKey, maskValue) {
    let B = bigInt(emphaticKeyB);
    let x = bigInt(privateKey, 16);
    let u = bigInt(maskValue, 16);

    let supportPow = u.multiply(x)
        .plus(randomA);
    let supportNumber = params.g.modPow(x, params.N)
        .multiply(params.K);
    let sessionKey = B.subtract(supportNumber)
        .modPow(supportPow, params.N);

    return hash(sessionKey.toString());
}

function computeClientCheckValue(username, salt, emphaticKeyA, emphaticKeyB, sessionKey) {
    let n = bigInt(hash(params.N.toString()), 16);
    let g = bigInt(hash(params.g.toString()), 16);
    let i = bigInt(hash(username), 16);
    let s = n.xor(g);
    return hash(s.toString(), i.toString(), salt, emphaticKeyA, emphaticKeyB, sessionKey)
}

function computeServerCheckValue(emphaticKeyA, clientCheckValue, sessionKey) {
    return hash(emphaticKeyA, clientCheckValue, sessionKey);
}

module.exports = {
    computeEmphaticKeyA: computeEmphaticKeyA,
    computeMaskValue: computeMaskValue,
    computePrivateKey: computePrivateKey,
    computeSessionKey: computeSessionKey,
    computeClientCheckValue: computeClientCheckValue,
    computeServerCheckValue: computeServerCheckValue
}