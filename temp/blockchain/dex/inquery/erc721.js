/*
  ERC721



*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _isApprovedForAll( token, owner, perator ) {

  try{
    var data = await AbiEncode( "isApprovedForAll(address,address)", owner, perator );
    const val = await QueryChain().call({
      to: token, 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['bool'], val );
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

async function _getApproved( token, tokenId ) {

  try{
    var data = await AbiEncode( "getApproved(uint256)", tokenId );
    const val = await QueryChain().call({
      to: token, 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['address'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

module.exports.IsApprovedForAll           = _isApprovedForAll;
module.exports.Symbol                     = _symbol;
module.exports.GetApproved                = _getApproved;