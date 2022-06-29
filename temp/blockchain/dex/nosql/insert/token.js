/*




*/
const { UpsertToMongo, QueryFromMongo }                         =  require ( '../../../../common/chains/mongo/call.js' );

/*
 
    let token  = {
        symbol: symbol,
        icon: icon,
        block: {
            number: blockNumber,
            tx: txHash,
        },        
    }

*/

async function _insertToken( token, symbol, icon, block ) {
 
    let tokenInfo  = {
        symbol: symbol,
        icon:   icon,
        block:  block,
    }

    UpsertToMongo( 'tokens', token, tokenInfo );
   
  }

  async function test() {
   


  }

  test();

  module.exports.insertToken     = _insertToken;