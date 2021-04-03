function isValidHex(term){
    return term.match(/^#[a-f0-9]{2}$/i) !== null;
}

function HexToUint8(_arr){
    return new Uint8Array(_arr);
}

function HexStringToUint8(hex_string){
    const pairs = hex_string.match(/[\dA-F]{2}/gi);
    
    // convert the octets to integers
    const integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    
    const array = new Uint8Array(integers);
    
    return array;
}

function HexTo8Bit(hex){
    if(typeof hex == 'string'){
        return parseInt(hex, 16).toString(2).padStart(8, '0');
    }
    return null;
}

function HexToBits(hex){
    if(typeof hex == 'string'){
        let hex_length = hex.length
        let bit_length = hex_length * 4
        return parseInt(hex, 16).toString(2).padStart(bit_length, '0');
    }
    return null;
}

function HexTo4Bit(hex){
    if(typeof hex == 'string'){
        return parseInt(hex, 16).toString(2).padStart(4, '0');
    }
    return null;
}

function Uint8ToHex(_unit_array, res_array = true){
    let hex_array = [];
    _unit_array.forEach(item=> hex_array.push( 
        item.toString(16).padStart(2, '0').toUpperCase()
        ));

    if(res_array){
        return hex_array;
    }
    else
        return hex_array.join('');
}


async function testDelay(){
    // let getFakeData = new FromAsyncResource();
    // getFakeData.trigger().then( response => {
    //     /* Proccessing received data */
    // });

    // // here I will put some delay to give time to FromAsyncResource get ready
    // setTimeout(()=>{
    //     // doing action after a short delay
    //     // this is inside of a closure
    //     // this is not in the main flow of execution
    // }, 200 /* delay */);


    // // *****************
    // // *****************


    // let getFakeData = new FromAsyncResource();
    // let receivedData = await getFakeData.trigger()
    // // do some processing on receivedData

    // await this.simulateDelay(200);

    // // doing action after a short delay
    // // this is inside of main flow of execution
}

async function simulateDelay(delay){
    return new Promise( (resolve, reject) => {
        setTimeout(()=> resolve(), delay);
    })
}

export default {
    isValidHex,
    HexToUint8,
    HexStringToUint8,
    HexTo8Bit,
    HexTo4Bit,
    HexToBits,
    simulateDelay,
    Uint8ToHex
}
