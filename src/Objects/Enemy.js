Enemy = function(game, x, y, img, speed, type){
    Phaser.Sprite.call(this, game, x, y, img);

    this.enemyImage = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    game.load.image('bull', 'assets/bullet');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.bullets = game.add.group();
    this.bullet = new Bullet(game, this.x, this.y, img, 300, 'right');

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){

    //check for the mouse click
    if (this.game.input.mousePointer.isDown) {
        this.bullet = new Bullet(this.game, this.x + this.body.width/2, this.y + this.body.height/2, 'bull', 300, 'right');
        this.bullets.add(this.bullet);

    }

}
