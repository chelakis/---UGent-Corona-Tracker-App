<template>

  <div id="login">
    <nav v-if="authenticated" class="navbar navbar-dark bg-primary">
      <router-link to="/login" v-on:click.native="logout()" replace>Logout</router-link>
    </nav>
    <Welcome id="Welcome"></Welcome>
    <!-- <Login id="Login"></Login> -->
    <!-- <router-link to="/App">Navigate to Page2</router-link> -->
    
    <router-view id='dcomp' />
    <!-- <router-link to="/texts">Navigate to Page2</router-link> -->
  </div>
  
</template>


<script>

import Welcome from './components/Welcome.vue'
// import Login from './components/Login.vue'

export default {
  name: 'AppLogin',
  data() {
    return {
      authenticated: false
      }
  },
  components: {
    Welcome,
  },
  mounted() {
    console.log(this.authenticated);
    if (!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
    else {
      this.$router.replace({ name: "texts" });
    }
  },
  methods: {
            logout() {
                this.authenticated = false;
            }
        }
            

}

</script>


<style>

*router-link{
  color: hotpink;
}

#dcomp {
  margin-top: 5%;
  margin-left: 25%;
  width: 50%;
}

</style>


