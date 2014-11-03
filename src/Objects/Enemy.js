Enemy = function(game, x, y, img, speed, type){
    Phaser.Sprite.call(this, game, x, y, img);

    this.enemyImage = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){

}