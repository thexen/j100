const {UpsertToMongo, QueryFromMongo} = require('./call.js');

/*
    1. swap pool 생성
    2. swap pool manager 의 inqueryPoolSize()를 호출 하여 갯수를 구한다
    3. mongodb의 swap pool 갯수를 구한다
    4. 2에서 구한 갯수와 3의 갯수 차이를 계산하면 방금 생성한 swap pool의 index를 구할 수 있다
*/

async function insertSwapPool( _id ) {
    let swapPool = {
        tokens: {
            first: {
                contract: '',
                symbol: '',
                icon: '',
            },
            second: {
                conract: '',
                symbol: '',
                icon: '',
            }
        },
        contracts: { 
            sp: '',
            holder: '',
            lpt: '',
        }
    }

    let token = {
        contract: '',
        symbol: '',
        icon: '',
        grade: '',
    }

    await UpsertToMongo( "tests", 2, {key: "value2"} );
    //var res = await QueryFromMongo( "tests", {count:{}} );
    var res = await QueryFromMongo( "tests", {find:{}} );
    console.log(res);
}

insertSwapPool();