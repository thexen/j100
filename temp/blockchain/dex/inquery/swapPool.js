/*
  Prefix: SP ( Swap Pool )



*/
const { QueryChain }                  = require ( '../networks/active.js' );      
const { AbiEncode }                   = require ( '../../utils/abi.js' )

async function _inqueryAssets( swapPool ) {
  try{
      var data = QueryChain().abi.encodeFunctionSignature( "inqueryAssets()" );
      const val = await QueryChain().call({
        to: swapPool, 
        data: data,
      });
      return QueryChain().abi.decodeParameters( ['uint256','uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryAssetPerLPT( swapPool, lptAmount ) {
  try{
    var data = await AbiEncode( "inqueryAssetPerLPT(uint256)", lptAmount );
      const val = await QueryChain().call({
        to: swapPool, 
        data: data,
      });
      return QueryChain().abi.decodeParameters( ['uint256','uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryToken( swapPool, enumToken ) {
  try{
    var data = await AbiEncode( "inqueryToken(uint8)", enumToken );
      const val = await QueryChain().call({
        to: swapPool, 
        data: data,
      });
      return QueryChain().abi.decodeParameters( ['address'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryPoolInfo( swapPool ) {
  try{
      var data = QueryChain().abi.encodeFunctionSignature( "inqueryPoolInfo()" );
      const val = await QueryChain().call({
        to: swapPool, 
        data: data,
      });
      return QueryChain().abi.decodeParameters( ['address','uint256','uint256','address','uint256','uint256','address','address','uint256','uint256','uint256','bool','bool','uint256'], val );
      //return [ obj["0"], obj["1"], obj["2"], obj["3"], obj["4"], obj["5"], obj["6"], obj["7"], obj["8"], obj["9"], obj["10"], obj["11"], obj["12"], obj["13"], ];
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InquerySPAssets          = _inqueryAssets;
module.exports.InquerySPAssetPerLPT     = _inqueryAssetPerLPT;
module.exports.InquerySPToken           = _inqueryToken;
module.exports.InquerySPPoolnfo         = _inqueryPoolInfo;