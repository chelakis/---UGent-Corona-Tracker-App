
<template>
  <div class="main-div">
    <div class="holder">
      <!-- <h1>Welcome to CoronaTracker App</h1> -->

      <h1> Health Status: </h1>

      
      <h1 v-show="healthStatus=='safe' || healthStatus=='low risk'"> 
        <span class="badge badge-success">{{ healthStatus }}</span>
      </h1>
      <h1 v-show="healthStatus=='medium risk'"> 
        <span id='medium-risk' class="badge badge-warning">{{ healthStatus }}</span>
      </h1>
      <h1 v-show="healthStatus=='high risk'">
        <span id='high-risk' class="badge badge-warning">{{ healthStatus }}</span>
      </h1>
      <h1 v-show="healthStatus=='carrier'"> 
        <span class="badge badge-danger">{{ healthStatus }}</span>
      </h1>
      

      
      
    </div>  

    <p>
      Protect yourself and the others around you using CoronaTracker app. 
      It is quite easy, just press the "Diagnosed" button if you have diagnosed with coronavirus or another disease.
    </p>

    <button class="btn btn-primary" type="submit" v-on:click="affected">Diagnosed</button>
    <button class="btn btn-primary" type="submit" v-on:click="checker">Check!</button>
      
  </div>
</template>

<script>
import axios from '@/axios'

export default {

  data () {
      
      return {
      healthStatus: null,
      risk: null,
      bgColor: 'yellow',
      bgWidth: '100%',
      bgHeight: '30px',

    }
  },




  
  


  methods: {
    affected: function () {

      const self = this
      // console.log(self.$session.get('jwt'))

      axios.put('/users/status', {positive : true}, {
        headers:{'Authorization': 'Bearer ' +  self.$session.get('jwt')}
        })
        .then(axios.get('/users/status', {
                        headers: { 
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' +  self.$session.get('jwt')
                        }
                    })
                    .then(response => this.healthStatus = response.data.message, this.risk = 0)
        )

      .then(alert("You were diagnosed positive to Covid-19, stay home!\n\n"
            + "All users who came in contact with you the last few days may be at risk and will get notified to prevent spreading."))
      // .then(this.healthStatus = 'carrier')
      .then(this.$forceUpdate())


      
    },

    checker: function() {
   
      const self = this
      axios.get('/users/status', {
                        headers: { 
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' +  self.$session.get('jwt')
                        }
                    })
    .then(response => this.healthStatus = response.data.message, this.risk = 0)
    .then(alert("Checking for current health status\n\n"
            ))
    }
    ,


    intervals: function() {
        setInterval(function(){ this.checker
        }, 3000);
    }    

  },


  mounted () {

    const self = this
      axios.get('/users/status', {
                        headers: { 
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' +  self.$session.get('jwt')
                        }
                    })
    .then(response => this.healthStatus = response.data.message, this.risk = 0)
    .then(this.$forceUpdate())



    // setInterval(function (){
    //                     (axios.get('/users/status', {
    //                     headers: { 
    //                         'Content-Type': 'application/json',
    //                         Authorization: 'Bearer ' +  self.$session.get('jwt')
    //                     }
    //                 })
    // .then(response => this.healthStatus = response.data.message))
    // .then(console.log(this.healthStatus))
    // .then(this.healthStatus.$forceUpdate())
    // .then(this. $forceUpdate (this.healthStatus));}, 1000)


    
  
                    

  }

}
  
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .holder {
    /* text-align: center; */
    background: #fff;
  }

  p {
    /* text-align:center; */
    padding: 30px 0;
    color: gray;
    font-size: 20px;
  }

  .container {
    box-shadow: 0px 0px 40px lightgray;
  }
  .alert {
    background-color: yellow;
  }
  .another-class {
    border: 5px solid black
  }
  button {
  align-items: center;
  padding: 15px 50px;
  border: 1px solid #0275d8;
  color: #0275d8;
  background-color:#fff;
  border-radius: 20px;
  font-size: 25px;
  font-family: '微软雅黑','arial';
  cursor: pointer;
  /* margin: auto;
  display: block; */
  }


  #high-risk {
    background-color: rgb(255, 150, 0)
  }


   /* {
    text-align: center
  } */


  
</style>

