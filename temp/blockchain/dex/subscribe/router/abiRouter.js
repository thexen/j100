/*




*/

module.exports = {

  abiEventRouter_info : [ 
    { file: './event/swapPool.js',      abi: 'getAbiCreateSwapPool',      event: 'eventCreateSwapPool' }, 
    { file: './event/tokenManager.js',  abi: 'getAbiSetToken',            event: 'eventSetToken' }, 
    { file: './event/sample.js',        abi: 'getAbi01',                  event: 'eventSampleCallBack01' }, 
    //{ file: './event/sample.js',        abi: 'getAbi02',                  event: 'eventSampleCallBack02' }, 
  ]

}
