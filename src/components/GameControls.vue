<template>
  <div class="controls">
    <h3>Generation: {{ turn }}</h3>
    <div>
      <label for="">Neighbors to be born:</label>
      <input type="number" 
        :value="neighborsToBeBorn" 
        :disabled="inGame" 
        @change="(e) => this.configChange('neighborsToBeBorn', e.target.value)"
      >
    </div>
    <div>
      <label for="">Min neighbors to live:</label>
      <input type="number" 
        :value="minToLive" 
        :disabled="inGame"
        @change="(e) => this.configChange('minNeighborsToSurvive', e.target.value)"
      >
    </div>
    <div>
      <label for="">Max neighbors to live:</label>
      <input type="number" 
        :value="maxToLive"
        :disabled="inGame"
        @change="(e) => this.configChange('maxNeighborsToSurvive', e.target.value)"
      >
    </div>
    <button @click="$emit('startGame')">Start</button>
    <button @click="$emit('stopGame')">Stop</button>
    <button @click="$emit('reset')">Reset</button>
    <div class="buttons-container">
      <button @click="$emit('prev')">Previous</button>
      <button @click="$emit('next')">Next</button>
    </div>
  </div>	
</template>

<script>
  export default {
    props: ['maxToLive', 'minToLive', 'neighborsToBeBorn', 'turn', 'inGame'],
    methods: {
      configChange(key, value) {
        this.$emit('configChange', key, value)
      }
    }
  }
</script>

<style lang="scss">
  $btnColor: #0066FF;
  h3 {
    padding-top: 0;
  }
  .controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  input {
    padding: 5px 10px;
    margin: 10px 0px;
    width: 100%;
  }
  button {
    padding: 10px 10px;
    margin: 10px 0px;
    background: $btnColor;
    border: 1px solid darken($btnColor, 20%);
    border-radius: 5px;
    color: white;
    &:hover {
      background: darken($btnColor, 20%);
    }
  }
  .buttons-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    & button {
      width: 48%;
    } 
  }
</style>
