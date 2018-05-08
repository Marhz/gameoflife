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

        var data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" />
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)" />
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>`;

        var DOMURL = window.URL || window.webkitURL || window;
        
        var img = new Image();
        var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        var url = DOMURL.createObjectURL(svg);
        
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
    const drawTile = (tile, fillStyle) => {
        ctx.fillStyle = 'black';
        if (tile.status === 'DEAD') {
            ctx.clearRect(tile.posX, tile.posY, tileSize.width, tileSize.height);
        } else {
            ctx.fillRect(tile.posX, tile.posY, tileSize.width, tileSize.height);
        }
        // drawGrid(ctx, tileSize);
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
            drawTile(tile, 'white');
            tile.status = 'DEAD';
        });
        birthNextTurn.forEach(tile => {
            drawTile(tile, 'black');
            tile.status = 'ALIVE';
        });
        killNextTurn = [];
        birthNextTurn = [];
        setTimeout(() => {
            if (loop) startGame();
        }, 100);
    }
    start.addEventListener('click', () => {
        loop = true;
        startGame()
    });
})()
