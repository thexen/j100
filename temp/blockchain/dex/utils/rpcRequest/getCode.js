/*




*/

const { rpcRequest }                                            = require( './rpcRequest.js' );
const { 
  GetRPC, 
  GetWebSocket 
}                                                               = require ( '../../networks/provider.js' );

async function _getCode( rpc, id, address ) {
    try{    
      return await rpcRequest( rpc, 'eth_getCode', [address, "latest"], id );
    } catch(e) {
      console.log( e );
    }
}

async function _isContract( rpc, address ) {
    try{    
        let res = await _getCode( rpc, 1, address );
        if( res.result.length > 2 ){
            return true;
        }
        return false;
      } catch(e) {
        console.log( e );
      }
}

_isContract( 'https://kaikas.baobab.klaytn.net:8651', '0xf42d21cc990a495a06b7a45fcabb7cc0606fae4c');

/*
  //Contract Address
  _isContract( 'https://kaikas.baobab.klaytn.net:8651', '0xf42d21cc990a495a06b7a45fcabb7cc0606fae4c');
  //Account Address
  _isContract( GetRPC(), '0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B');
*/
  
module.exports.getCode                  = _getCode;
module.exports.isContract               = _isContract;