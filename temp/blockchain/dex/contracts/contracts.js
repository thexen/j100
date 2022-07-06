/*




*/
const swapHelper        = "0x38799a6c39B77cA13562B77A222F488f05EE924d";
const swapPoolManager   = "0x37c7B97F40Fc190e29645237842daa3d1C9EeF8d";
const swapPoolFactory   = "0x3832a5C445c6fb5793D5287D720cc5AF88C63cD9";
const tokenManager      = "0x6a8Ba3365271508171F38de33bD4087eBE55ce9E";


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