/*




*/
const { UpsertToMongo }                       =  require ( '../../../../common/chains/mongo/call.js' );
const { Symbol }                              =  require ( '../../inquery/erc20.js' );

function _getAbiSetToken() {

  var abi = {
    type: 'event',
    name: 'SetToken',
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
          name: 'token',
      },{
          type: 'uint256',
          name: 'expireDate',
      },{
          type: 'uint8',
          name: 'weight',
      }
    ]
  } 
    
  return abi;
}

async function _setToken( eventLog, decodedEventLog, mongoClient ) {
  console.log("ENTRY _setToken()");
  
  var symbol  = undefined;
  var icon    = 'http://TODO.com';

  if( decodedEventLog.token == '0x0000000000000000000000000000000000000000' ) {
    symbol = 'klay';
  } else {
    symbol = await Symbol( decodedEventLog.token );
    symbol = symbol[0];
  }

  let tokenInfo  = {
    contract:   decodedEventLog.token,
    symbol:     symbol,
    icon:       icon,
    grade:      decodedEventLog.weight,
    block:      {
      number: eventLog.blockNumber,
      tx:     eventLog.transactionHash,
    }
  }  

  await UpsertToMongo( mongoClient, 'tokens', decodedEventLog.index, tokenInfo );

}

module.exports.getAbiSetToken                       = _getAbiSetToken;
module.exports.eventSetToken                        = _setToken;