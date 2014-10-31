window.onload = function(){

    var game = new Phaser.Game(1200,800,Phaser.AUTO,'container',
        {preload: preload, create: create, update: update});



    function preload(){
        game.load.image('playerimg','assets/player.PNG');

        game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('level', 'assets/tileset.png');


    }

    var player;
    var layer;
    var map;

    function create(){

        game.stage.backgroundColor = '#123465';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        player = new Player(game, 100, 100, 'playerimg', 1, 10, 0.1);
        game.add.existing(player);

        map = game.add.tilemap('map');

        layer = map.createLayer('Tile Layer 1');

        map.setCollisionBetween(1, 5);

        layer.resizeWorld();

        game.physics.arcade.enable(player);

        //give the player some physics values and dont allow him to exit the screen
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;


        game.camera.follow(player);


    }

    function update(){

    }

}