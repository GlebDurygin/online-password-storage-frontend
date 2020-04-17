let bigInt = require("big-integer");
let hash = require('./sha256');

const input = {
    largeSafePrime: `
    AC6BDB41 324A9A9B F166DE5E 1389582F AF72B665 1987EE07 FC319294
    3DB56050 A37329CB B4A099ED 8193E075 7767A13D D52312AB 4B03310D
    CD7F48A9 DA04FD50 E8083969 EDB767B0 CF609517 9A163AB3 661A05FB
    D5FAAAE8 2918A996 2F0B93B8 55F97993 EC975EEA A80D740A DBF4FF74
    7359D041 D5C33EA7 1D281E44 6B14773B CA97B43A 23FB8016 76BD207A
    436C6481 F1D2B907 8717461A 5B9D32E6 88F87748 544523B5 24B0D57D
    5EA77A27 75D2ECFA 032CFBDB F52FB378 61602790 04E57AE6 AF874E73
    03CE5329 9CCC041C 7BC308D8 2A5698F3 A8D0C382 71AE35F8 E9DBFBB6
    94B5C803 D89F7AE4 35DE236D 525F5475 9B65E372 FCD68EF2 0FA7111F
    9E4AFF73
  `,
    generatorModulo: '02',
    authorizationKeyHeader: 'Authorization-Key',
    sessionIdHeader: 'Session-Id',
    anonymousSessionKey: '3026f7bbfa68b1ac22be3d719827a5aa2e5e5c599852fd2b9a1123ecfa29b275',
    anonymousSessionId: '473dc69678d1c1db737484948eff81a75882fcdfe16ecae83e3fc2e88d6f7034'
}
let sessionKey = '';
let sessionId = '';

function setSessionKey(key) {
  sessionKey = key;
}

function getSessionKey() {
  return sessionKey;
}

function setSessionId(id) {
  sessionId = id;
}

function getSessionId() {
  return sessionId;
}

// N    A large safe prime (N = 2q+1, where q is prime)
// g    A generator modulo N
// k    Multiplier parameter
exports.N = bigInt(input.largeSafePrime.replace(/\s+/g, ''), 16)
exports.g = bigInt(input.generatorModulo.replace(/\s+/g, ''), 16)
exports.K = bigInt(hash(exports.N.toString(), exports.g.toString()), 16)
exports.authorizationKeyHeader = input.authorizationKeyHeader
exports.sessionIdHeader = input.sessionIdHeader
exports.anonymousKey = input.anonymousSessionKey
exports.anonymousSessionId = input.anonymousSessionId
exports.setSessionKey = setSessionKey
exports.getSessionKey = getSessionKey
exports.setSessionId = setSessionId
exports.getSessionId = getSessionId