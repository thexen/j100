const util              = require('util')
const {HttpRequest}     = require('../../common/utils/request/request.js')


var _loadPairs = async function() {

    let     pairs       = [];
    try{
        const   method      = "POST";
        const   url         = "http://127.0.0.1:8080/restapi/search/query";
        const   data        = { collection: 'pairs', query: { find: {} } };
        let     res         = await HttpRequest(method, url, data);

        // set swap pool info
        res.data.forEach(function (item) {
            pairs.push({ pair: [item._source.first, item._source.second] });
        });
        return pairs;
    } catch( e ) {

    } finally {
        pairs = undefined;
    }
}

const _loadTokens = async function( grade ) {
    
    let tokens = [];
    try{
        const method    = "POST";
        const url       = "http://127.0.0.1:8080/restapi/search/query";
        const data      = {
            collection: 'tokens',
            query: {
                find: {
                    '_source.grade' : {
                        '$lte':Number(grade)
                    }
                }
            }
        };

        let res = await HttpRequest(method, url, data);

        // set token info
        res.data.forEach(function(item){
            tokens.push(item._source.contract);
        })
        return tokens;
    } catch( e ) {

    } finally {
        tokens = undefined;
    }
}

const _getPermutations = (array, selectNumber) => {
    const results = [];
    if (selectNumber === 1) {
    return array.map((element) => [element]);
    }
    array.forEach((fixed, index, origin) => {
    const rest          = [...origin.slice(0, index), ...origin.slice(index + 1)];
    const permutations  = _getPermutations(rest, selectNumber - 1);
    const attached      = permutations.map((permutation) => [fixed, ...permutation]);

    results.push(...attached);
    });
    return results;
};

var _getMiddlePaths = function( tokens, from, to, waypointCount )  {
    let res             = [];
    let middleNodes     = [];
    try{
        for( var i=0; i<tokens.length; i++ ){
            if( tokens[i] == from || tokens[i] == to ) {
            } else {
                middleNodes.push( tokens[i] );
            }
        }

        var middleNodeCount = waypointCount;
        if( middleNodeCount > middleNodes.length || middleNodeCount == undefined )
            middleNodeCount = middleNodes.length;

        for( var i=0; i<middleNodeCount; i++ ){
            res.push(_getPermutations(middleNodes, i + 1 ));
        }
        return res;
    } catch( e ){
        throw Error( e.message );
    } finally {
        middleNodes = undefined;
        res         = undefined;
    }
}

var _getSwapPoolRoutes = function( tokens, from, to, waypointCount, debug ) {
    var res         = _getMiddlePaths( tokens, from, to, waypointCount);
    var swapPaths   = [];

    var swapPath    = [];
    var pairToken   = [];

    try{    
        pairToken = [ from, to ];
        swapPath.push( pairToken );
        swapPaths.push( swapPath );

        for( var i=0;i<res.length; i++ ) {
            for( var k=0;k<res[i].length; k++ ) {
                if( debug != undefined)
                    console.log( res[i][k] )
                swapPath    = [];
                pairToken   = [];
                for( var j=0; j<res[i][k].length; j++ ) {
                    if( j == 0 ){
                        pairToken = [ from, res[i][k][j] ];
                        swapPath.push( pairToken );
                        if( res[i][k].length > 1 ){
                            pairToken = [ res[i][k][j], res[i][k][j+1] ];
                            swapPath.push( pairToken );
                        }
                    }
                    if( j == res[i][k].length - 1 ){ 
                        pairToken = [ res[i][k][j], to ];
                        swapPath.push( pairToken );
                    }
                    if( j > 0 &&  j < res[i][k].length - 1 ) {
                        pairToken = [ res[i][k][j], res[i][k][j+1] ];
                        swapPath.push( pairToken );
                    }
                }
                if( debug != undefined)
                    console.log( swapPath );
                swapPaths.push( swapPath );
            }
        }
        return swapPaths;
    } catch( e ){
        throw Error( e.message );
    } finally {
        res         = undefined;
        pairToken   = undefined;        
        swapPath    = undefined;
        swapPaths   = undefined;        
    }    
}

var _discoverySwapRoute = function( pairs, tokens, from, to, waypointCount ) {

    var swapRoutes = {
        swap_route:     undefined,
        best_route:     undefined,
        worst_route:    undefined,
    };
    var brokenPaths         = [];

    swapRoutes.swap_route   = _getSwapPoolRoutes( tokens, from, to, waypointCount );
    try{    

        //?????? ???????????? ????????? ????????? ????????????.
        for( var i=0; i<swapRoutes.swap_route.length; i++ ) {
            //console.log( 'path: ' +  swapRoutes.swap_route[i] );
            //console.log( swapRoutes.swap_route[i] );
            //?????? ??????
            var naviSwapRaing   = 0;
            var bFound          = false;
            for( var k=0; k<swapRoutes.swap_route[i].length; k++ ) {
                //?????? ????????? ?????? ?????? Swap Pool ??????
                bFound          = false;
                for( var j=0; j<pairs.length; j++ ) {
                    if( ( pairs[j].pair[0] == swapRoutes.swap_route[i][k][0] || pairs[j].pair[1] == swapRoutes.swap_route[i][k][0] ) 
                        && ( pairs[j].pair[0] == swapRoutes.swap_route[i][k][1] || pairs[j].pair[1] == swapRoutes.swap_route[i][k][1] ) ){
                        var info = {}
                        info[ 'from' ]      = { token: swapRoutes.swap_route[i][k][0], balance: 0 };
                        info[ 'to' ]        = { token: swapRoutes.swap_route[i][k][1], balance: 0 };
                        info[ 'rating' ]    = 0;
                        if( !bFound ) {
                            swapRoutes.swap_route[i][k].push( info );
                        } else {
                            console.log("execptions...found sampe swap pool");
                        }
                        bFound = true;
                    }    
                }
                if( !bFound ) {
                    break;
                }                
                if( swapRoutes.swap_route[i][k].length > 3 ) {
                    throw( swapRoutes.swap_route[i][k] );
                }
            }
            if( !bFound ) {
                swapRoutes.swap_route.splice( i, 1 );
                i--;
            } 
        }

        //?????? ?????? ??????
        for( var i=0; i<brokenPaths.length; i++ ){
            swapRoutes.swap_route.splice( brokenPaths[i]-i, 1 );
        }
        return swapRoutes;
    } catch( e ){
        throw Error( e.message );
    } finally {
        brokenPaths = undefined;
    }
}

var _discoveryFirstMiddleRoute = function( pairs, tokens, from, to, waypointCount ) {
    try{
        var exploredRoute = [];
        var exploredswapRoutes = _discoverySwapRoute( pairs, tokens, from, to, waypointCount );
        if( exploredswapRoutes.swap_route.length > 0 ) {
            if( exploredswapRoutes.swap_route[0].length > 1 ) {
                for( var i=0; i<exploredswapRoutes.swap_route[0].length-1; i++ ){
                    exploredRoute.push( exploredswapRoutes.swap_route[0][i][2].to.token );
                }
            }
        } else {
            //????????? ????????? ??????
            exploredRoute = undefined;
        }
        return exploredRoute;
    } catch( e ){
        throw Error( e.message );
    } finally {
        exploredswapRoutes  = undefined;
        exploredRoute       = undefined;
    }        
}

var _discoveryMiddleRoutes = function( pairs, tokens, from, to, waypointCount ) {
    try{
        var exploredRoutes = [];
        var exploredswapRoutes = _discoverySwapRoute( pairs, tokens, from, to, waypointCount );
        if( exploredswapRoutes.swap_route.length > 0 ) {
            for( var i=0; i<exploredswapRoutes.swap_route.length; i ++ ){
                var exploredRoute = [];
                if( exploredswapRoutes.swap_route[i].length > 1 ) {
                    for( var k=0; k<exploredswapRoutes.swap_route[i].length-1; k++ ){
                        exploredRoute.push( exploredswapRoutes.swap_route[i][k][2].to.token );
                    }
                }
                exploredRoutes.push( exploredRoute );
                exploredRoute = undefined;
            }
        } else {
            //????????? ????????? ??????
            exploredRoutes = undefined;
        }
        return exploredRoutes;
    } catch( e ){
        throw Error( e.message );
    } finally {
        exploredswapRoutes  = undefined;
        exploredRoutes      = undefined;
    }          
}

//set swap pool info
module.exports.LoadPairs                        = _loadPairs;
//set token info
module.exports.LoadTokens                       = _loadTokens;
//?????? ?????? ????????? swap pool ?????? ?????????
module.exports.DiscoveryRoutes                  = _discoverySwapRoute;
//?????? ?????? ????????? ?????? ????????? ?????? ?????????
module.exports.DiscoveryFirstMiddleiRoute       = _discoveryFirstMiddleRoute;
//?????? ?????? ?????? ?????????
module.exports.DiscoveryMiddleiRoutes           = _discoveryMiddleRoutes;
