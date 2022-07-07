/*




*/
const { UpsertToMongo, QueryFromMongo }                      =  require ( '../../../../common/chains/mongo/call.js' );

function _getAbiCreateSwapPool() {

      var abi = {
            type: 'event',
            name: 'CreateSwapPool',
            inputs: [
            {
                  type: 'function',
                  name: 'method',
                  indexed: true
            },{
                  type: 'uint256',
                  name: 'index',
            },{
                  type: 'address',
                  name: 'firstToken',
            },{
                  type: 'address',
                  name: 'secondToken',
            },{
                  type: 'address',
                  name: 'sp',
            },{
                  type: 'address',
                  name: 'holder',
            },{
                  type: 'address',
                  name: 'lpt',
            },{
                  type: 'uint256',
                  name: 'fee',
            }
            ]
      }
      
    return abi;
}

async function _createSwapPool( eventLog, decodedEventLog, mongoClient ) {
      console.log("ENTRY _createSwapPool()");
      //console.log( decodedEventLog )

      var assets = {
            first: 0,
            second: 0,
            totalSupply: 0, //LPT 발행수    
      };

      var query1 = {
            findone: {
                '_source.token.contract': decodedEventLog.firstToken,
            }
          }

      var query2 = {
            findone: {
                '_source.token.contract': decodedEventLog.secondToken,
            }
          }          

      var res1        = await QueryFromMongo( mongoClient, 'tokens', query1 );
      var res2        = await QueryFromMongo( mongoClient, 'tokens', query2 );

      let swapPoolInfo  = {
            tokens: {
                  first:          res1.token,  
                  second:         res2.token
            },
            contracts: { 
                  sp:             decodedEventLog.sp,
                  holder:         decodedEventLog.holder,
                  lpt:            decodedEventLog.lpt,
            },
            fee:        decodedEventLog.fee,
            assets:     assets,
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
            block: {
                  number: eventLog.blockNumber,
                  tx:     eventLog.transactionHash,
            }     
      }

      var pair = {
            sp:             decodedEventLog.sp,
            first:          decodedEventLog.firstToken,
            second:         decodedEventLog.secondToken,
            fee:            decodedEventLog.fee,        
            assets:         assets,
      };

      await UpsertToMongo( mongoClient, 'swappools',  decodedEventLog.index,     swapPoolInfo );
      await UpsertToMongo( mongoClient, 'pairs',      decodedEventLog.index,     pair );

}

module.exports.getAbiCreateSwapPool                    = _getAbiCreateSwapPool;
module.exports.eventCreateSwapPool                     = _createSwapPool;
