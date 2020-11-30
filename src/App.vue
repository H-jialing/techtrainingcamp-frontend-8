<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* @media only screen and (min-width: 1280px){
  html{
    font-size: 18px;
  }
}
@media only screen and (max-width: 1280px) and (min-width: 960px){
  html{
    font-size: 14px;
  }
}
@media only screen and (min-width: 530px) and (max-width: 960px){
  html{
    font-size: 12px;
  }
}
@media only screen and (max-width: 530px){
  html{
    font-size: 10px;
  }
} */
@media only screen and (min-width: 466px){
  html{
    font-size: 14px;
  }
}
@media only screen and (max-width: 466px){
  html{
    font-size: 10px;
  }
}

* {
  margin: 0;
  padding: 0;
}
html, 
body {
  width: 100%;
  height: 100%;
}
button, 
input {
  outline: none;
  border-color: transparent;
  box-shadow:none;
  border: none;
}
button {
  cursor: pointer;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50; */
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
  background-image: url('./assets/img/bg1.jpeg');
  background-repeat: repeat;
}
</style>
