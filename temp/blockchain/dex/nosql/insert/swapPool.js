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

async function _insertSwapPool( firstToken, secondToken, sp, holder, lpt, block ) {
 
    let swapPoolInfo  = {
        tokens: {
            first:          firstToken,
            second:         secondToken,
        },
        contracts: { 
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

    UpsertToMongo( 'swappools', sp, swapPoolInfo );
   
  }

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

  async function test() {
   
    //CreateSwapPool Event 감지
    
    //Token Contract 조회
    var first   = '0x21CB1A627380BAdAeF180e1346479d242aca90D3';
    var second  = '0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e';
    var sp      = '0x6a72Ffb94a5E24529fa27107297CcdccF7C95E8B';
    var holder  = '0x6ee6bE58DBa446dDdb75B2d979cEd3c3d6196196';
    var lpt     = '0x74483151DDF9147320C2649397F3844fB0147D44';
    var block   = {
        number:     93696482,
        tx:         '0x47cbe30c9b4f18c5523c92cc10304277ddd3952857f04bb2c04c9a1060c40ab9',
    };

    var query1     = {
        findone: { 
          "_id": first
        }
      }
    var query2  = {
        findone: { 
            "_id": second
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
    _insertSwapPool( firstToken, secodToken, sp, holder, lpt, block );

  }

  //test();

  _insertPair();

  module.exports.insertSwapPool     = _insertSwapPool;