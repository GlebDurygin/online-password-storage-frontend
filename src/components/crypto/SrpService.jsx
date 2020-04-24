let params = require('./params');
let hash = require('./sha256');
let bigInt = require("big-integer");
let randomHex = require('crypto-random-hex')

function computeEmphaticKeyA() {
    let random = generateRandom(32);
    let a = bigInt(random, 16);

    return {
        emphaticKeyA: params.g.modPow(a, params.N).toString(16),
        randomA: a
    };
}

function generateRandom(bytes) {
    return randomHex(bytes)
}

function computeMaskValue(emphaticKeyA, emphaticKeyB) {
    let A = bigInt(emphaticKeyA, 16);
    let B = bigInt(emphaticKeyB, 16);
    return hash(A.toString(), B.toString());
}

function computeDataKey(username, password) {
    let usernameWithPassword = username + " : " + password;
    return hash(usernameWithPassword);
}

function computePrivateKey(salt, username, password) {
    let usernameWithPasswordHash = computeDataKey(username, password);
    return hash(salt, usernameWithPasswordHash);
}

function computeSessionKey(emphaticKeyB, randomA, privateKey, maskValue) {
    let B = bigInt(emphaticKeyB, 16);
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
    let A = bigInt(emphaticKeyA, 16);
    let B = bigInt(emphaticKeyB, 16);
    return hash(s.toString(), i.toString(), salt, A.toString(), B.toString(), sessionKey)
}

function computeServerCheckValue(emphaticKeyA, clientCheckValue, sessionKey) {
    let A = bigInt(emphaticKeyA, 16);
    return hash(A.toString(), clientCheckValue, sessionKey);
}

function computeSalt() {
    return generateRandom(16);
}

function computeVerifier(salt, username, password) {
    let privateKey = computePrivateKey(salt, username, password);
    let x = bigInt(privateKey, 16);
    return params.g.modPow(x, params.N).toString(16);
}

function computeSessionId(clientCheckValue, serverCheckValue, sessionKey) {
    return hash(clientCheckValue, serverCheckValue, sessionKey);
}

module.exports = {
    computeEmphaticKeyA: computeEmphaticKeyA,
    computeMaskValue: computeMaskValue,
    computePrivateKey: computePrivateKey,
    computeSessionKey: computeSessionKey,
    computeClientCheckValue: computeClientCheckValue,
    computeServerCheckValue: computeServerCheckValue,
    computeSalt: computeSalt,
    computeVerifier: computeVerifier,
    computeSessionId: computeSessionId,
    computeDataKey: computeDataKey
}