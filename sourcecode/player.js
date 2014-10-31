player = function(game, x, y, rot, img){
    Phaser.Sprite.call(this, game, x, y, img);
    this.img = img;
    this.rote = rot;
    this.x = x;
}

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;

player.prototype.update = function(){
    this.angle += this.rote;
    this.MovePlayer();

}

player.prototype.MovePlayer = function(){
    this.x += 1;
}
