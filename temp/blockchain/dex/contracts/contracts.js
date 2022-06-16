/*




*/
const swapHelper        = "0xc0D9a54cF6b54361Ac045cD849E8Da784a68E5f8";
const swapPoolManager   = "0xbAa0951c51f93350771c0DD48c5D49ae5BEe8cA2";
const swapPoolFactory   = "0x125e64F6594Ff13479B0d9525B9dd2FF6098552c";
const tokenManager      = "0x42e8F7474996dA449639cb5c4125732c0a992E7a";


function _getContract( object ) {

    switch( object ) {
      case "swapHelper":
        return swapHelper;
      case "swapPoolManager":
        return swapPoolManager;
      case "tokenManager":
        return tokenManager;       
      case "swapPoolFactory":
        return swapPoolFactory;             
      default:
        throw Error( "not found contract" );
    }
}

module.exports.GetContract                  = _getContract;