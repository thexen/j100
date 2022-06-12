/*




*/
const { QueryChain }                  = require ( '../networks/active.js' );      

async function _inqueryAssets( swapPool ) {

  try{
      var data = QueryChain().abi.encodeFunctionSignature( "inqueryAssets()" );
      const val = await QueryChain().call({
        to: swapPool, 
        data: data,
      });
      var obj = QueryChain().abi.decodeParameters( ['uint256','uint256'], val );
      return [ obj["0"], obj["1"] ];
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InqueryAssets     = _inqueryAssets;