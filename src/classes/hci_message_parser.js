import {BaseParser} from './base_parser';
import utils from '../utilities/utilities';
const CRC = require('crc-full').CRC;

export class HciMessageParser extends BaseParser{
    constructor(data){
        super();
        this.crc = CRC.default('CRC16_X_25');
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
                this.checkDataValidity();

                this.addPayload();
                this.checkCRC16();
                this.checkRSSI();
                this.checkTimestamp();

                this.successfull();
            }
            catch(e){
                console.log(e);
                return this.errorResponse();
            }
            finally{
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
        const crc16_start_index = this.calcCRC16StartingIndex();

        return this.text.slice(controlField_index, crc16_start_index);
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

    checkDataValidity(){
        const SOF_length = 2 // byte
        const controlFields_length = 6 // byte

        const payload_length = this.getPayload().length;

        const optionalFields_length = this.calcOptionalFieldsLength();

        const total = SOF_length + controlFields_length + payload_length + optionalFields_length;

        console.log("Total: ", total);
        console.log("Text : ", this.text.length);

        if( total > this.text.length ){
            return throw new Error('Data Corruption!')
        }

        return true;
    }

    getPayload(){
        let payloadLength = this.getMsgHeaders('payloadLength');
        return this.text.substr(this.payloadStartIndex(), payloadLength );
    }

    addPayload(){
        const payload = this.getPayload();

        this.parsedObj.payload = payload;

        return
    }

    payloadStartIndex(){
        let payloadStartIndex = this.SOF_index() + 2  + 6; // 2 for passing SOF and 6 for passing MsgHeader
        return payloadStartIndex;
    }

    payloadEndIndex(){
        return this.payloadStartIndex() + this.getMsgHeaders('payloadLength');
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

    getControlField(field = null){
        const controlField = this.getMsgHeaders('controlField');
        const dataField = controlField.data

        if( field && dataField.hasOwnProperty(field) ){
            return controlField.data[field];
        }

        return controlField.data;
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

    crc16IsEnabled(){
        return this.getControlField('crc16_field');
    }

    RSSIIsEnabled(){
        return this.getControlField('rssi_field');
    }

    TimeStampIsEnabled(){
        return this.getControlField('timestamp');
    }

    calcCRC16StartingIndex(){
        let crc16IndexPadding = 0

        if( this.getControlField('timestamp')) crc16IndexPadding+=8;
        if( this.getControlField('rssi_field')) crc16IndexPadding+=2;

        console.log('CRC 16 Starting Padding: ', crc16IndexPadding);
        console.log('CRC 16 Starting Index: ', (this.payloadEndIndex() + crc16IndexPadding) );

        return this.payloadEndIndex() + crc16IndexPadding ;
    }

    calcRSSIStartingIndex(){
        let rssiIndexPadding = 0

        if( this.getControlField('timestamp')) rssiIndexPadding  +=8;

        console.log('RSSI Starting Padding: ', rssiIndexPadding );
        console.log('RSSI Starting Index: ', (this.payloadEndIndex() + rssiIndexPadding ) );
        return this.payloadEndIndex() + rssiIndexPadding  ;
    }

    calcOptionalFieldsLength(){
        const crc16_length = this.crc16IsEnabled() ? 4 : 0;
        const rssi_length = this.RSSIIsEnabled() ? 2 : 0;
        const timestamp_length = this.TimeStampIsEnabled() ? 8 : 0;

        return crc16_length + rssi_length + timestamp_length ;
    }

    checkCRC16(){
        if( this.crc16IsEnabled() ){
            const crc16_start_index = this.calcCRC16StartingIndex();
            const crc16 = this.text.slice(crc16_start_index);
            this.parsedObj['crc16'] = crc16;
            const crc16_string_uint8 = utils.HexStringToUint8(this.crc16_string());

            const calced_crc16 = this.crc.compute(crc16_string_uint8)
                                            .toString(16)
                                            .toUpperCase();
                                            
            if( crc16 !== this.reverseCRC( calced_crc16 ) ){
                return throw new Error('CRC NOT MATCHED');
            }
        }
    }

    checkRSSI(){
        if(this.RSSIIsEnabled() ){
            const rssi_start_index = this.calcRSSIStartingIndex();
            const rssi = this.text.substr(rssi_start_index, 2);
            this.parsedObj['rssi'] = rssi;
        }
    }

    checkTimestamp(){
        if(this.TimeStampIsEnabled() ){
            const timestamp_start_index= this.payloadEndIndex();
            const timestamp = this.text.substr(timestamp_start_index, 8);
            this.parsedObj['timestamp'] = timestamp;
        }
    }

    reverseCRC(text){
        return text.match(/.{2}/gi).reverse().join('')
    }
}
