window.onload = function(){

    var game = new Phaser.Game(800,600,Phaser.AUTO,'container',
        {preload: preload, create: create, update: update, render: render});



    function preload(){
        game.load.image('playerimg','assets/player.PNG');
        game.load.image('playercrouched', 'assets/playersmall.PNG');
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
    var layer2;
    //map variable
    var map;
    //player bullets variable and bullet fire timing
    var playerBullets;
    var bulletTime = 0;

    //enemy and item group variables
    var enemyGroup;
    var itemGroup;

    //holds the current enemy being updated
    var currEnemy;

    function create(){

        //general level set up, background color, tile map, layers and collision, world size, gravity
        game.stage.backgroundColor = '#123465';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('map');
        map.addTilesetImage('tileset');
        layer = map.createLayer('Tile Layer 1');
        layer2 = map.createLayer('Tile Layer 2');
        map.setCollision(4,true,layer);
        layer.resizeWorld();
        game.physics.arcade.gravity.y = 600;

        //make the second layer invisible
        layer2.visible = false;

        //set up enemy and item groups
        enemyGroup = game.add.group();
        itemGroup = game.add.group();

        var mapArray = layer2.getTiles(0,0,game.world.width, game.world.height);

        for(var i = 0; i < mapArray.length; i++){
            var myTile = mapArray[i];

            if(myTile.index == 1){
                //create player and ad him to the game and give him physics
                player = new Player(game, myTile.worldX, myTile.worldY, 'playerimg', 300, 290, 200);
                game.add.existing(player);
            }

            if(myTile.index == 2){
                var enemy = new Enemy(game, myTile.worldX, myTile.worldY, 'enemyimg', 300, 'bullet');
                enemyGroup.add(enemy);
            }

            if(myTile.index == 3){
                var item = new Item(game, myTile.worldX, myTile.worldY, 'itemimg', 'item');
                itemGroup.add(item);
            }
        }

        //make the camera follow the player
        game.camera.follow(player);

        //create the bullets group and kill them when they reach the edge of the world
        playerBullets = game.add.group();
        playerBullets.setAll('outOfBoundsKill', true);
        playerBullets.setAll('checkWorldBounds', true);

    }

    function update(){

        //make the player collide with the ground and platforms
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(enemyGroup, layer);
        game.physics.arcade.collide(playerBullets,enemyGroup,bulletHitEnemy);

        //cycle through the enemy group
        for(var i = 0; i < enemyGroup.length; i++) {

            //set up global variable so when can check which enemy is being updated from anywhere
            currEnemy = i;

            //when an enemies health reaches 0 kill it and remove it from the group
            if(enemyGroup.getAt(i).health <= 0) {
                enemyGroup.getAt(i).kill;
                enemyGroup.getAt(i).remove;
            }
            //check for collision between the player and the enemy bullets
            game.physics.arcade.collide(enemyGroup.getAt(i).bullets, player, playerHitByEnemy);

            //check for collision between enemies sight and plaer
            game.physics.arcade.overlap(enemyGroup.getAt(i).sight, player, function(collplayer, enemy){
                //if the player is to the left of the enemy fire left and the same for right
                if(player.x < enemyGroup.getAt(i).x) {
                    enemyGroup.getAt(i).Fire('left');
                }
                if(player.x > enemyGroup.getAt(i).x){
                    enemyGroup.getAt(i).Fire('right');
                }

            });
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
    }

    //general debugging and in house desk testing
    function render(){

        game.debug.body(enemyGroup.getAt(0).sight, 'rgba(255,0,255,1)', false);
        //game.debug.bodyInfo(player, 0, 25);
        //game.debug.bodyInfo(enemyGroup.getAt(0), 0, 175);
    }

    //the call back for when the player's bullet hits an enemy
    function bulletHitEnemy(bullet, enemy){

        //kill the player bullet and the enemy
        bullet.damage(1);
        enemy.damage(1);
    }

    //the call back for when the player is hit by an enemy bullet
    function playerHitByEnemy(player, enemyBullet) {
        //damage the player and the enemy bullet by 1 and log the players health
        player.damage(1);
        enemyBullet.damage(1);
    }
}