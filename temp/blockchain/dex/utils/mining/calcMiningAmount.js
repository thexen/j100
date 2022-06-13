/*




*/
function _calcMiningAmount( startYears, _invokedLastTime, blockTime ) {

  var year              = 86400 * 365;
  var amountPerSec      = 500000; //0.500000 ether
  let current           = blockTime;
  let thisYear          = Math.floor(current / year) * year;
  let pastYears         = Math.floor( ( current - _invokedLastTime ) / year );

  let miningAmount      = 0;
  if( pastYears > 0 ) {
    for( var i=0; i<=pastYears; i++ ) {
      var currentYear     = Math.floor( ( _invokedLastTime + ( year * i ) ) / year ) * year;
      var nextYear        = Math.floor( ( _invokedLastTime + ( year * ( i + 1 ) ) ) / year ) * year;
      var halfLife        = Math.floor( ( currentYear - startYears ) / ( year * 2 ) );      
      if( i == 0 ) {
        miningAmount      += (nextYear - _invokedLastTime) * ( amountPerSec / 2 ** halfLife );
      } else if( currentYear == thisYear ) {
        miningAmount      += (current - thisYear) * ( amountPerSec / 2 ** halfLife );
      } else {
        miningAmount      += (nextYear - currentYear) * ( amountPerSec / 2 ** halfLife );
      }
    }
  } else {
    var halfLife    = Math.floor( ( _invokedLastTime  - startYears ) / (2 * year) );
    miningAmount    = ( current - _invokedLastTime ) * ( amountPerSec / 2 ** halfLife );
  }  

  return miningAmount;
}

//_calcMiningAmount( 1655096040, 1655096064, 1655096134 );
module.exports.CalcMiningAmount           = _calcMiningAmount;