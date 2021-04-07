<template>
  <div class="col-6 q-mx-auto q-pa-lg q-pt-xl">
    <div class="row">
      <div class="col-12 justify-center flex">
        <q-btn label="Connect Device" @click="promptDevice" padding="md" color="cyan-9" icon="settings_remote" outline></q-btn>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-12 q-mx-auto">
            <div class="header flex justify-center q-pa-sm">
              <q-btn label="Show Config" size="6px" no-caps padding="sm" flat unelevated color="blue-8" @click.prevent="toggleConfig"></q-btn>
            </div>
            <div class="form-body q-mt-lg" v-show="show">
              <q-form class="">
                <div class="row q-col-gutter-lg">
                  <div class="col-6">
                    <div class="q-mb-md">
                      <label for="baudRate" class="text-bold q-mb-xs block text-uppercase text-grey-9 text-body2">Baud Rate:</label>
                      <q-select filled option-cover dense v-model="serialConfig.baudRate" :options="deviceDefaultOptions.baudRate">
                      </q-select>
                    </div>
                    <div class="q-mb-md">
                      <label for="dataBits" class="text-bold q-mb-xs block text-uppercase text-grey-9 text-body2">Data Bits :</label>
                      <q-select filled option-cover dense v-model="serialConfig.dataBits" :options="deviceDefaultOptions.dataBits" >
                      </q-select>
                    </div>
                    <div class="">
                      <label for="stopBits" class="text-bold q-mb-xs block text-uppercase text-grey-9 text-body2">Stop Bits :</label>
                      <q-select filled option-cover dense v-model="serialConfig.stopBits" :options="deviceDefaultOptions.stopBits" >
                      </q-select>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="q-mb-md">
                      <label for="parity" class="text-bold q-mb-xs block text-uppercase text-grey-9 text-body2">Parity :</label>
                      <q-option-group v-model="serialConfig.parity" :options="deviceDefaultOptions.parity" inline></q-option-group>
                    </div>
                    <div class="q-mb-md">
                      <label for="flowControl" class="text-bold q-mb-xs block text-uppercase text-grey-9 text-body2">Flow Control:</label>
                      <q-option-group v-model="serialConfig.flowControl" :options="deviceDefaultOptions.flowControl" inline></q-option-group>
                    </div>
                    <div class="">
                      <label for="bufferSize" class="text-bold q-mb-xs block text-uppercase text-grey-9 text-body2">Buffer Size : {{ serialConfig.bufferSize }}</label>
                      <q-slider
                        v-model="serialConfig.bufferSize"
                        :min="15"
                        :max="16317"
                        :step="64"
                        markers
                        label
                        snap
                        color="blue"
                      />
                    </div>
                  </div>

                  <div class="col-12">
                    <q-btn label="Reset Config" size="sm" dense color="brown-6" padding="sm" @click="initConfig()"></q-btn>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
export default {
  name: "connectDevice",
  data () {
    return {
      serialConfig : {},
      show: false,
    };
  },

  methods:{
    promptDevice(){
      this.$emit("prompt", this.serialConfig);
    },

    initConfig(){
      this.serialConfig = {
        ...this.serialConfigDefault
      };
    },

    toggleConfig(){
      this.show = ! this.show;
    }
  },

  beforeMount(){
    this.initConfig();
  },

  computed:{
    serialConfigDefault(){
      return {
        baudRate : 9600,
        dataBits : 8,
        stopBits : 1,
        parity : "none",
        flowControl: "none",
        bufferSize: 255
      }; 
    },

    deviceDefaultOptions(){
      return {
        baudRate: [
          2400,
          4800,
          9600,
          19200,
          38400,
          57600,
          115200
        ],
        parity: [
          { label : "None", value: "none" },
          { label : "Odd", value: "odd" },
          { label : "Even", value: "Even" },
        ],
        dataBits : [ 7, 8 ],
        stopBits : [ 1, 2],
        flowControl : [
          { label : "None", value: "none" },
          { label : "Hardware", value: "hardware" },
        ],
      };
    }
  }
};
</script>
