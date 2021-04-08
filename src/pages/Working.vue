<template>
    <q-page padding>
        <div class="success flex justify-center align-center" v-show="initialized">
            <div class="q-pa-md" style="max-width: 50vw; min-width: 50vw">
                <div v-show="!!device">
                    <p class="text-h6 q-mb-sm text-bold">Device Info :</p>
                    <div class="flex q-pl-md">
                        <div class="col text-body2">Product ID :</div>
                        <div class="col text-bold text-body">{{ deviceInfo.productId }} </div>
                    </div>
                    <div class="flex q-pl-md">
                        <div class="col text-body2">Vendor ID :</div>
                        <div class="col text-bold text-body">{{ deviceInfo.vendorId}} </div>
                    </div>
                    
                    <q-separator spaced="xl"></q-separator>
                </div>
                <div>
                    <label for="sendData" class="text-bold text-grey-7 text-uppercase">Send Command :</label>
                    <div class="flex ">
                        <q-input v-model="command" outlined size="md" style="flex-grow: 1"></q-input>
                        <q-btn label="Send" size="md" @click="triggerSendData"  unelevated class="q-ml-sm" color="blue-8"></q-btn>
                    </div>
                </div>
                <q-separator spaced="xl"></q-separator>
                <div class="log-section">
                    <p class="text-body text-bold text-grey-6 q-pa-none q-ma-none q-mb-sm">Logs</p>
                    <div id="logs-area" :class="{ 'no-data' : !messagesCount }">
                        <template inline v-for="(item, ind) in messages" >
                            <LogMessage :value="item" :key="`${ind}.${item.parsed}`" :index="messages.length - ind"></LogMessage>
                        </template>
                       
                       <p v-if="!messagesCount" class="text-body text-grey-8 ">No data has been received yet.</p> 
                    </div>
                </div>
                
            </div>
        </div>

        <div class="error" v-show="!initialized">
            <div class="text-h4 q-mt-xl text-center text-red-7">Something Went Wrong. Redirecting back ...</div>
        </div>
    </q-page>    
</template>

<script>
    import DataCollector from '../classes/DataCollector';
    import utils from '../utilities/utilities';
    import LogMessage from '../components/LogMessage'

    export default {
        name: 'Working',

        components: {
            LogMessage,
        },

        data(){
            return {
                device : null,
                command: '',
                reader : null,
                initialized : false,
                receivedMessages: [],
            }
        },

        beforeMount(){
            if( this.$route.params.data ){
                this.initialized = true;
                this.device = this.$route.params.data;
                console.log(this.device);
            }
            else{
                setTimeout(this.redirectBack, 3000);
            }
        },

        watch:{
            _device(val){
                this.device = this._device;
                this.initialized = !! this._device;
            }
        },

        filters :{
            titleCase(val){
                let _val = val.replace('_', ' ').toLowerCase();
                return titleCase(_val);
            }
        },

        created(){
            let dataReader = new DataCollector(this.Logger);
            dataReader.append('A5E2031944E61EBF0743097911B2312D52167B9D058EA5B76FD7EE582B60682440123187');
            dataReader.append('A58102004CA3');
            dataReader.append('0011ffA5810617FF000400B32555101000010001FF0702320000000000004925');
            dataReader.append('A582033644E61E56190001020E7268230123E61E3C0349302065C69A586A02308C62890E');
        },

        methods: {
            redirectBack(){
                this.$router.push({ name: 'index', params: {withErrors : true } });
            },

            sendCommand(){

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
                this.writer = await this.device.writable.getWriter();
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
                    this.writer = await this.device.writable.getWriter();
                    const encoder = new TextEncoder();
                    await this.writer.write(data.buffer);
                    console.log('writen');
                    this.writer.releaseLock();
                    resolve();
                })
            },

            async Logger(data, count){
                if( data.data.payload ){
                    const {data: parsedPayload }= await this.decryptPayloadData(data.data.payload);

                    data.data.parsedPayload = parsedPayload;
                }

                await this.receivedMessages.push(data);
                console.log(data, count);
            },

            decryptPayloadData(payload){
                let data = JSON.stringify({'rawPayload': payload});
                console.log('stryingified 2');

                return this.$api.post('', data)
            },

            async startReading() {
                if( this.device.readable.locked) return;

                const reader = this.device.readable.getReader();
                let dataReader = new DataCollector(this.Logger);

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
        },

        async beforeRouteLeave(to, from, next){
            return next();
        },

        computed:{
            messages(){
                return this.receivedMessages.reverse();
            },

            messagesCount(){
                return this.receivedMessages.length;
            },

            _device(){
                if( this.$route.params.data ){
                    return this.$route.params.data;
                }
                return null;
            },

            deviceInfo(){
                if( !this.device ) return null;

                let {usbProductId, usbVendorId} = this.device.getInfo()
                return { 
                    productId: usbProductId, 
                    vendorId : usbVendorId
                }
            }
        }
    }
</script>

<style lang="scss">
    #logs-area{
        background-color: whitesmoke;
        padding: 1rem;
        border: 1px solid $grey-4;
        min-height: 10rem;

        &.no-data{
            display: flex;
            justify-content: center;
            align-items: center;
        }

    }
</style>
