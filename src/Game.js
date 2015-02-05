window.onload = function(){

    var game = new Phaser.Game(800,600,Phaser.AUTO,'container',
        {preload: preload, create: create, update: update, render: render});



    function preload(){
        //loa player images
        game.load.image('playerimg','assets/player.PNG');
        game.load.image('playercrouched', 'assets/playersmall.PNG');

        //load enemy image
        game.load.image('enemyimg', 'assets/enemy.jpg');
        game.load.image('smEnemy', 'assets/smallenemy.png');

        //load item & bullet image
        game.load.image('bull', 'assets/bullet.jpg');
        game.load.image('itemimg', 'assets/item.png');

        //load tile map and tileset for the level
        game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map2', 'assets/tilemap2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tileset.png');

        //loads the example for the animation
        game.load.spritesheet('flare', 'assets/SolarFlare.png', 64, 64, 16);

    }

    //variable for player
    var player;

    //variables for each layer on the tilemap


    var layers = [];

    //map variable
    var map;

    //enemy and item group variables
    var enemyGroup;
    var itemGroup;

    //holds the current enemy being updated
    var currEnemy;
    var currItem;

    function create(){

        //general level set up, background color, tile map, layers and collision, world size, gravity
        game.stage.backgroundColor = '#123465';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        map = game.add.tilemap('map');
        map.addTilesetImage('tileset');
        layers[0] = map.createLayer('Tile Layer 1');
        layers[1] = map.createLayer('Tile Layer 2');
        map.setCollision(4,true,layers[0]);
        layers[0].resizeWorld();
        game.physics.arcade.gravity.y = 600;

        //make the second layer invisible
        layers[1].visible = false;

        //set up enemy and item groups
        enemyGroup = game.add.group();

        itemGroup = game.add.group();

        //map array for placing all the objects
        var mapArray = layers[1].getTiles(0,0,game.world.width, game.world.height);

        //loop through all the tiles in the map
        for(var i = 0; i < mapArray.length; i++){
            //create a variable to test against the tiles
            var myTile = mapArray[i];

            //if the tile index is equal to one
            if(myTile.index == 1){
                //create player and add him to the game and give him physics
                player = new Player(game, myTile.worldX, myTile.worldY, 'playerimg', 300, 290);
                game.add.existing(player);
            }

            //if the tile index is 2 create an enemy at that tiles position and add him to the game
            if(myTile.index == 2){
                var enemy = new Enemy(game, myTile.worldX, myTile.worldY, 'enemyimg', 150, 'shooter', 250, 1);
                enemyGroup.add(enemy);
            }

            //if the tiles index is 3 then add an item to the game and place it at the tiles position
            if(myTile.index == 3){
                var item = new Item(game, myTile.worldX, myTile.worldY, 'itemimg', 'item');
                itemGroup.add(item);
            }
        }

        //make the camera follow the player
        game.camera.follow(player);

        //log the amount of enemies spawned in on the map
        //console.log(enemyGroup.length);
    }

    function update(){

        //make the player collide with the ground and platforms
        game.physics.arcade.collide(player, layers[0]);

        for(var i = 0; i < itemGroup.length; i++){
            currItem = i;

        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.G)){
            LoadLevel('this');
        }
        game.physics.arcade.overlap(itemGroup, player, function(player, item){

            player.ChangeGun("Hail");
            itemGroup.remove(item);
        });

        //check that there is at least one enemy on the map
        if(enemyGroup.length > 0){

            //make the enemies collide with the ground
            game.physics.arcade.collide(enemyGroup, layers[0]);

            //if the player's bullets hit any of the enemies then call bulletHitEnemy
            game.physics.arcade.collide(player.bullets,enemyGroup,bulletHitEnemy);

            //if the player's melee range and an enemy are overlapping
            game.physics.arcade.overlap(enemyGroup, player.meleeRange, function(player, enemy){
                //if the M button is pressed then the enemy takes damage
                if(game.input.keyboard.isDown(Phaser.Keyboard.M)){
                    enemy.damage(1);
                }
            });

            //check for collision between the player and the enemy bullets
            game.physics.arcade.collide(enemyGroup.bullets, player, playerHitByEnemy);



            //cycle through the enemy group
            for(var e = 0; e < enemyGroup.length; e++) {

                //set up global variable so when can check which enemy is being updated from anywhere
                currEnemy = e;

                //when an enemies health reaches 0 kill it and remove it from the group
                if(enemyGroup.getAt(e).health <= 0) {
                    //enemyGroup.getAt(i).kill;
                    enemyGroup.remove(enemyGroup.getAt(e));
                    console.log(enemyGroup.length);
                }
                //check for collision between the player and the enemy bullets
                game.physics.arcade.collide(enemyGroup.getAt(e).bullets, player, playerHitByEnemy);

                //stops a shooter enemy from moving too far away from the player
                if(enemyGroup.getAt(e).type == "shooter"){
                    enemyGroup.getAt(e).followingPlayer = false;
                    enemyGroup.getAt(e).body.velocity.x = 0;
                }

                enemyGroup.getAt(e).seesPlayer = false;

                //check for collision between Enemy's sight and player
                game.physics.arcade.overlap(enemyGroup.getAt(e).sight, player, function(player, enemy){

                    enemyGroup.getAt(e).seesPlayer = true;

                });

                game.physics.arcade.overlap(enemyGroup, player, function (player, enemy){
                    enemyGroup.getAt(e).CollideBehaviour(player);
                    console.log(player.health);
                });

                //if the enemy is following the player then send the players position to the enemy
                if(enemyGroup.getAt(e).seesPlayer == true){
                    enemyGroup.getAt(e).SightBehaviour(player);
                }

                //if the enemy is following the player then send the players position to the enemy
                if(enemyGroup.getAt(e).followingPlayer == true){
                    enemyGroup.getAt(e).followPlayer(player);
                }

            }
        }

    }

    //general debugging and in house desk testing
    function render(){

        if(enemyGroup.length > 0){
            game.debug.body(enemyGroup.getAt(0).sight, 'rgba(255,0,255,1)', false);
        }
        game.debug.body(player.meleeRange, 'rgba(255,255,0,1)', false);

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

    function LoadLevel(level){
        map = game.add.tilemap('map2');

        layers.forEach(function(currLayer, L, Layers){
            currLayer.kill();
        })

        map.addTilesetImage('tileset');
        layers[0] = map.createLayer('Tile Layer 1');
        layers[1] = map.createLayer('Tile Layer 2');
        map.setCollision(4,true,layers[0]);
        layers[0].resizeWorld();

        //make the second layer invisible
        layers[1].visible = false;
    }


}