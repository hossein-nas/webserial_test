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

export default {
    isValidHex,
    HexToUint8,
    HexStringToUint8,
    HexTo8Bit,
    HexTo4Bit,
    HexToBits,
    Uint8ToHex
}