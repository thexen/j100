//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////

function _checkRetrictions( _ownerJson, _callerJson ){
    if( _callerJson.role == 'SEED' ){
        return;
    }
    if( _ownerJson != undefined && _ownerJson.did == _callerJson.did ){
        return;
    }
    throw Error( "Violation of restrictions" );
}

function _checkRetrictionFromDoc( _docRestrictions, _callerRestrictions ){

    //요청자의 대리인이 존재 한다면 문서의 대리인과 일치 하는지 여부
    if( _docRestrictions.agency != undefined ) {
        if( _docRestrictions.agency.did == _callerRestrictions.user.did ){
            return;
        }        
        if(_callerRestrictions.agency != undefined ){
            if( _docRestrictions.agency.did == _callerRestrictions.agency.did ){
                return;
            }
        }
    }

    //요청자가 SEED 권한
    if( _callerRestrictions.user.role == 'SEED' ){
        return;
    }

    //요청자가 문서의 소유자
    if( _docRestrictions.user != undefined && _docRestrictions.user.did == _callerRestrictions.user.did ){
        return;
    }
    
    //요청자가 verifier
    if( _docRestrictions.verifier != undefined && _docRestrictions.verifier.did == _callerRestrictions.user.did ){
        return;
    }

    //요청자가 issuer
    if( _docRestrictions.issuer != undefined && _docRestrictions.issuer.did == _callerRestrictions.user.did ){
        return;
    }    

    //요청청자 verifier, issuer의 대리인
    if( _docRestrictions.agency != undefined && _docRestrictions.agency.did == _callerRestrictions.user.did ){
        return;
    }

    throw Error( "Violation of restrictions" );
}

module.exports.CheckRetrictions          = _checkRetrictions;
module.exports.CheckRetrictionFromDoc    = _checkRetrictionFromDoc;
