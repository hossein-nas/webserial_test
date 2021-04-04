<template>
    <div class="message_item">
        <div class="main-area flex">
            <div class="index text-body2 text-bold text-grey-8 q-pa-sm rounded-borders" v-text="index"></div>
            <div class="message text-body text-grey-7 q-ml-md text-bold" @click="toggleStats" v-text="data.parsed"></div>
            <div class="hci_message text-body2 text-red-4 q-pa-sm rounded-borders bg-red-1" >{{ data.type | titleCase }}</div>
        </div>
        <div class="stats flex q-mt-md" v-show="stats">
            <q-list dense>
                <q-item>
                    <q-item-section>
                        <q-item-label>Parsed String</q-item-label>
                        <q-item-label caption> {{ data.parsed }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-item-label>Length</q-item-label>
                        <q-item-label caption> {{ data.length }} Character</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-item-label>Type</q-item-label>
                        <q-item-label caption> {{ data.type | titleCase }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-item-label>Payload</q-item-label>
                        <q-item-label caption>{{data.data.payload}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item v-if="data.data.crc16">
                    <q-item-section>
                        <q-item-label>CRC 16</q-item-label>
                        <q-item-label caption>0x{{data.data.crc16}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item v-if="data.data.rssi">
                    <q-item-section>
                        <q-item-label>RSSI Field</q-item-label>
                        <q-item-label caption>0x{{data.data.rssi}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item v-if="data.data.timestamp">
                    <q-item-section>
                        <q-item-label>Timestamp Field</q-item-label>
                        <q-item-label caption>0x{{data.data.timestamp}} , {{ data.data.timestamp | toBase10}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="q-mt-md">
                    <q-item-section>
                        <q-item-label>Endpoint ID</q-item-label>
                        <q-item-label caption>0b{{data.data.msgHeaders.endpointID.bit}} , {{ data.data.msgHeaders.endpointID.bit | base2To10 }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item >
                    <q-item-section>
                        <q-item-label>Message ID</q-item-label>
                        <q-item-label caption>0b{{data.data.msgHeaders.msgID.bit}} , {{ data.data.msgHeaders.msgID.bit | base2To10 }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-list></q-list>
        </div>
    </div>
</template>

<script>
    import { titleCase } from 'title-case';
    export default {
        name: 'LogMessage',

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
            }
        },

        methods: {
            toggleStats(){
                this.stats = ! this.stats;
            }

        },

        filters :{
            titleCase(val){
                let _val = val.replace('_', ' ').toLowerCase();
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
    }
</script>

<style lang="scss">
.message_item{
    padding: .5rem 0;

    .main-area{
        align-items: center;
        .index{
            border-radius: 100%;
            background-color: $grey-4;
        }
        .message{
            flex-grow: 1;
            &:hover{
                cursor:pointer;
                color: $blue-8 !important;
            }
        }

        .hci_message{
            margin-left: 1rem;
            font-weight: bold;

        }
    }
}
.message_item + .message_item{
    border-top: 1px solid $grey-4;
}
</style>