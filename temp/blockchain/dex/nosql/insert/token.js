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

async function _insertToken( index, token, symbol, icon, block ) {
 
    let tokenInfo  = {
        contract:   token,
        symbol:     symbol,
        icon:       icon,
        block:      block,
    }

    UpsertToMongo( 'tokens', index, tokenInfo );
   
  }

  async function test() {
   
    var query1 = {
            find: { 
                "_source.grade": {'$gte': 4 }
            }
        }
  
    var res1      = await QueryFromMongo( "tokens", query1 );

    console.log( res1 );
  }

  test();

  module.exports.insertToken     = _insertToken;