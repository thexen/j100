
const crypto = require('crypto');
const ecies = require("standard-ecies");

const _curveName    = 'secp256k1';
const _hashLength   = 32
const _ivLength     = _hashLength / 2

function _iv() {
    return crypto.randomBytes( _ivLength );
}

function _options( _iv=null ) {
    return {
        hashName: 'sha256',
        hashLength: _hashLength,
        macName: 'sha256',
        macLength: _hashLength,
        curveName: _curveName,
        symmetricCypherName: 'aes-128-cbc',
        iv: _iv,
        keyFormat: 'uncompressed',
        s1: null,
        s2: null
    };
}

/**
 * @method  GeneratePairKey     - ECIES
 * @returns {string, string}    publicKey, privateKey - encoded base64
 */
var _getPairKey = function() {
    let ecdh = crypto.createECDH( _curveName );
    ecdh.generateKeys();

    try {
        return [ ecdh.getPublicKey( 'base64' ), ecdh.getPrivateKey( 'base64' ) ];
    } catch ( e ) {
    } finally {
        ecdh = undefined;
    }
}

/**
 * @method  GeneratePairKeyObj  - ECIES
 * @returns {Object}            Object.public, Object.private - encoded base64
 */
var _getPairKeyObject = function() {
    let ecdh = crypto.createECDH( _curveName );
    ecdh.generateKeys();

    let keys = {
        public: ecdh.getPublicKey( 'base64' ),
        private: ecdh.getPrivateKey( 'base64' )
    }

    try {
        return keys
    } catch ( e ) {
    } finally {
        ecdh = undefined;
        keys = undefined;
    }
}

/**
 * @method  Encrypt     - ECIES
 * @param   {string}    plainText
 * @param   {string}    publicKey       encoded base64
 * @returns {string}    encoded base64
 */
var _eciesEncrypt = function( plainText, publicKey ) {
    let opts            = _options();
    let decodedPubKey   = Buffer.from( publicKey , 'base64' );
    let encryptedText   = ecies.encrypt( decodedPubKey, plainText, _opts );

    try {
        return encryptedText.toString( 'base64' );
    } catch ( e ) {
    } finally {
        opts            = undefined;
        decodedPubKey   = undefined;
        encryptedText   = undefined;
    }
}

/**
 * @method  Encryptiv   - ECIES
 * @param   {string}    plainText
 * @param   {string}    publicKey       encoded base64
 * @returns {string}    [iv + encrypt]  encoded base64 
 */
var _eciesEncryptIv = function( plainText, publicKey ) {
    let iv              = _iv();
    let opts            = _options( iv );
    let decodedPubKey   = Buffer.from( publicKey , 'base64' );
    let encryptedText   = ecies.encrypt( decodedPubKey, plainText, opts );

    try {
        return Buffer.concat([ iv, encryptedText ]).toString( 'base64' );
    } catch ( e ) {
    } finally {
        iv              = undefined;
        opts            = undefined;
        decodedPubKey   = undefined;
        encryptedText   = undefined;
    }
}

/**
 * @method  Decrypt     - ECIES
 * @param   {string}    encryptedText
 * @param   {string}    privateKey      Encoded Key
 * @returns {string}    decrypted string - utf8
 */
var _eciesDecrypt = function( encryptedText, privateKey ) {
    let ecdh            = crypto.createECDH( _curveName );
    ecdh.setPrivateKey( privateKey, 'base64' );
    
    let message         = Buffer.from( encryptedText , 'base64' );
    let opts            = _options();
    let decryptedText   = ecies.decrypt( ecdh, message, opts );

    try {
        return decryptedText.toString( 'utf8' );
    } catch ( e ) {
    } finally {
        ecdh            = undefined;
        message         = undefined;
        opts            = undefined;
        decryptedText   = undefined;
    }
}

/**
 * @method  Decryptiv   - ECIES
 * @param   {string}    encryptedText   encoded base64
 * @param   {string}    privateKey      encoded base64
 * @returns {string}    decrypted string - utf8
 */
var _eciesDecryptIv = function( encryptedText, privateKey ) {
    let ecdh            = crypto.createECDH( _curveName );
    ecdh.setPrivateKey( privateKey, 'base64' );

    let decodedText     = Buffer.from( encryptedText , 'base64' );
    let iv              = decodedText.slice( 0, _ivLength );
    let message         = decodedText.slice( _ivLength );
    let opts            = _options( iv );

    let decryptedText   = ecies.decrypt( ecdh, message, opts );

    try {
        return decryptedText.toString( 'utf8' );
    } catch ( e ) {
    } finally {
        ecdh            = undefined;
        decodedText     = undefined;
        opts            = undefined;
        decryptedText   = undefined;
    }
}

module.exports.GeneratePairKey      = _getPairKey;
module.exports.GeneratePairKeyObj   = _getPairKeyObject;

module.exports.Encrypt              = _eciesEncrypt;
module.exports.Encryptiv            = _eciesEncryptIv;

module.exports.Decrypt              = _eciesDecrypt;
module.exports.Decryptiv            = _eciesDecryptIv;

