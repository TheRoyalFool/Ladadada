window.onload = function(){

    var game = new Phaser.Game(800,600,Phaser.AUTO,'container',
        {preload: preload, create: create, update: update, render: render});



    function preload(){
        game.load.image('playerimg','assets/player.PNG');
        game.load.image('enemyimg', 'assets/enemy.jpg');
        game.load.image('bull', 'assets/bullet.jpg');
        game.load.image('itemimg', 'assets/item.png');

        game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tileset.png');
    }

    //variable for player
    var player;

    //variables for each layer on the tilemap
    var layer;
    //map variable
    var map;
    //player bullets variable and bullet fire timing
    var playerBullets;
    var bulletTime = 0;

    //enemy and item group variables
    var enemyGroup;
    var itemGroup;

    function create(){

        //set up level, background, tilemap and layer collisions
        game.stage.backgroundColor = '#123465';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('map');
        map.addTilesetImage('tileset');
        layer = map.createLayer('Tile Layer 1');
        map.setCollision(1,true,layer);
        layer.resizeWorld();
        game.physics.arcade.gravity.y = 600;

        //create player and ad him to the game and give him physics
        player = new Player(game, 100, 100, 'playerimg', 300, 290, 200);
        game.add.existing(player);

        //make the camera follow the player
        game.camera.follow(player);

        //create the bullets group and kill them when they reach the edge of the world
        playerBullets = game.add.group();
        playerBullets.setAll('outOfBoundsKill', true);
        playerBullets.setAll('checkWorldBounds', true);

        enemyGroup = game.add.group();
        var enemy = new Enemy(game, 100, 100, 'enemyimg', 300, 'bullet');
        enemyGroup.add(enemy);

        itemGroup = game.add.group();
        var item = new Item(game, 200, 100, 'itemimg', 'item');
        itemGroup.add(item);
    }

    function update(){

        //make the player collide with the ground and platforms
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(enemyGroup, layer);
        game.physics.arcade.collide(playerBullets,enemyGroup,bulletHitEnemy);

        for(var i = 0; i < enemyGroup.length; i++) {
            if(enemyGroup.getAt(i).health <= 0) {
                enemyGroup.getAt(i).destroy;
                enemyGroup.getAt(i).remove;
            }
            game.physics.arcade.collide(enemyGroup.getAt(i).bullets, player, playerHitByEnemy);
        }
        //check for the mouse click
        if (game.input.mousePointer.isDown && bulletTime < game.time.now)
        {
            //create new bullet at players position
            var bullet = new Bullet(game, player.x+player.width/2, player.y+player.height/2, 'bull', 400, player.dir);

            //add the bullet to the bullets group
            playerBullets.add(bullet);
            //reset the bullet delay
            bulletTime = game.time.now + player.bulletDelay;
        }

        game.physics.arcade.overlap(player,enemyGroup.getAt(0).sight,  function(rect, sprite){

            //console.log('player collides with sight');
        });
    }

    function render(){
        game.debug.geom( enemyGroup.getAt(0).rectD, 'rgba(255,0,255,1)' ) ;
    }

    function bulletHitEnemy(bullet, enemy){
        bullet.damage(1);
        enemy.damage(1);
    }


    function playerHitByEnemy(player, enemyBullet){
        player.damage(1);
        enemyBullet.damage(1);
        console.log(player.health);
    }
}