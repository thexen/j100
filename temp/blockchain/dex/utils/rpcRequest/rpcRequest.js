/*




*/
const { HttpRequest }                                           = require( '../../../../common/utils/request/request.js' );

async function _rpc( url, method, param, id ) {
  var data = {
    "jsonrpc":  "2.0",
    "method":   method,
    "params":   param,
    "id":       id
    }
    return await HttpRequest( 'POST', url, data );
}

module.exports.rpcRequest     = _rpc;