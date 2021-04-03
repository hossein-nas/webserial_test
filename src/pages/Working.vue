<template>
    <q-page padding>
        <div class="success flex justify-center align-center" v-show="initialized">
            <div class="q-pa-md" style="max-width: 50vw; min-width: 50vw">
                <div>
                    <label for="sendData" class="text-bold text-grey-7 text-uppercase">Send Command :</label>
                    <div class="flex ">
                        <q-input v-model="command" @click="sendCommand" outlined size="md" style="flex-grow: 1"></q-input>
                        <q-btn label="Send" size="md" unelevated class="q-ml-sm" color="blue-8"></q-btn>
                    </div>
                </div>
                <q-separator spaced="md"></q-separator>
                
            </div>
        </div>

        <div class="error" v-show="!initialized">
            <div class="text-h4 q-mt-xl text-center text-red-7">Something Went Wrong. Redirecting back ...</div>
        </div>
    </q-page>
</template>

<script>
    export default {
        name: 'Working',

        data(){
            return {
                device : null,
                command: '',
                initialized : false,
            }
        },

        created(){
            if( this.$route.params.data ){
                this.initialized = true;
                this.device = this.$route.params.data;
                console.log(this.device);
            }
            else{
                setTimeout(this.redirectBack, 3000);
            }
        },

        methods: {
            redirectBack(){
                this.$router.push({ name: 'index', params: {withErrors : true } });
            },

            sendCommand(){

            }
        }
    }
</script>
