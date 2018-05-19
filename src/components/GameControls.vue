<template>
  <div>
    <input type="text">
    <button @click="$emit('startGame')">Start</button>
    <button @click="$emit('stopGame')">Stop</button>
  </div>	
</template>

<script>
  export default {
    props: [],
    data() {
      return {
        
      }
    },
    methods: {
      
    }
  }
</script>
