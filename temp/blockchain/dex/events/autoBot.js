/*




*/
//const { abiEventMapper }                                        = require ( './mappingBuilder' );
const { Logger }                                                = require ( './logger' );
const { 
  GetRPC, 
  GetWebSocket 
}                                                               = require ( '../networks/provider.js' );

const Caver                                                     = require ( 'caver-js' );
const cron                                                      = require ( 'node-cron' );

const caver           = new Caver( GetRPC() );

const {abiEventBuild}                                           = require ( './utils/abiBuilder.js' );
const abiEventMappers                                           = require ( './mapper/abiEventMappers.js' );
const abiEventMapper  = abiEventBuild( caver, abiEventMappers.abiEventMapper_info );

/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

async function subscribe( fromblockNumber, toblockNumber, contract ) {

  //-------------------------------------------------------------
  var filters = {
      fromBlock:  fromblockNumber,
      toBlock:    toblockNumber,
      address:    contract
  };

  try{
    // get logs
/*
// Request

POST https://kaikas.baobab.klaytn.net:8651

{
  "jsonrpc":"2.0",
  "method":"klay_getLogs",
  "params":[
    {
      "fromBlock":95153514,
      "toBlock": 95153614,
      "address": "0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D"
    }
  ],
  "id": 1
}

response 
{
"jsonrpc": "2.0",
"id": 1,
result: []
  }
*/    
    const result = await caver.rpc.klay.getLogs(filters);
    // call logger
    result.forEach( function ( item ) {
      Logger(item, abiEventMapper);
    });

  } catch(e) {
    console.log( e );
  }
}


/*
subscribe( 95153503, 95153504, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a' ] );
*/

subscribe( 95153514, 95153614, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
                            /*, '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
, '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a'*/ ] );

//subscribe( 95153614, 95154614, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
//                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
//                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
//                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a'
//                            , '0x7e545d567ABD995242a2415e9522e9d7CC986E60'] );

//               ┌────────────── second (optional)
//               │ ┌──────────── minute
//               │ │ ┌────────── hour
//               │ │ │ ┌──────── day of month
//               │ │ │ │ ┌────── month
//               │ │ │ │ │ ┌──── day of week
//               │ │ │ │ │ │
//               │ │ │ │ │ │
//               * * * * * *
//cron.schedule('*/5 * * * * *', async function() {
//  // get block number
//  const blockNumber = await caver.klay.getBlockNumber();
//  console.log(blockNumber);
//
//  // 5초 마다 이전 10개의 블록에 대한 log를 가져와서 update한다.
//  const fromBlock = Number(blockNumber) - 10;
//  const toBlock = blockNumber;
//  console.log(fromBlock);
//  subscribe( fromBlock, toBlock, ['0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D',
//                                  '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8',
//                                  '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458',
//                                  '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a',
//                                  '0x7e545d567ABD995242a2415e9522e9d7CC986E60']);
//});


/*
// log from `startBlock` to `endBlock`
// block range
const startBlock = 95153503;
const endBlock = 95154614;
let currentBlock = startBlock;
*/
//cron.schedule('*/5 * * * * *', async function() {
/*
  // check end block
  if (currentBlock >= endBlock){
    // stop
    return;
  }

  // get block number
  const blockNumber = await caver.klay.getBlockNumber();
  console.log(blockNumber);

  // 5초 마다 10개의 블록에 대한 log를 가져와서 update한다.
  const fromBlock = Number(currentBlock);
  const toBlock = fromBlock + 10;
  console.log(toBlock);

  // 현재 block number 보다 작을 때만 실행
  if ( blockNumber > toBlock ) {
    subscribe( fromBlock, toBlock, ['0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D',
                                    '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8',
                                    '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458',
                                    '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a',
                                    '0x7e545d567ABD995242a2415e9522e9d7CC986E60']);

    // set next block
    currentBlock = toBlock;
  }
});
*/

