<template>
    <q-page padding>
        <div class="success flex justify-center align-center" v-show="initialized">
            <div class="q-pa-md" style="max-width: 50vw; min-width: 50vw">
                <div v-show="!!device">
                    <p class="text-h6 q-mb-sm text-bold">Device Info :</p>
                    <div class="flex q-pl-md">
                        <div class="col text-body2">Product Id</div>
                        <div class="col text-bold text-body">{{ deviceInfo.productId }} </div>
                    </div>
                    <div class="flex q-pl-md">
                        <div class="col text-body2">Vendor Id</div>
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
                    LOGGER
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

    export default {
        name: 'Working',

        data(){
            return {
                device : null,
                command: '',
                initialized : false,
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

            async startReading() {
                if( this.device.readable.locked) return;

                const reader = this.device.readable.getReader();
                let dataReader = new DataCollector();

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

        computed:{
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
