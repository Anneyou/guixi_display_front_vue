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
@import './assets/fonts/style.css';

#app {
  height: 100%;
  padding: 1rem 1rem 0;
  background: url('./assets/image_bg.png');
  background-size: cover;
  overflow: auto;
}
</style>
