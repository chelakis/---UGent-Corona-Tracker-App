<template>
  <div class="main-div">
    <p>
        Protect yourself and the others around you using CoronaTracker app.
        Join the CoronaTracker app just by clicking on the button below.
    </p> 
    <div class="holder">
        <button class="btn btn-primary" type="submit" v-on:click="login()">Login</button>
    </div>
  </div>
</template>

<script>

// import router from ".router/router.js"

// export default {
//     // methods: {
//     //     redirect: function () {import Vue from 'vue'

//     //         this.router.push({ name: 'App' });   
//     //     }
//     // }
//     methods: { login () {
//         // this.$router.replace({ name: 'Texts' });
//                     alert("hey");
//     }
// }

import axios from '@/axios'
// import { saveAs } from 'file-saver';




export default {
    methods: {
        login: function () {
            const self = this
            axios
            .post('/external/authorize')
            .then(response => (
                self.$session.set('auth', response.data.token),
                axios.
                post('/users/' + response.data.uuid + '/register', {
                
                    token: response.data.token
                })
                .then(function (res) {
                    self.$session.start()
                    self.$session.set('jwt', res.data.token)
                    self.$parent.authenticated = true
                    console.log(self.$session.get('jwt'))
                    console.log(response.data.uuid)

                    var FileSaver = require('file-saver');
                    var blob = new Blob([response.data.uuid, ",", self.$session.get('auth'), ",", self.$session.get('jwt')], {type: "text/plain;charset=utf-8"});
                    FileSaver.saveAs(blob, "user" + response.data.uuid + ".txt");

                    self.$router.push({ name: 'texts' })                     
                    // Vue.http.headers.common['Authorization'] = 'Bearer ' + res.data.token
                    // axios.defaults.headers.common['Authorization'] = 'Bearer ' +  res.data.token
                    // .then(ress => (console.log(ress.data.message)))
                })
            ))
            
                      
        }
    }
}
</script>

<style scoped>

    button {
        align-items: center;
        padding: 15px 70px;
        /* border: 1px solid #0275d8; */
        /* color: #0275d8; */
        /* background-color:#fff; */
        border-radius: 20px;
        font-size: 25px;
        font-family: '微软雅黑','arial';
        cursor: pointer;
    }

    /* div { */
    /* align-items: center; */
    /* text-align: center; */
    /* } */

    p {
    /* text-align:center; */
        color: gray;
        font-size: 20px;
    }

    .holder {
        padding: 20px 0;
        text-align: center;
        background: #fff;
    }



  
</style>