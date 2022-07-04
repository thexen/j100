/*




*/
// const { QueryChain, QueryWS  }                                  =  require ( '../networks/active.js' );
const { abiEventMapper }                                        =  require ( './mappingBuilder' );
const { Logger }                                                =  require ( './logger' );
const { 
  GetBaoBabNetwork, 
  GetBaoBabWebSocket 
}                                                               =  require ( '../networks/klayBaobab.js' );
const Caver                                                     =  require ( 'caver-js' );
const cron                                                      =  require ( 'node-cron' );

const caver = new Caver( GetBaoBabNetwork() );

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
    const result = await caver.rpc.klay.getLogs(filters);

    // call logger
    result.forEach( function ( item ) {
      Logger(item, abiEventMapper);
    });

    // var subscription = QueryWS().subscribe('logs', filters, function(error, result) {
    //   console.log("in.....");
    //     if (error) {
    //       subscription.unsubscribe( (error, success) => {
    //           if(error) {
    //             console.log('Failed to disconnect from Thundercore mainnet!');
    //           }
    //           if(success) {
    //             console.log('disconnected');
    //           }
    //         });
    //     } else {
    //       Logger( result, abiEventMapper );
    //     }
    //   })
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
/*
subscribe( 95153514, 95153614, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a' ] );
*/
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

// log from `startBlock` to `endBlock`
// block range
const startBlock = 95153503;
const endBlock = 95154614;
let currentBlock = startBlock;
cron.schedule('*/5 * * * * *', async function() {
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