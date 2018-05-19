<template>
  <canvas
    @click="handleClick"
  ></canvas>	
</template>

<script>
  export default {
    props: ['tileWidth', 'tileHeight', 'canvasWidth', 'canvasHeight'],
    data() {
      return {
        ctx: {}  
      }
    },
    methods: {
      drawGrid(ctx, tileSize) {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = "white";

        let data = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="${this.tileWidth}" height="${this.tileHeight}" patternUnits="userSpaceOnUse">
              <path d="M ${this.tileWidth} 0 L 0 0 0 ${this.tileHeight}" fill="none" stroke="gray" stroke-width="0.5" />
            </pattern>
          </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
        `;

        let DOMURL = window.URL || window.webkitURL || window;
        
        let img = new Image();
        let svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        let url = DOMURL.createObjectURL(svg);
        
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0);
          DOMURL.revokeObjectURL(url);
          this.$el.style.backgroundImage = 'url(' + this.$el.toDataURL('image/svg') + ')'
          this.ctx.clearRect(0, 0, this.$el.width, this.$el.height);
        }
        img.src = url;
      },
      handleClick(e) {
        const x = Math.floor(e.offsetX / this.tileWidth);
        const y = Math.floor(e.offsetY / this.tileHeight);
        this.$emit('toggleTile', x+'-'+y);
        this.drawTile(x, y)
      },
      drawTile(x, y) {
        let tile = this.$parent.tiles[x+'-'+y];
        this.ctx.fillStyle = 'black';
        if (tile.status === "ALIVE")
            this.ctx.fillRect(tile.posX, tile.posY, this.tileWidth, this.tileHeight);
        else
            this.ctx.clearRect(tile.posX, tile.posY, this.tileWidth, this.tileHeight);
      }
    },
    mounted() {
      this.$el.width = this.canvasWidth;
      this.$el.height = this.canvasHeight;
      this.ctx = this.$el.getContext('2d');
      this.drawGrid();
    }
  }
</script>
