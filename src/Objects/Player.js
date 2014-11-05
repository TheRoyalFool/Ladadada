Player = function(game, x, y, img, speed, jumpHeight, bulletDelay) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.playerImg = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.jumpHeight = jumpHeight;
    this.dir = 'right';
    this.bulletDelay = bulletDelay;
    this.health = 100;

    //add the player to the physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the player some physics values and dont allow him to exit the screen
    this.body.collideWorldBounds = true;
    this.body.setSize(64 ,64);

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){

    //player movement
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
        this.body.velocity.x = -this.speed;
        this.dir = 'left';
    } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
        this.body.velocity.x = this.speed;
        this.dir = 'right';
    } else {
        this.body.velocity.x = 0;
    }

    //player jumping
    if(this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
        this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.body.velocity.y = -this.jumpHeight;
    }

    //console.log(this.body.velocity.y);

    //cap the falling speed of the player
    if(this.body.velocity.y > 1000){
        this.body.velocity.y = 1000;
    }
}