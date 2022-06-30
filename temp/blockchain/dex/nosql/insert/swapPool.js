/*




*/
const { UpsertToMongo, QueryFromMongo, FindToModify }                         =  require ( '../../../../common/chains/mongo/call.js' );

/*

    let swapPool  = {
        tokens: {
            first: {
                contract:       firstToken,
                symbol:         res1.symbol,
                icon:           res1.icon,
            },
            second: {
                contract:       firstToken,
                symbol:         res1.symbol,
                icon:           res1.icon,
            },
        },
        contracts: { 
            sp:     sp,
            holder: holder,
            lpt:    lpt,
        },
        block: {
            number: blockNumber,
            tx: txHash,
        },
        assets: {
            first: 0,
            second: 0,
            totalSupply: 0, //LPT 발행수    
        },
        stat: {
            thirtyDays: { //30일간 누적 통계
                tradingVolume: {
                    first: 0,
                    second: 0,
                },
                income: {
                    first: 0,
                    second: 0,
                }
            }
        },
    }

*/

async function _insertSwapPool( index, firstToken, secondToken, sp, holder, lpt, block ) {
 
    let swapPoolInfo  = {
        tokens: {
            first:          firstToken,
            second:         secondToken,
        },
        contracts: { 
            sp:             sp,
            holder:         holder,
            lpt:            lpt,
        },
        block: block,
        assets: {
            first:          0,
            second:         0,
            totalSupply:    0, //LPT 발행수    
        },
        stat: {
            thirtyDays: { //30일간 누적 통계
                tradingVolume: {
                    first:  0,
                    second: 0,
                },
                income: {
                    first:  0,
                    second: 0,
                }
            }
        },
    }

    //console.log( JSON.stringify( swapPoolInfo, null, 2 ) )
    UpsertToMongo( 'swappools', index, swapPoolInfo );
    _insertPair( index, sp, firstToken.contract, secondToken.contract );
   
  }

  async function _insertPair( index, sp, firstToken, secondToken ) {

    var pair = {
        sp:             sp,
        first:          firstToken,
        second:         secondToken
    };

    UpsertToMongo( 'pairs', index, pair );

}

  /*
  async function _insertPair( firstToken, secondToken ) {

    var pair = {
        first:          firstToken,
        second:         secondToken,
    };

    var query2  = {
        query: { 
            _id: 'pair',
        }, 
        update: {
            $inc: { seq: 1 }
        },
        upsert: true
    }    
    var res1      = await FindToModify( "counters", { 
        _id: 'pairs',
    }, 
    { rating: 1 },
    {
        '$inc': { seq: 1 }
    } );

    console.log( res1 );

  }
  */

  async function test() {
   
    //CreateSwapPool Event 감지
    
    //Token Contract 조회
    var index   = 4;
    var first   = '0x21CB1A627380BAdAeF180e1346479d242aca90D3';
    var second  = '0x658a3a6065E16FE42D8a51CC00b0870e850909F5';
    var sp      = '0x1b4aec06E2dB060333B610A53C8AcF25c8EF2c02';
    var holder  = '0x39ceB2fb68e75A7a276e2126c66aAb38F6b50e09';
    var lpt     = '0xce6dd7ceAed8a2198573aE318CE71e96397dbCF1';
    var block   = {
        //number:     93696482,
        //tx:         '0x47cbe30c9b4f18c5523c92cc10304277ddd3952857f04bb2c04c9a1060c40ab9',
        number: 0,
        tx: 0,
    };

    var query1     = {
        findone: { 
          "_source.contract": first
        }
      }
    var query2  = {
        findone: { 
            "_source.contract": second
        }
    }    
    var res1      = await QueryFromMongo( "tokens", query1 );
    var res2      = await QueryFromMongo( "tokens", query2 );

    var firstToken = {
        contract:       first,
        symbol:         res1.symbol,
        icon:           res1.icon,
    };

    var secodToken = {
        contract:       second,
        symbol:         res2.symbol,
        icon:           res2.icon,
    };    

    //Token Contract 조회
    _insertSwapPool( index, firstToken, secodToken, sp, holder, lpt, block );

  }

test();
//_insertPair( 1, '0x6a72Ffb94a5E24529fa27107297CcdccF7C95E8B', '0x21CB1A627380BAdAeF180e1346479d242aca90D3', '0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e');

  module.exports.insertSwapPool     = _insertSwapPool;