window.onload = function(){

    var game = new Phaser.Game(800,600,Phaser.AUTO, 'container',
        {preload: preload, create: create, update: update});

    var Player;
    function preload(){
        game.load.image('Happy', 'assets/Happy.png');
    }

    function create(){
        Player = new player(game, 100, 100, 1, 'Happy');
        Player.anchor.setTo(0.5,0.5);
        game.add.existing(Player);
    }

    function update() {

    }
}