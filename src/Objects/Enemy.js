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

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){

    //set up the position of the sight sprite
    this.sight.x = this.x - (this.sight.body.width / 2) + (this.body.width/2);
    this.sight.y = this.y;
}

Enemy.prototype.Fire = function(dir){

    //use the dir variable to fire the bullet in the right direction
    this.bullet = new Bullet(this.game, this.x + this.body.width/2, this.y + this.body.height/2, 'bull', 300, dir);
    this.bullets.add(this.bullet);
}
