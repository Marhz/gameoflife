<template>
  <div class="container">
    <game-canvas
      :canvasWidth="canvas.width"
      :canvasHeight="canvas.height"
      :tileHeight="config.tileSize.width"
      :tileWidth="config.tileSize.height"
      @toggleTile="toggleTile"
      class="left"
      ref="canvas"
    />
    <game-controls
      class="right"
      @startGame="startGame"
      @stopGame="inGame = false"
    />
  </div>
</template>

<script>
import GameCanvas from './GameCanvas.vue';
import GameControls from './GameControls.vue';

export default {
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
          width: 40,
          height: 40
        },
      },
      canvas: {
        width: 1200,
        height: 800
      },
      tiles: {},
      inGame: false
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
    toggleTile(tileId) {
      this.tiles[tileId].status = this.tiles[tileId].status === 'DEAD' ? 'ALIVE' : 'DEAD';
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
      let bool = (aliveNeighbors >= this.gameConfig.maxNeighborsToSurvive || aliveNeighbors < this.gameConfig.minNeighborsToSurvive)
      return bool 
    },
    shouldBeBorn(tile) {
      const aliveNeighbors = this.getAliveNeighbors(tile);
      return (aliveNeighbors === this.gameConfig.neighborsToBeBorn);
    },
    runGame() {
      let tiles = Object.values(this.tiles);
      console.log(tiles);
      let deadTiles = tiles.filter(tile => tile.status === "DEAD");
      let aliveTiles = tiles.filter(tile => tile.status === "ALIVE");
      let killNextTurn = [];
      let birthNextTurn = [];
      
      deadTiles.forEach(tile => this.shouldBeBorn(tile) && birthNextTurn.push(tile))
      aliveTiles.forEach(tile => this.shouldDie(tile) && killNextTurn.push(tile))
      
      killNextTurn.forEach(tile => {
        tile.status = 'DEAD';
        this.$refs.canvas.drawTile(tile.x, tile.y)
      });
      birthNextTurn.forEach(tile => {
        tile.status = 'ALIVE';
        this.$refs.canvas.drawTile(tile.x, tile.y)
      });
      killNextTurn = [];
      birthNextTurn = [];
      setTimeout(() => {
        if (this.inGame) this.runGame()
      }, 275);
    },
    startGame() {
      this.inGame = true;
      this.runGame();
    },
  },
  mounted() {
    this.makeTiles();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.left {
  /* width: 80%; */
}
.right {
  width: 20%;
}
.container {
  display: flex;
}
</style>
