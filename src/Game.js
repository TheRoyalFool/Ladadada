window.onload = function(){

    var game = new Phaser.Game(1200,800,Phaser.AUTO,'container',
        {preload: preload, create: create, update: update});

    var player;

    function preload(){
        game.load.image('playerimg','assets/player.PNG');
    }

    function create(){
        player = new Player(game, 100, 100, 'playerimg', 1, 10, 0.1);
        game.add.existing(player);
    }

    function update(){



    }

}