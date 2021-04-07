<template>
  <div class="message_item">
    <div class="main-area flex">
      <div class="index text-body2 text-bold text-grey-8 rounded-borders" v-text="index"></div>
      <div class="message text-body text-grey-7 q-ml-md text-bold" @click="toggleStats" v-text="data.parsed"></div>
      <div class="hci_message text-body2 text-red-4 q-pa-sm rounded-borders bg-red-1">{{ data.type | titleCase }}</div>
    </div>
    <div class="stats flex q-mt-md" v-show="stats">
      <q-list dense style="min-width: 50%; max-width: 50%">
        <q-item-label header>Message Details </q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label>Parsed String</q-item-label>
            <q-item-label caption class="ellipsis"> {{ data.parsed }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Length</q-item-label>
            <q-item-label caption class="ellipsis"> {{ data.length }} Character</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Type</q-item-label>
            <q-item-label caption class="ellipsis"> {{ data.type | titleCase }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="data.data.payload">
          <q-item-section>
            <q-item-label>Payload</q-item-label>
            <q-item-label caption class="ellipsis">{{data.data.payload}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="data.data.crc16">
          <q-item-section>
            <q-item-label>CRC 16</q-item-label>
            <q-item-label caption class="ellipsis">0x{{data.data.crc16}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="data.data.rssi">
          <q-item-section>
            <q-item-label>RSSI Field</q-item-label>
            <q-item-label caption class="ellipsis">0x{{data.data.rssi}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="data.data.timestamp">
          <q-item-section>
            <q-item-label>Timestamp Field</q-item-label>
            <q-item-label caption class="ellipsis">0x{{data.data.timestamp}} , {{ data.data.timestamp | toBase10}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-mt-md">
          <q-item-section>
            <q-item-label>Endpoint ID</q-item-label>
            <q-item-label caption class="ellipsis">0b{{data.data.msgHeaders.endpointID.bit}} , {{ data.data.msgHeaders.endpointID.bit | base2To10 }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item >
          <q-item-section>
            <q-item-label>Message ID</q-item-label>
            <q-item-label caption class="ellipsis">0b{{data.data.msgHeaders.msgID.bit}} , {{ data.data.msgHeaders.msgID.bit | base2To10 }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list dense v-if="data.data.parsedPayload">
        <q-item-label header>Payload Data</q-item-label>

        <q-item>
          <q-item-section>
            <q-item-label>C Field</q-item-label>
            <q-item-label caption class="ellipsis">{{data.data.parsedPayload.c_field}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Decrypted Payload</q-item-label>
            <q-item-label caption class="ellipsis">{{data.data.parsedPayload.decryptedPayload}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Device Type</q-item-label>
            <q-item-label caption class="ellipsis">{{data.data.parsedPayload.device_type}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Identification</q-item-label>
            <q-item-label caption class="ellipsis">0x{{data.data.parsedPayload.identification}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Manufacturer Code</q-item-label>
            <q-item-label caption class="ellipsis">0x{{data.data.parsedPayload.manufacturer_code}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Version</q-item-label>
            <q-item-label caption class="ellipsis">{{data.data.parsedPayload.version}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list dense v-else>
        <q-item-label header>Payload Data</q-item-label>
        <q-item>
          <q-item-label>No Data</q-item-label>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { titleCase } from "title-case";
export default {
  name: "LogMessage",

  props:{
    value: {
      type: null,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    }
  },

  data () {
    return {
      data: {},
      stats: false
    };
  },

  methods: {
    toggleStats(){
      this.stats = ! this.stats;
    }

  },

  filters :{
    titleCase(val){
      let _val = val.replace("_", " ").toLowerCase();
      return titleCase(_val);
    },

    toBase10(val){
      return parseInt(val, 16);
    },

    base2To10(val){
      return parseInt(val, 2);
    }
  },

  created(){
    this.data = this.value;
  }
};
</script>

<style lang="scss">
.message_item{
    padding: .5rem 0;

    .main-area{
        align-items: center;
        .index{
            width: 2rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: relative;
            border-radius: 100%;
            background-color: $grey-4; 
            font-size: 1.2em;
            &::before{
                content: '';
                padding-top: 100%;
                width: 0;
                z-index: 10;
                background-color: rgba(red, .1);
                right: 0;
                top: 0;
            }
        }
        .message{
            // flex-grow: 1;
            max-width: 70%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:hover{
                cursor:pointer;
                color: $blue-8 !important;
            }
        }

        .hci_message{
            margin-left: auto;
            font-weight: bold;
        }
    }
}
.message_item + .message_item{
    border-top: 1px solid $grey-4;
}
</style>