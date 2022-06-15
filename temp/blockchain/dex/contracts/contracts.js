/*




*/
const swapHelper      = "0x659aCd70df7e021302aA2907FE1Dbb7eE50DBc38";
const swapPoolManager = "0x7F29d1A9B3c0D9aa386dd4d3470ED125cABBf2F4";
const tokenManager    = "0x9383FEc71ECDfF1511d8f26b9f8Bc0100e0ec49B";

function _getContract( object ) {

    switch( object ) {
      case "swapHelper":
        return swapHelper;
      case "swapPoolManager":
        return swapPoolManager;
      case "tokenManager":
        return tokenManager;        
      default:
        throw Error( "not found contract" );
    }
}

module.exports.GetContract                  = _getContract;