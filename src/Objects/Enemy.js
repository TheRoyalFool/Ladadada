Enemy = function(game, x, y, img, speed, type, jumpHeight){
    Phaser.Sprite.call(this, game, x, y, img);

    this.enemyImage = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.jumpHeight = jumpHeight;
    game.load.image('bull', 'assets/bullet');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //enemy bullet group declaration
    this.bullets = game.add.group();
    this.bullet = new Bullet(game, this.x, this.y, img, 300, 'right');
    this.lastFired = 0;

    //enemy sight sprite for seeing player
    this.sight = game.add.sprite(0, 0, null);
    game.physics.enable(this.sight, Phaser.Physics.ARCADE);
    this.sight.body.gravity = -game.physics.gravity;
    this.sight.body.setSize(500,64);
    this.addChild(this.sight);

    //variables for following the player
    this.followingPlayer = false;
    this.followTime = 0;

    //set up the position of the sight sprite
    this.sight.x = 0 - (this.sight.body.width / 2) + (this.body.width/2);
    //set up the position of the sight sprite
    //this.sight.y = 0 - (this.sight.body.height / 2);// + (this.body.height/2);

    if(this.type == "flying"){
        this.sight.body.setSize(300,300);
        //this.body.gravity  = -this.game.physics.gravity;
        this.y  = this.y - this.body.height*2;

    } else if(this.type == "shooter"){

    } else if(this.type == "melee"){

    } else if(this.type == "exploding"){

    }


    //set up the position of the sight sprite
    this.sight.x = 0 - (this.sight.body.width / 2) + (this.body.width/2);
    //set up the position of the sight sprite
    this.sight.y = 0 - (this.sight.body.height / 2) + (this.body.height/2);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){

    this.body.x.velocity = -100;

    //update follow time
    if(this.followTime < this.game.time.totalElapsedSeconds()){
        this.followingPlayer = false;
    }


}

Enemy.prototype.Fire = function(dir){

    //allows the enemy to fire once every 10 seconds
    if(this.lastFired < this.game.time.totalElapsedSeconds()) {

        //use the dir variable to fire the bullet in the right direction
        this.bullet = new Bullet(this.game, this.x + this.body.width / 2, this.y + this.body.height / 2, 'bull', 300, dir);
        this.bullets.add(this.bullet);

        //reset last fired
        this.lastFired = this.game.time.totalElapsedSeconds() + 1;
    }

}

//follows the player using the position given
Enemy.prototype.followPlayer = function(player) {

    if (this.type == "melee") {

        if (player.x < this.x) {
            this.body.velocity.x = -this.speed;
        } else if (player.x > this.x) {
            this.body.velocity.x = this.speed;
        }

        //jumps if enemy hits a wall
        if (this.body.onWall() && this.jumpHeight != null) {
            this.body.velocity.y = -this.jumpHeight;
        }
    } else if (this.type == "flying"){

        this.game.physics.arcade.moveToObject(this, player, this.speed);
        console.log("follow player");

    }
}

