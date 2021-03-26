import {BaseParser} from './base_parser';
import utils from '../utilities/utilities';
import crc from 'crc';

export class HciMessageParser extends BaseParser{
    constructor(data){
        super();
        this.text = '';
        this.parsedText = null;
        this.parsedObj = {
            msgHeaders:{},
            payload: null
        },
        this.was_successfull = false;

        return this;
    }

    addData(data){
        this.text = data;

        return this;
    }

    parse(){
        if( this.text && this.text.length < 8 ){
            return this.errorResponse();
        }

        if( this.has_SOF() ){
            try{
                this.addSOFIndex( this.SOF_index() );
                this.extractMsgHeaders();

                this.addPayload();
                this.checkCRC16();
            }
            catch(e){
                console.log(e);
            }
            finally{
                this.successfull();
            }
        }

    }

    hasParsed(){
        return this.was_successfull;

    }

    flush(){
        console.log('flushed');

        this.text = '';
        this.parsedText = null;
        this.parsedObj = {
            msgHeaders:{},
            payload: null
        },
        this.was_successfull = false;
    }

    getParsedData(){
        if(this.was_successfull){
            return this.responseObject();
        }
        return this.errorResponse();
    }

    errorResponse(){
        return {
            data: null,
            status: 'error',
            type: this.format()
        }
    }

    successfull(){
        this.was_successfull = true;
    }

    responseObject(){
        return {
            status: this.was_successfull? 'successfull': 'error',
            parsed: this.parsedText,
            length: this.parsedText.length,
            type:this.format(),
            data: this.parsedObj,
        }
    }

    format(){
        return "HCI_MESSAGE";
    }

    SOFTerm(){
        return "a5";
    }

    has_SOF(){
        let indexOf = this.text.toLowerCase().indexOf( this.SOFTerm() );

        return indexOf !== -1;
    }

    SOF_index(){
        let indexOf = this.text.toLowerCase().indexOf( this.SOFTerm() );
        if( indexOf !== -1){
            return indexOf;
        }

        return false;
    }

    controlField_index(){
        return this.SOF_index() + 2;
    }

    crc16_string(){
        const controlField_index = this.controlField_index();
        const controlField_length = 3 * 2;
        const payloadLength = this.getMsgHeaders('payloadLength');

        return this.text.substr(controlField_index,  controlField_length + payloadLength);
    }

    addSOFIndex(index){
        this.parsedText = this.text.substr(index);

        this.parsedObj.sof_index = index;
    }

    addMsgHeaders(key, value){
        this.parsedObj.msgHeaders[key] = value;
    }

    getMsgHeaders(key){
        return this.parsedObj.msgHeaders[key];
    }

    extractMsgHeaders(){
        let controlField_index = this.controlField_index();
        let controlField_length = 3 * 2;
        let header = this.text.slice(controlField_index, controlField_index+ controlField_length);
        let header_bits = utils.HexToBits(header);

        this.controlField(header_bits.substr(0,4));      // for bits 0 -> 3
        this.endpointID(header_bits.substr(4,4))         // for bits 4 -> 7
        this.msgIDField(header_bits.substr(8,8))        // for bits 8 -> 15 
        this.lengthField(header_bits.substr(16,8))         // for bits 16 -> end
    }

    addPayload(){
        let payloadLength = this.getMsgHeaders('payloadLength');
        let payload = this.text.substr(this.payloadStartIndex(), payloadLength );

        this.parsedObj.payload = payload;

        return
    }

    payloadStartIndex(){
        let payloadStartIndex = this.SOF_index() + 2  + 6; // 2 for passing SOF and 6 for passing MsgHeader
        return payloadStartIndex;
    }

    controlField(bits){
        let timestamp = bits.charAt('2') == "1" ? true: false;
        let rssi_field = bits.charAt('1') == "1" ? true: false;
        let crc16_field = bits.charAt('0') == "1" ? true: false;

        this.addMsgHeaders('controlField', {
            bit : bits,
            data: {
                timestamp ,
                rssi_field,
                crc16_field
            }
        })
    }

    endpointID(bits){
        this.addMsgHeaders('endpointID', {
            bit : bits,
            value: parseInt(bits, 10)
        })
    }

    msgIDField(bits){
        this.addMsgHeaders('msgID', {
            bit : bits,
            value: parseInt(bits, 10)
        })
    }

    lengthField(bits){
        let payloadLength = parseInt(bits, 2) * 2; // multpying 2 because of every hex char equals to 4bit not 8 bits!!
        this.addMsgHeaders('payloadLength', payloadLength);
    }

    checkCRC16(){
        const controlField = this.getMsgHeaders('controlField');


        if( controlField.data.crc16_field ){

            const crc16_start_index = this.payloadStartIndex() + this.getMsgHeaders('payloadLength');
            const crc16 = this.text.slice(crc16_start_index);
            this.parsedObj['crc16'] = crc16;
            console.log(this.crc16_string());
            console.log( crc.crc16xmodem(this.crc16_string()).toString(16))
            console.log('after');
        }
    }
}
