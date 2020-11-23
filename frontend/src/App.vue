<template>

  <div id="app">
    <Welcome id="Welcome"></Welcome>
    <Texts id="Texts"></Texts>
  </div>
  
</template>


<script>

import Texts from './components/Texts.vue'
import Welcome from './components/Welcome.vue'

export default {
  name: 'App',
  components: {
    Welcome,
    Texts
  }

}



</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');

body {
  background-color: #FFF;
  font-family: 'Montserrat', sans-serif;
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  align-items: center;
  text-align: center;
}
body, html {
  margin: 0;
  height: 100%;
}
#app {
    width: 100%;
}

/* div {
  align-items: center;
  text-align: center;
} */


#Texts {
  margin-top: 5%;
  margin-left: 25%;
  width: 50%;

}


/* .jumbotron {
  background:transparent;
  border: #000;
} */


</style>

