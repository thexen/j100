/*




*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _allowance( contract, owner, spender ) {

  try{
    var data = await AbiEncode( "allowance(address,address)", owner,spender );
    const val = await QueryChain().call({
      to: contract, 
      data: data,
    });
    var dec = QueryChain().abi.decodeParameter( 'uint256', val );
    return dec;
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

module.exports.Allowance           = _allowance;