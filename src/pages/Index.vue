<template>
  <q-page class="">
    <div class="flex flex-center q-py-lg">
        <q-btn label="Connect Serial Device TWN4" @click="reqSerialAccess"></q-btn>
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
    baudRate: 115200,
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
            { usbVendorId: 0x09D8 }
        ]
    }
  },

  created(){
    let HexString = "A5010100";
    let slicedHex = this.sliceString(HexString);
    let _Uint8Array = this.HexToUint8(slicedHex);
    console.log(slicedHex);
    console.log(_Uint8Array);
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
            parity: "even",
            flowControl: "none"
        })

    },

    async triggerSendData(){
		/*
        var str = this.command;
		var a = [];
		for (var i = 0, len = str.length; i < len; i+=2) {
			a.push(parseInt(str.substr(i,2),16));
		}
		const data = new Uint8Array(a);
		*/
        //const data = new Uint8Array(this.command); 
        await this.sendData(this.command+"\r"); // in this function loginc for sending data with reside;
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
        await this.writer.write(encoder.encode(data));
		console.log('writen');
        this.writer.releaseLock();
    },

    async testDelay(){
        console.log('testing 1');
        await this.simulateDelay(5000);
        console.log('testing 2'); // this will trigger 5000 miliseconds later # don't forget 'await'&'async'
    },

    async simulateDelay(delay){
        return new Promise( (resolve, reject) => {
            setTimeout(()=> resolve(), delay);
        })
    },

    sliceString(_str, len){
        if(_str.length % 2 == 1 ){
            _str = '0' + _str;
        }
        _str = _str.toUpperCase();
        let sliced = _str.match(/(\w){2}/g)
        return sliced.map((item)=>parseInt(item, 16));
    },

    isValidHex(term){
        return term.match(/^#[a-f0-9]{2}$/i) !== null;
    },

    HexToUint8(_arr){
        return new Uint8Array(_arr);
    },

    async startReading() {
			// logics for reading data         
			const textDecoder = new TextDecoderStream();
			const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
			const reader = textDecoder.readable.getReader();
			//const reader = this.port.readable.getReader();

			// Listen to data coming from the serial device.
			/*
			while (true) {
				try {
					console.log('## before read ##');
					const { value, done } = await reader.read();
					console.log(value.length);
					if (done) {
						// Allow the serial port to be closed later.
						reader.releaseLock();
						break;
					}
					// value is a string.
					console.log("RESPONSE:", value);
				} catch (error) {
					console.log("Error appeared");
				} finally {

				}
			}
			*/
			
			let charsReceived = 0;
			let result = '';
			// read() returns a promise that resolves
			  // when a value has been received
			let value = reader.read().then(function processText({ done, value }) {
				// Result objects contain two properties:
				// done  - true if the stream has already given you all its data.
				// value - some data. Always undefined when done is true.
				if (done) {
				  console.log("Stream complete");
				  para.textContent = result;
				  return;
				}

				charsReceived += value.length;
				const chunk = value;
				console.log('Read ' + charsReceived + ' characters so far. Current chunk = ' + chunk);

				result += chunk;

				// Read some more, and call this function again
				return reader.read().then(processText);
			  });
			  console.log(result);

        // with this peace you can send data to be shown in list below input 
        //let dataToBeShown = "PLACEHOLDER DATA";
        //this.addDataToConsole(dataToBeShown);
    },
	
	/*
	navigator.serial.addEventListener("connect", (event) => {
		// TODO: Automatically open event.target or warn user a port is available.
		console.log("connected");
	});

	navigator.serial.addEventListener("disconnect", (event) => {
		// TODO: Remove |event.target| from the UI.
		// If the serial port was opened, a stream error would be observed as well.
		console.log("disconnected");
	});
	*/

    addDataToConsole(data){
        this.dataList.push(data);
    }


  }
}
</script>
