/*




*/

const { 
  GetBaoBabRPC, 
  GetBaoBabWebSocket 
}                               = require ( './klaybaobab.js' );


function _getRPC() {
  return GetBaoBabRPC();
}

function _getWebSocket() {
  return GetBaoBabWebSocket();
}

module.exports.GetRPC                       = _getRPC;
module.exports.GetWebSocket                 = _getWebSocket;
