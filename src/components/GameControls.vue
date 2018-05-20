<template>
  <div class="controls">
    <h3>Generation: {{ turn }}</h3>
    <div>
      <label for="">Neighbors to be born:</label>
      <input type="text" 
        :value="neighborsToBeBorn" 
        :disabled="inGame" 
        @change="(e) => this.configChange('neighborsToBeBorn', e.target.value)"
      >
    </div>
    <div>
      <label for="">Min neighbors to live:</label>
      <input type="text" 
        :value="minToLive" 
        :disabled="inGame"
        @change="(e) => this.configChange('minNeighborsToSurvive', e.target.value)"
      >
    </div>
    <div>
      <label for="">Max neighbors to live:</label>
      <input type="text" 
        :value="maxToLive"
        :disabled="inGame"
        @change="(e) => this.configChange('maxNeighborsToSurvive', e.target.value)"
      >
    </div>
    <button @click="$emit('startGame')">Start</button>
    <button @click="$emit('stopGame')">Stop</button>
    <button @click="$emit('reset')">Reset</button>
    <button @click="$emit('prev')">Previous</button>
    <button @click="$emit('next')">Next</button>
  </div>	
</template>

<script>
  export default {
    props: ['maxToLive', 'minToLive', 'neighborsToBeBorn', 'turn'],
    data() {
      return {
        inGame: false
      }
    },
    methods: {
      configChange(key, value) {
        this.$emit('configChange', key, value)
      }
    }
  }
</script>

<style>
  .controls {
    display: flex;
    flex-direction: column;
  }
  input {
    padding: 5px 10px;
    margin: 10px 0px;
    width: 100%;
  }
</style>
