

  var _middleWare_auth = function (req, res, next) {

    try{
        console.log( "Entriy _middleWare_auth")
        //res.status(501).send('');
        req.Auth = {
            key: '0x0000'
        }
        next()
    } catch( e ) {

    } finally {
        
    }
  }

  module.exports.MiddleWare_Auth = _middleWare_auth;