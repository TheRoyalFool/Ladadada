window.onload = function(){

    var game = new Phaser.Game(800,600,Phaser.AUTO,'container',
        {preload: preload, create: create, update: update, render: render});



    function preload(){
        game.load.image('playerimg','assets/player.PNG');
        game.load.image('enemyimg', 'assets/enemy.jpg');
        game.load.image('bull', 'assets/bullet.jpg');


        game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tileset.png');
    }

    var player;
    var layer;
    var map;
    var bullets;
    var bulletTime = 0;
    var bulletDelay = 150;

    function create(){

        //set up level, background, tilemap and layer collisions
        game.stage.backgroundColor = '#123465';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('map');
        map.addTilesetImage('tileset');
        layer = map.createLayer('Tile Layer 1');
        map.setCollision(1,true,layer);
        layer.resizeWorld();

        //create player and ad him to the game and give him physics
        player = new Player(game, 100, 100, 'playerimg', 300, 300);
        game.add.existing(player);
        game.physics.enable(player, Phaser.Physics.ARCADE);

        //give the player some physics values and dont allow him to exit the screen
        player.body.gravity.y = 600;
        player.body.collideWorldBounds = true;
        player.body.setSize(64 ,64);

        //make the camera follow the player
        game.camera.follow(player);

        bullets = game.add.group();
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
    }

    function update(){

        this.physics.arcade.collide(player, layer);

        if (game.input.mousePointer.isDown && bulletTime < game.time.now)
        {
            var bullet = new Bullet(game, player.x+player.width/2, player.y+player.height/2, 'bull', 400, player.dir);
            bullet.anchor.x = 0.5;
            bullet.anchor.y = 0.5;
            game.physics.enable(bullet, Phaser.Physics.ARCADE);
            bullets.add(bullet);
            bulletTime = game.time.now + bulletDelay;
        }
    }

    function render(){
        game.debug.text(player.x);
    }

}