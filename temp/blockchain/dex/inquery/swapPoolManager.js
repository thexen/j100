/*
  Prefix: SPM ( Swap Pool Manager )



*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { GetContract }                 = require ( '../contracts/contracts.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryDailyStat( swapPool, date ) {
  try{
    var data = await AbiEncode( "inqueryDailyStat(address,uint256,uint256)"
                      , swapPool
                      , date
                      , 1 );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });
    //모르겠음, index(1부터), 시간 / 86400, first token 거래량, second token 거래량, first token 수수료 수익, second token 수수료 수익
    return QueryChain().abi.decodeParameters(['uint256','uint256','uint256','uint256','uint256','uint256','uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryPoolSize() {
  try{
    var data = QueryChain().abi.encodeFunctionSignature( "inqueryPoolSize()" );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inquerySwapPool( index ) {
  try{
    var data = await AbiEncode( "inquerySwapPool(uint256)", index );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['address'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inquerySwapPool( index ) {
  try{
    var data = await AbiEncode( "inquerySwapPool(uint256)", index );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['address'], val );
} catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryLPT( swapPool ) {
  try{
    var data = await AbiEncode( "inqueryLPT(address)", swapPool );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['address'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryLPTStakingHolder( swapPool ) {
  try{
    var data = await AbiEncode( "inqueryLPTStakingHolder(address)", swapPool );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['address'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InquerySPMDailyStat          = _inqueryDailyStat;
module.exports.InquerySPMPoolSize           = _inqueryPoolSize;
module.exports.InquerySPMSwapPool           = _inquerySwapPool;
module.exports.InquerySPMLPT                = _inqueryLPT;
module.exports.InquerySPMLPTStakingHolder   = _inqueryLPTStakingHolder;

//dailyStat( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4", (Date.now()/1000).toFixed(0) );

