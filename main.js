(function() {
    const canvas = document.querySelector('canvas');
    const stop = document.querySelector('.stop');
    const start = document.querySelector('.start');
    let config = {
        minNeighborsToSurvive: 2,
        maxNeighborsToSurvive: 4,
        neighborsToBeBorn: 3
    }
    const tileSize = {
        width: 20,
        height: 20
    };
    const lineWidth = 2;
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    const drawGrid = (ctx, tileSize) => {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "white";

        let data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width="${tileSize.width}" height="${tileSize.height}" patternUnits="userSpaceOnUse">
                    <path d="M ${tileSize.width} 0 L 0 0 0 ${tileSize.height}" fill="none" stroke="gray" stroke-width="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>`;

        let DOMURL = window.URL || window.webkitURL || window;
        
        let img = new Image();
        let svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        let url = DOMURL.createObjectURL(svg);
        
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);
            canvas.style.backgroundImage = 'url(' + canvas.toDataURL('image/svg') + ')'
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        img.src = url;
    }
    let tiles = (() => {
        let tmp = {};
        tilesInX = Math.floor(canvas.width / tileSize.width); 
        tilesInY = Math.floor(canvas.height / tileSize.height);
        for(let x = 0; x < tilesInX; x++) {
            for (let y = 0; y < tilesInY; y++) {
                // ctx.rect(x * tileSize.width, y * tileSize.height, tileSize.width, tileSize.height);   
                // ctx.stroke();
                tmp[x+'-'+y] = {
                    status: 'DEAD',
                    posX: x * tileSize.width,
                    posY: y * tileSize.height,
                    x,
                    y
                }
            }
        }
        return tmp;
    })()
    drawGrid(ctx, tileSize);
    console.log(tiles); 
    const getTile = e => {
        const x = Math.floor(e.offsetX / tileSize.width);
        const y = Math.floor(e.offsetY / tileSize.height);
        return tiles[x+'-'+y];
    }
    const getFillStyle = tile => tile.status === 'DEAD' ? 'black' : 'white'
    const drawTile = (tile) => {
        ctx.fillStyle = 'black';
        if (tile.status === "ALIVE")
            ctx.fillRect(tile.posX, tile.posY, tileSize.width, tileSize.height);
        else
            ctx.clearRect(tile.posX, tile.posY, tileSize.width, tileSize.height);
    }
    const toggleTile = tile => {
        tile.status = tile.status === 'DEAD' ? 'ALIVE' : 'DEAD';
        drawTile(tile);
    }
    const handleClick = e => {
        tile = getTile(e);
        toggleTile(tile)
    }
    let loop = true;
    canvas.addEventListener('click', handleClick);
    stop.addEventListener('click', () => loop = false);
    let killNextTurn = [];
    let birthNextTurn = [];
    const getAliveNeighbors = ({x, y}) => {
        let aliveNeighbors = 0;
        for (let tmpX = x - 1; tmpX <= x + 1; tmpX++) {
            for(let tmpY = y - 1; tmpY <= y + 1; tmpY++) {
                if (tmpX === x && tmpY === y) continue;
                if (tiles[tmpX+'-'+tmpY] && tiles[tmpX+'-'+tmpY].status === 'ALIVE') {
                    aliveNeighbors++;
                }
            }
        }
        return aliveNeighbors;
    }
    const shouldDie = (tile) => {
        const aliveNeighbors = getAliveNeighbors(tile);
        return (aliveNeighbors >= config.maxNeighborsToSurvive || aliveNeighbors < config.minNeighborsToSurvive)
    }
    const shouldBeBorn = (tile) => {
        const aliveNeighbors = getAliveNeighbors(tile);
        if (tile.x === 0 && tile.y === 0) console.log(aliveNeighbors)
        return (aliveNeighbors === config.neighborsToBeBorn);
    }
    
    const startGame = () => {
        let tilesT = Object.values(tiles);
        let deadTiles = tilesT.filter(tile => tile.status === "DEAD");
        let aliveTiles = tilesT.filter(tile => tile.status === "ALIVE");
        
        deadTiles.forEach(tile => shouldBeBorn(tile) && birthNextTurn.push(tile))
        aliveTiles.forEach(tile => shouldDie(tile) && killNextTurn.push(tile))
        
        killNextTurn.forEach(tile => {
            tile.status = 'DEAD';
            drawTile(tile);
        });
        birthNextTurn.forEach(tile => {
            tile.status = 'ALIVE';
            drawTile(tile);
        });
        killNextTurn = [];
        birthNextTurn = [];
        setTimeout(() => {
            if (loop) startGame()
        }, 275);
    }
    start.addEventListener('click', () => {
        loop = true;
        startGame();
    });
})()
