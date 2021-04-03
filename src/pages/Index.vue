<template>
  <q-page class="">
    <div class="row">
        <connectDevice @prompt="reqSerialAccess" v-show="!connected"></connectDevice>
        <div v-show="connected">Connected</div>
    </div>

</q-page>
</template>

<script>
    import connectDevice from '../components/ConnectDevice'
    import DataParser from "../classes/parser";
    import DataCollector from "../classes/DataCollector";
    import utils from '../utilities/utilities';

    export default {
        name: 'PageIndex',
        components : {
            connectDevice
        },
        data:()=>({
            device : null,
            port : null,
            config : {},
            connected : false,
            reader: null,
            writer: null,
            command: '',
            dataList: [
            'fake DATA 01', 
            ]
        }),

        watch:{
            connected(newVal){
                if( newVal ){
                    console.log('redirecting');
                    this.$router.push({ name : 'working', params: { data : this.port } });
                }
            },
        },

        computed: {
            filters() {
                return [
                    // { usbVendorId: 0x10C4 }
                ]
            },
        },

        created(){
            console.warn("### Uint to HEX ###");

            let _uint8_array = new Uint8Array([165, 130, 3, 54]);
            let res = utils.Uint8ToHex(_uint8_array);
            let res2 = utils.Uint8ToHex(_uint8_array, false);
            console.log(res);
            console.log(res2);

            console.warn("### HEX to Actual Bits ###");

            console.log(utils.HexTo8Bit('a5'));
            console.log(utils.HexTo4Bit('b'));
            console.log(utils.HexToBits('15b3'));

            console.warn("### TEST DATA COLLECTOR ###");
            new DataCollector();
        },

        methods: {
            reqSerialAccess(config){
                navigator.serial.requestPort({ filters: this.filters})
                .then( async (response) =>{
                    this.port = response;
                    this.config = config

                    await this.connectDevice(config);
                })
            },

            async connectDevice(config){
                await this.port.open(config)

                this.connected = true;
            },

            async triggerSendData(){
                var str = this.command;
                var a = [];
                for (var i = 0, len = str.length; i < len; i+=2){
                    a.push(parseInt(str.substr(i,2),16));
                }
                const data = new Uint8Array(a);
                //const data = new Uint8Array(this.command); 
                //await this.sendData(data); // in this function loginc for sending data with reside;

                this.newSendData(data).then(()=> this.startReading() );
            },

            async sendData(data){
                console.log('## sending data ##')
                console.log("VALUE :", this.command);
                console.log("ENCODED VALUE :", data);

                // logics for sending data
                this.writer = await this.port.writable.getWriter();
                const encoder = new TextEncoder();
                //await this.writer.write(encoder.encode('HELLO'));
                //await this.writer.write(encoder.encode('#'));
                await this.writer.write(data.buffer);
                console.log('writen');
                this.writer.releaseLock();
            },

            async newSendData(data){
                return new Promise(async(resolve, reject)=>{
                    console.log('## sending data ##')
                    console.log("VALUE :", this.command);
                    console.log("ENCODED VALUE :", data);

                    // logics for sending data
                    this.writer = await this.port.writable.getWriter();
                    const encoder = new TextEncoder();
                    await this.writer.write(data.buffer);
                    console.log('writen');
                    this.writer.releaseLock();
                    resolve();
                })
            },

            async startReading() {
                if( this.port.readable.locked) return;

                const reader = this.port.readable.getReader();
                let dataReader = new DataCollector();
                await this.simulateDelay(200);

                try{
                    while (true) {
                        console.log('## before read ##');
                        const { value, done } = await reader.read();
                        if (done) {
                            alert('done');
                            // Allow the serial port to be closed later.
                            reader.releaseLock();
                            break;
                        }
        				const data = utils.Uint8ToHex(value, false); // parsing to hex first
                        dataReader.append(data);
                    }

                }catch(e){
                    console.log(e);
                }
            },

            addDataToConsole(data){
                this.dataList.push(data);
            },
        }
    }
</script>
