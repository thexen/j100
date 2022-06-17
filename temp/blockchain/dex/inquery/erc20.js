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
    return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _symbol( token ) {
  try{
      var data = QueryChain().abi.encodeFunctionSignature( "symbol()" );
      const val = await QueryChain().call({
        to: token, 
        data: data,
      });
      return QueryChain().abi.decodeParameters( ['string'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _allowance( token, owner, spender ) {
  try{
    var data = await AbiEncode( "allowance(address,address)", owner,spender );
    const val = await QueryChain().call({
      to: token, 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.BalanceOf           = _balanceOf;
module.exports.Symbol              = _symbol;
module.exports.Allowance           = _allowance;