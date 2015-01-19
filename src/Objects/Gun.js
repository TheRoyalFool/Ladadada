Gun = function(game ,fireRate, reloadSpeed, clipSize, Dpb, x, y){
    Phaser.Sprite.call(this, game, x, y, null);
    this.fireRate = fireRate;
    this.reloadSpeed = reloadSpeed;
    this.clipSize = clipSize;
    this.Dpb = Dpb;

    //creates a bullet group for the player and a variable for timing
    this.bullets = game.add.group();
    this.lastFired = 0;

    this.reloadTimer = 0;
    this.currClip = this.clipSize;
    this.reloading = false;

}

Gun.prototype = Object.create(Phaser.Sprite.prototype);
Gun.prototype.constructor = Gun;

Gun.prototype.update = function(x, y){

    this.x = x;
    this.y = y;

    //check for the mouse click
    if (this.game.input.activePointer.isDown && this.lastFired < this.game.time.now && this.reloading == false)
    {
        //allows the enemy to fire once every 10 seconds
        if(this.lastFired < this.game.time.totalElapsedSeconds() && this.currClip > 0) {

            //use the dir variable to fire the bullet in the right direction
            //this.bullet = new Bullet(this.game, this.x + this.body.width / 2, this.y + this.body.height / 2, 'bull', 300);
            this.bullet = new Bullet(this.game, this.x, this.y, 'bull', 300);
            this.bullets.add(this.bullet);

            this.currClip -= 1;

            //reset last fired
            this.lastFired = this.game.time.totalElapsedSeconds() + this.fireRate;
        } else if(this.currClip == 0){
            this.Reload();
        }
    }

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.R)){
        this.Reload();
    }

    if(this.reloadTimer < this.game.time.totalElapsedSeconds() && this.reloading == true){
        this.currClip = this.clipSize;
        this.reloading = false;
    }
}

Gun.prototype.Reload = function(){
    this.reloading = true;
    this.reloadTimer = this.game.time.totalElapsedSeconds() + this.reloadSpeed;
}

