/*




*/

module.exports = {

  abiEventMapper_info : [ 
    { file: '../abi/sample.js',               abi: 'getAbi01',                  event: 'eventSampleCallBack01' }, 
    { file: '../abi/sample.js',               abi: 'getAbi02',                  event: 'eventSampleCallBack02' },     
    
    { file: '../abi/objects.js',              abi: 'getAbiRegistObject',        event: 'eventRegistObject' }, 
    { file: '../abi/objects.js',              abi: 'getAbiRegistPermission',    event: 'eventRegistPermission' }, 

    { file: '../abi/swapPoolFactory.js',      abi: 'getAbiCreateSwapPool',      event: 'eventCreateSwapPool' }, 
    { file: '../abi/tokenManager.js',         abi: 'getAbiSetToken',            event: 'eventSetToken' }, 

    { file: '../abi/DAO.js',                  abi: 'getAbiProposal',            event: 'eventProposal' }, 
    { file: '../abi/DAO.js',                  abi: 'getAbiInvoke',              event: 'eventInvoke' }, 

    { file: '../abi/swapHelper.js',           abi: 'getAbiExchange',            event: 'eventExchange' }, 

    { file: '../abi/gToken.js',               abi: 'GetAbiStaking',             event: 'eventStaking' }, 
    { file: '../abi/gToken.js',               abi: 'getAbiUnstaking',           event: 'eventUnstaking' }, 
    { file: '../abi/gToken.js',               abi: 'getAbiTransferRewardTo',    event: 'eventTransferRewardTo' }, 
    { file: '../abi/gToken.js',               abi: 'getAbiBurn',                event: 'eventBurn' }, 
    { file: '../abi/gToken.js',               abi: 'getAbiRecycle',             event: 'eventRecycle' }, 

    { file: '../abi/teamVault.js',            abi: 'getAbiAddMember',           event: 'eventAddMember' }, 
    { file: '../abi/teamVault.js',            abi: 'getAbiRemoveMember',        event: 'eventRemoveMember' }, 
    { file: '../abi/teamVault.js',            abi: 'getAbiProposal',            event: 'eventProposal' }, 
    { file: '../abi/teamVault.js',            abi: 'getAbiApproval',            event: 'eventApproval' }, 
    { file: '../abi/teamVault.js',            abi: 'getAbiInvoke',              event: 'eventInvoke' },             

    { file: '../abi/swapPool.js',             abi: 'getAbiFounding',            event: 'eventFounding' }, 
    { file: '../abi/swapPool.js',             abi: 'getAbiDeposit',             event: 'eventDeposit' },     
    { file: '../abi/swapPool.js',             abi: 'getAbiWithdrawal',          event: 'eventWithdrawal' },         
    { file: '../abi/swapPool.js',             abi: 'getAbiStatistics',          event: 'eventStatistics' },         
    { file: '../abi/LPT.js',                  abi: 'getAbiEnhance',             event: 'eventEnhance' },         

  ]

}
