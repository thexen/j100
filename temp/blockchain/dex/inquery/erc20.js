/*




*/
const { encodeAbi }                             = require ( '../utils/encoder/encoder.js' );
const { GetRPC  }                               = require ( '../networks/provider.js' );
const Web3                                      = require('web3');
const web3                                      = new Web3( new Web3.providers.HttpProvider( GetRPC() ) );
function _queryChain() {
  return web3.eth;
}

async function _balanceOf( token, owner ) {
  try{
    var data = await encodeAbi( "balanceOf(address)", owner );
    const val = await _queryChain().call({
      to: token, 
      data: data,
    });
    return _queryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _symbol( token ) {
  try{
      var data = _queryChain().abi.encodeFunctionSignature( "symbol()" );
      const val = await _queryChain().call({
        to: token, 
        data: data,
      });
      return _queryChain().abi.decodeParameters( ['string'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _name( token ) {
  try{
      var data = _queryChain().abi.encodeFunctionSignature( "name()" );
      const val = await _queryChain().call({
        to: token, 
        data: data,
      });
      return _queryChain().abi.decodeParameters( ['string'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}


async function _allowance( token, owner, spender ) {
  try{
    var data = await encodeAbi( "allowance(address,address)", owner,spender );
    const val = await _queryChain().call({
      to: token, 
      data: data,
    });
    return _queryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.BalanceOf           = _balanceOf;
module.exports.Symbol              = _symbol;
module.exports.Name                = _name;
module.exports.Allowance           = _allowance;