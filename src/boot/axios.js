// import something here

import Vue from 'vue'
import axios from 'axios'
import https from 'https'

Vue.prototype.$axios = axios
// ^ ^ ^ this will allow you to use this.$axios
//       so you won't necessarily have to import axios in each vue file

const api = axios.create({ 
    baseURL: `${process.env.API}/api/v1/payloads`,
    headers : {
        "Content-Type" : "application/json",
    },
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    })
})
Vue.prototype.$api = api
// ^ ^ ^ this will allow you to use this.$api
//       so you can easily perform requests against your app's API

export { axios, api }

