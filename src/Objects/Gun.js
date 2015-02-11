Gun = function(game ,fireRate, reloadSpeed, clipSize, Dpb, x, y, img){
    Phaser.Sprite.call(this, game, x, y, img);

    //constants for each gun
    this.fireRate = fireRate;
    this.reloadSpeed = reloadSpeed;
    this.clipSize = clipSize;
    //damage per bullet
    this.Dpb = Dpb;

    //creates a bullet group for the player and a variable for timing
    this.bullets = game.add.group();
    this.lastFired = 0;

    //update variables for gun firing and reloading
    this.reloadTimer = 0;
    this.currClip = this.clipSize;
    this.reloading = false;
}

Gun.prototype = Object.create(Phaser.Sprite.prototype);
Gun.prototype.constructor = Gun;

Gun.prototype.update = function(){

    //check for the mouse click, if the player can firing and if the player is reloading
    if (this.game.input.activePointer.isDown && this.lastFired < this.game.time.now && this.reloading == false)
    {
        //allows the enemy to fire once every 10 seconds
        if(this.lastFired < this.game.time.totalElapsedSeconds() && this.currClip > 0) {

            //create a new bullet and add it to the bullets group
            this.bullet = new Bullet(this.game, this.x, this.y, 'bull', 300);
            this.bullets.add(this.bullet);

            //take one bullet away from the current clip
            this.currClip -= 1;

            //reset last fired
            this.lastFired = this.game.time.totalElapsedSeconds() + this.fireRate;

            //if the player tries to reload and the current clips is at 0 then reload
        } else if(this.currClip == 0){
            this.Reload();
        }
    }

    //call reload when R is pressed
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.R)){
        this.Reload();
    }

    //if the player is done reloading and he is currently reloading
    if(this.reloadTimer < this.game.time.totalElapsedSeconds() && this.reloading == true){
        //reset the gun clip and set reloading to false
        this.currClip = this.clipSize;
        this.reloading = false;
    }
}

//reload function sets reload to true and set up the reload timer
Gun.prototype.Reload = function(){
    this.reloading = true;
    this.reloadTimer = this.game.time.totalElapsedSeconds() + this.reloadSpeed;
}

