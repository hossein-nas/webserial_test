<template>
  <q-page class="">
    <div class="flex flex-center q-py-lg">
        <q-btn label="Connect Serial Device" @click="reqSerialAccess"></q-btn>
    </div>
    <div class="row">
        <div class="col-6 q-mx-auto">
            <div class="q-mx-auto flex">
                <q-input v-model.trim="command" label="Write :" class="col-grow"></q-input>
                <q-btn label="Send Data" class="q-ml-sm q-px-sm" outline :ripple="false" @click="triggerSendData" dense></q-btn>
                <q-btn label="Start Reading" class="q-ml-sm q-px-sm" outline :ripple="false" @click="startReading" dense></q-btn>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-6 q-mx-auto">
            <q-list bordered separator>
              <q-item clickable v-ripple v-for="(data, ind) in dataList" :key="ind">
                <q-item-section>{{data}}</q-item-section>
              </q-item>
            </q-list>
        </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',

  data:()=>({
    device : null,
    port : null,
    baudRate: 57600,
    connected : false,
    reader: null,
    writer: null,
    command: '',
    dataList: [
        'fake DATA 01', 
    ]
  }),

  computed: {
    filters() {
        return [
            { usbVendorId: 0x10C4 }
        ]
    }
  },

  methods: {
    reqSerialAccess(){
        navigator.serial.requestPort({ filters: this.filters})
            .then( async (response) =>{
                this.port = response;

                await this.connectDevice();
				await this.startReading();
			})

    },

    async connectDevice(){
        await this.port.open({
            baudRate: this.baudRate,
            dataBits : 8,
            stopBits: 1,
            parity: "none",
            flowControl: "none"
        })

    },

    async triggerSendData(){
        var str = this.command;
		var a = [];
		for (var i = 0, len = str.length; i < len; i+=2) {
			a.push(parseInt(str.substr(i,2),16));
		}
		const data = new Uint8Array(a);
        //const data = new Uint8Array(this.command); 
        await this.sendData(data); // in this function loginc for sending data with reside;
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

    async startReading() {
        // logics for reading data         
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        // Listen to data coming from the serial device.
        while (true) {
			console.log('## before read ##');
			const { value, done } = await reader.read();
			if (done) {
				// Allow the serial port to be closed later.
				reader.releaseLock();
				break;
			}
			// value is a string.
			console.log(value);
			var result = '';
			for (var i=0; i<value.length; i++) {
				var temp = "00"+value.charCodeAt(i).toString(16);
				result += temp.substr(temp.length-2)
			}
			console.log(result);
        }

        // with this peace you can send data to be shown in list below input 
        //let dataToBeShown = "PLACEHOLDER DATA";
        //this.addDataToConsole(dataToBeShown);
    },

    addDataToConsole(data){
        this.dataList.push(data);
    }


  }
}
</script>
