/*




*/
const netWork         = "https://kaikas.baobab.klaytn.net:8651";
const webSocket       = "wss://api.baobab.klaytn.net:8652";

function _getBaoBabNetwork() {
  return netWork;
}

function _getBaoBabWebSocket() {
  return webSocket;
}


module.exports.GetBaoBabNetwork                   = _getBaoBabNetwork;
module.exports.GetBaoBabWebSocket                 = _getBaoBabWebSocket;
