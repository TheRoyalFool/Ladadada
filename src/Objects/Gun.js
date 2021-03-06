Gun = function(game ,fireRate, reloadSpeed, clipSize, Dpb, x, y, img, type){
    Phaser.Sprite.call(this, game, x, y, img);

    //constants for each gun
    this.fireRate = fireRate;
    this.reloadSpeed = reloadSpeed;
    this.clipSize = clipSize;
    //damage per bullet
    this.Dpb = Dpb;
    this.type = type;

    //creates a bullet group for the player and a variable for timing
    this.bullets = game.add.group();
    for(var i = 0; i < this.clipSize; i++){
        //create a new bullet and add it to the bullets group
        this.bullet = new Bullet(this.game, this.x, this.y, 'bull', 300, this.dpb);
        this.bullets.add(this.bullet);

        this.bullet.kill();
    }

    this.lastFired = 0;

    //update variables for gun firing and reloading
    this.reloadTimer = 0;
    this.currClip = this.clipSize;
    this.reloading = false;

    this.cursors = this.game.input.keyboard.createCursorKeys();

}

Gun.prototype = Object.create(Phaser.Sprite.prototype);
Gun.prototype.constructor = Gun;

Gun.prototype.update = function(){


    if(this.cursors.left.isDown || this.cursors.up.isDown || this.cursors.right.isDown || this.cursors.down.isDown){
        //check for the mouse click, if the player can firing and if the player is reloading
        if (this.lastFired < this.game.time.now && this.reloading == false)
        {
            //allows the enemy to fire once every 10 seconds
            if(this.lastFired < this.game.time.totalElapsedSeconds() && this.currClip > 0) {

                var dir;
                var bx = this.x;
                var by = this.y;
                var bxmin,bxmax,bymin,bymax = 0;

                if(this.cursors.left.isDown){
                    dir = 'left';
                    bxmin = this.x - 30;
                    bxmax = bxmin - 60;
                    bymin = this.y - 30;
                    bymax = bymin + 60;
                }
                else if(this.cursors.up.isDown){
                    dir = 'up';
                    bxmin = this.x - 30;
                    bxmax = bxmin + 60;
                    bymin = this.y - 30;
                    bymax = bymin - 50;
                }
                else if(this.cursors.right.isDown){
                    dir = 'right';
                    bxmin = this.x + 30;
                    bxmax = bxmin + 50;
                    bymin = this.y - 30;
                    bymax = bymin + 50;
                }
                else if(this.cursors.down.isDown){
                    dir = 'down';
                    bxmin = this.x - 30;
                    bxmax = bxmin + 60;
                    bymin = this.y + 30;
                    bymax = bymin + 60;
                }

                var bullet;

                if(this.type == 'Buckshot'){
                    for(var t = 0; t < 6; t += 1){
                        bullet = this.bullets.getFirstDead();
                        if(bullet != null) {
                            bullet.revive();
                            bullet.reset(this.x, this.y);
                            by = Math.random() * (bymax - bymin) + bymin;
                            bx = Math.random() * (bxmax - bxmin) + bxmin;

                            console.log(by + ' ' + bx);
                            this.Buckshotfire(bx, by, bullet);
                        }
                    }
                } else{

                    bullet = this.bullets.getFirstDead();

                    if(bullet != null){
                        bullet.revive();
                        bullet.reset(this.x,this.y);
                        bullet.PlayerFire(dir);
                    }
                }

                //take one bullet away from the current clip
                this.currClip -= 1;

                //reset last fired
                this.lastFired = this.game.time.totalElapsedSeconds() + this.fireRate;
            } else if(this.currClip == 0){
                this.Reload();
            }
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

    Gun.prototype.Buckshotfire = function(x,y,bullet){
    this.game.physics.arcade.moveToXY(bullet, x, y, bullet.speed);
}
