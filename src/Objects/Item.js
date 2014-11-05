Item = function(game, x, y, img, type){
    Phaser.Sprite.call(this, game, x, y, img);
    this.game = game;
    this.type = type;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function(){

}