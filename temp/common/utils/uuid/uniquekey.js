var uniqueKey = require('unique-key');

function _parseCharType( charType ) {
    let ret = undefined;
    if ( charType == 1 ) {
        ret = 'alpha';
    } else if( charType == 2 ) {
        ret = 'numeric';
    } else {
        ret = 'alphanum';
    }
    return ret;
}

function _parseTransform( transform ) {
    let ret = undefined;
    if ( transform == 1 ) {
        ret = 'lower';
    } else if( transform == 2 ) {
        ret = 'upper';
    } else {
        ret = '';
    }
    return ret;
}

/**
 * @method  GenerateKey
 * @param   {int}       size        size of key. Default 16.
 * @param   {string}    prefix
 * @param   {int}       charType    0: alphanum, 1: alpha, 2: numeric   / Default 0.
 * @param   {int}       transform   0: None, 1: lower, 2: upper         / Default 0.
 * @returns {string}
*/
function _generateUniqueKey( size=16, prefix='', charType=0, transform=0 ) {
    return uk = uniqueKey({
        size: size,
        prefix: prefix,
        charType: _parseCharType( charType ),
        transform: _parseTransform( transform ),
    });
}

/**
 * @method  AccessKey
 * @returns {string}    32 length Unique Key
 */
function _getAccessKey() {
    // todo : 32 -> get config
    return _generateUniqueKey(32);
}

/**
 * @method  SecretKey
 * @returns {string}    16 length Unique Key
 */
function _getSecretKey() {
    // todo : 16 -> get config
    return _generateUniqueKey(16, '', 0, 1);
}

module.exports.GenerateKey  = _generateUniqueKey;
module.exports.AccessKey    = _getAccessKey;
module.exports.SecretKey    = _getSecretKey;

