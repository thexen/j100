/*




*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _balanceOf( token, owner ) {

  try{
    var data = await AbiEncode( "balanceOf(address)", owner );
    const val = await QueryChain().call({
      to: token, 
      data: data,
    });
    var dec = QueryChain().abi.decodeParameter( 'uint256', val );
    console.log( "_balanceOf: " + token + " - "  + dec )
    return dec;
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

module.exports.BalanceOf           = _balanceOf;