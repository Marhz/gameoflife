<template>
  <div id="app">
    <game-of-life msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import GameOfLife from './components/GameOfLife.vue'

export default {
  name: 'app',
  components: {
    GameOfLife
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
