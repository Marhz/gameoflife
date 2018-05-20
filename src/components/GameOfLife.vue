<template>
  <div class="container">
    <div class="left">
      <game-canvas
        :canvasWidth="canvas.width"
        :canvasHeight="canvas.height"
        :tileHeight="config.tileSize.width"
        :tileWidth="config.tileSize.height"
        @toggleTile="toggleTile"
        @birthTile="birthTile"
        ref="canvas"
      />
    </div>
    <game-controls
      :neighborsToBeBorn="gameConfig.neighborsToBeBorn"
      :minToLive="gameConfig.minNeighborsToSurvive"
      :maxToLive="gameConfig.maxNeighborsToSurvive"
      :inGame="inGame"
      :turn="turn"
      @configChange="handleConfigChange"
      @startGame="startGame"
      @stopGame="inGame = false"
      @reset="reset"
      @next="next"
      @prev="prev"
      class="right"
    />
  </div>
</template>

<script>
import GameCanvas from './GameCanvas.vue';
import GameControls from './GameControls.vue';

let component = {
  components: { GameCanvas, GameControls },
  data() {
    return {
      gameConfig: {
        minNeighborsToSurvive: 2,
        maxNeighborsToSurvive: 4,
        neighborsToBeBorn: 3
      },
      config: {
        tileSize: {
          width: 8,
          height: 8
        },
      },
      canvas: {
        width: 0,
        height: 0
      },
      tiles: {},
      inGame: false,
      turn: 0,
      undoStack: []
    }
  },
  methods: {
    makeTiles() {
      let tilesInX = Math.floor(this.canvas.width / this.config.tileSize.width); 
      let tilesInY = Math.floor(this.canvas.height / this.config.tileSize.height);
      for(let x = 0; x < tilesInX; x++) {
        for (let y = 0; y < tilesInY; y++) {
          this.tiles[x+'-'+y] = {
            status: 'DEAD',
            posX: x * this.config.tileSize.width,
            posY: y * this.config.tileSize.height,
            x,
            y
          }
        }
      }
    },
    birthTile(tileId) {
      let tile = this.tiles[tileId];
      tile.status = 'ALIVE'; 
      this.$refs.canvas.drawTile(tile)
    },
    toggleTile(tileId) {
      let tile = this.tiles[tileId];
      tile.status = tile.status === 'DEAD' ? 'ALIVE' : 'DEAD';
      this.$refs.canvas.drawTile(tile)
    },
    getAliveNeighbors({x, y}) {
      let aliveNeighbors = 0;
      for (let tmpX = x - 1; tmpX <= x + 1; tmpX++) {
        for(let tmpY = y - 1; tmpY <= y + 1; tmpY++) {
          if (tmpX === x && tmpY === y) continue;
          if (this.tiles[tmpX+'-'+tmpY] && this.tiles[tmpX+'-'+tmpY].status === 'ALIVE') {
            aliveNeighbors++;
          }
        }
      }
      return aliveNeighbors;
    },
    shouldDie(tile) {
      const aliveNeighbors = this.getAliveNeighbors(tile);
      let bool = (aliveNeighbors >= this.gameConfig.maxNeighborsToSurvive || aliveNeighbors < this.gameConfig.minNeighborsToSurvive)
      return bool 
    },
    shouldBeBorn(tile) {
      const aliveNeighbors = this.getAliveNeighbors(tile);
      return (aliveNeighbors === this.gameConfig.neighborsToBeBorn);
    },
    runGame() {
      let tiles = Object.values(this.tiles);
      let deadTiles = tiles.filter(tile => tile.status === "DEAD");
      let aliveTiles = tiles.filter(tile => tile.status === "ALIVE");
      let killNextTurn = [];
      let birthNextTurn = [];
      
      deadTiles.forEach(tile => this.shouldBeBorn(tile) && birthNextTurn.push(tile))
      aliveTiles.forEach(tile => this.shouldDie(tile) && killNextTurn.push(tile))
      
      killNextTurn.forEach(this.updateStatus('DEAD'));
      birthNextTurn.forEach(this.updateStatus('ALIVE'));
      this.undoStack.push({
        killed: killNextTurn,
        birthed: birthNextTurn
      });
      killNextTurn = [];
      birthNextTurn = [];
      this.turn++;
      setTimeout(() => {
        if (this.inGame) this.runGame()
      }, 10);
    },
    startGame() {
      this.inGame = true;
      this.runGame();
    },
    handleConfigChange(key, value) {
      this.gameConfig[key] = +value
    },
    reset() {
      this.inGame = false;
      this.makeTiles();
      this.turn = 0;
      this.undoStack = []
      this.$refs.canvas.clear();
    },
    next() {
      if (this.inGame) return;
      this.runGame();
    },
    prev() {
      if (this.inGame || this.undoStack.length === 0) return;
      let action = this.undoStack.pop();
      action.killed.forEach(this.updateStatus('ALIVE'));
      action.birthed.forEach(this.updateStatus('DEAD'));
      this.turn--;
    },
    updateStatus(status) {
      return (tile) => {
        tile.status = status;
        this.$refs.canvas.drawTile(tile);
      }
    },
  },
  created() {
    this.canvas.width = window.innerWidth * 70 / 100;
    this.canvas.height = window.innerHeight;
  },
  mounted() {
    this.makeTiles();
  }
}

export default component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.left {
  /* width: 70%; */
  background: white;
  height: 100vh;
}
.right {
  margin-left: auto;
  margin-right: auto;
  width: 20%;
  height: 100vh;
}
.container {
  display: flex;
  height: 100vh;
  /* height: 100%; */
}
body {
  overflow: hidden;
  background: #BADA55;
}
</style>
