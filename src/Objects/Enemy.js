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

    this.sight = game.add.sprite(this.x, this.y, null);
    game.physics.enable(this.sight, Phaser.Physics.ARCADE);
    this.sight.body.gravity = -game.physics.gravity;
    this.sight.body.setSize(500,64);
   // this.rectD = new Phaser.Rectangle(this.sight.x, this.sight.y, this.sight.body.width, this.sight.body.height);

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){

    //check for the mouse click
    if (this.game.input.mousePointer.isDown && this.alive == true) {
        //this.bullet = new Bullet(this.game, this.x + this.body.width/2, this.y + this.body.height/2, 'bull', 300, 'right');
        //this.bullets.add(this.bullet);
    }

    this.sight.x = this.x - (this.sight.body.width / 2) + (this.body.width/2);
    this.sight.y = this.y;

    //this.rectD.x = this.sight.x;
    //this.rectD.y = this.sight.y;

    //this.rectD.width = this.sight.body.width;
    //this.rectD.height = this.sight.body.height;
}

Enemy.prototype.Fire = function(){
    this.bullet = new Bullet(this.game, this.x + this.body.width/2, this.y + this.body.height/2, 'bull', 300, 'right');
    this.bullets.add(this.bullet);
}
