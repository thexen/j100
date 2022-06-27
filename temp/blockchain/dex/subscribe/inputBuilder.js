/*




*/
const {abiBuild}                                                = require ( './abiBuilder.js' );
const abiRouter                                                 = require ( './router/abiRouter.js' );

/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

function _build() {
  return abiBuild( abiRouter.abiEventRouter_info );
}


module.exports.builder     = _build;