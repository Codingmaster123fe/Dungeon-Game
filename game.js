class DungeonGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.tileSize = 20;
        this.player = {
            x: 2,
            y: 2,
            health: 100,
            level: 1,
            score: 0
        };
        
        this.enemies = [];
        this.map = [];
        
        this.setupGame();
        this.setupEventListeners();
        this.gameLoop();
    }

    setupGame() {
        // Generate dungeon map
        this.generateMap();
        this.spawnEnemies();
        this.updateHUD();
    }

    generateMap() {
        const mapWidth = this.canvas.width / this.tileSize;
        const mapHeight = this.canvas.height / this.tileSize;

        for (let y = 0; y < mapHeight; y++) {
            this.map[y] = [];
            for (let x = 0; x < mapWidth; x++) {
                if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
                    this.map[y][x] = 1; // Wall
                } else {
                    this.map[y][x] = Math.random() < 0.3 ? 1 : 0; // 30% chance for wall
                }
            }
        }
        // Ensure player starting position is clear
        this.map[2][2] = 0;
    }

    spawnEnemies() {
        for (let i = 0; i < 10; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * (this.canvas.width / this.tileSize));
                y = Math.floor(Math.random() * (this.canvas.height / this.tileSize));
            } while (this.map[y][x] === 1 || (x === this.player.x && y === this.player.y));

            this.enemies.push({
                x: x,
                y: y,
                health: 50,
                type: 'goblin'
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            let dx = 0, dy = 0;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                    dy = -1;
                    break;
                case 'ArrowDown':
                case 's':
                    dy = 1;
                    break;
                case 'ArrowLeft':
                case 'a':
                    dx = -1;
                    break;
                case 'ArrowRight':
                case 'd':
                    dx = 1;
                    break;
                case ' ':
                    this.attack();
                    break;
            }

            this.movePlayer(dx, dy);
        });
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (this.isValidMove(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
            this.checkCollisions();
        }
    }

    isValidMove(x, y) {
        return x >= 0 && 
               x < this.canvas.width / this.tileSize && 
               y >= 0 && 
               y < this.canvas.height / this.tileSize && 
               this.map[y][x] === 0;
    }

    attack() {
        this.enemies = this.enemies.filter(enemy => {
            const distance = Math.sqrt(
                Math.pow(enemy.x - this.player.x, 2) + 
                Math.pow(enemy.y - this.player.y, 2)
            );
            
            if (distance <= 1.5) {
                this.player.score += 10;
                this.updateHUD();
                return false;
            }
            return true;
        });
    }

    checkCollisions() {
        this.enemies.forEach(enemy => {
            if (enemy.x === this.player.x && enemy.y === this.player.y) {
                this.player.health -= 10;
                this.updateHUD();
                if (this.player.health <= 0) {
                    alert('Game Over!');
                    this.setupGame();
                }
            }
        });
    }

    updateHUD() {
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('level').textContent = this.player.level;
        document.getElementById('score').textContent = this.player.score;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw map
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === 1) {
                    this.ctx.fillStyle = '#666';
                    this.ctx.fillRect(
                        x * this.tileSize, 
                        y * this.tileSize, 
                        this.tileSize, 
                        this.tileSize
                    );
                }
            }
        }

        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(
                enemy.x * this.tileSize, 
                enemy.y * this.tileSize, 
                this.tileSize, 
                this.tileSize
            );
        });

        // Draw player
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(
            this.player.x * this.tileSize, 
            this.player.y * this.tileSize, 
            this.tileSize, 
            this.tileSize
        );
    }

    gameLoop() {
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    new DungeonGame();
};