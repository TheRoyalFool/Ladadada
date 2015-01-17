Enemy = function(game, x, y, img, speed, type, jumpHeight, dps){
    Phaser.Sprite.call(this, game, x, y, img);

    this.enemyImage = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.jumpHeight = jumpHeight;
    this.dps = dps;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    //enemy bullet group declaration
    this.bullets = game.add.group();
    this.bullet = new Bullet(game, this.x, this.y, img, 300, 'right');
    //Enemy attack timer variables
    this.lastAttack = 0;
    this.canAttack = true;

    //enemy sight sprite for seeing player
    this.sight = game.add.sprite(x, y, null);
    game.physics.enable(this.sight, Phaser.Physics.ARCADE);
    this.sight.body.gravity = -game.physics.gravity;
    this.sight.body.setSize(500,64);
    this.addChild(this.sight);
    this.seesPlayer = false;

    //variables for following the player
    this.followingPlayer = false;
    this.followTime = 0;

    //set up the position of the sight sprite
    this.sight.x = 0 - (this.sight.body.width / 2) + (this.body.width/2);

    //set up diffrent variables for diffrent enemy types
    if(this.type == "flying"){
        this.sight.body.setSize(300,300);
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

    //update follow time
    if(this.followTime < this.game.time.totalElapsedSeconds()){
        this.followingPlayer = false;
        this.body.velocity.x = 0;
    }

    //allows the enemy to fire once every x seconds
    if(this.lastAttack < this.game.time.totalElapsedSeconds()) {
        this.canAttack = true;
        this.lastAttack = this.game.time.totalElapsedSeconds() + 1;
    } else {
        this.canAttack = false;
    }
}

Enemy.prototype.Fire = function(dir){

    //allows the enemy to fire once every x seconds
    if(this.canAttack == true) {

        //use the dir variable to fire the bullet in the right direction
        this.bullet = new Bullet(this.game, this.x + this.body.width / 2, this.y + this.body.height / 2, 'bull', 300, dir, this.dps);
        this.bullets.add(this.bullet);

        //reset last fired
        this.lastAttack = this.game.time.totalElapsedSeconds() + 1;
    }

}

//follows the player using the position given
Enemy.prototype.followPlayer = function(player) {

    //movement for each enemy type
    if (this.type == "flying"){

        //move the enemy to the players current x and y position
        this.game.physics.arcade.moveToXY(this, player.x + player.body.width/2, player.y + player.body.height/2, this.speed);

    } else if(this.type == "shooter"){

        //move away from the player if he is within range
        if(player.x > this.x){
            this.body.velocity.x = -this.speed;
        } else if(player.x < this.x){
            this.body.velocity.x = this.speed;
        }

        //this moves the enemy to a safe shooting distance
        if((player.x + player.body.width) > this.sight.world.x && (player.x + player.body.width) < this.sight.world.x + 10){
            this.body.velocity.x = 0;
        } else if(player.x < (this.sight.world.x + this.sight.body.width) && player.x > this.sight.world.x + this.sight.body.width - 10){
            this.body.velocity.x = 0;
        }
    }
    else if (this.type == "melee" || this.type == "exploding") {

        //this moves the enemy towards the player if he can see him
        if (player.x < this.x) {
            this.body.velocity.x = -this.speed;
        } else if (player.x > this.x) {
            this.body.velocity.x = this.speed;
        }

        //jump if he hits a wall
        if (this.body.onWall() && this.jumpHeight != null) {
            this.body.velocity.y = -this.jumpHeight;
        }
    }
}

Enemy.prototype.SightBehaviour = function(player){

    if(this.type == "flying"){

    }
    else if(this.type == "shooter"){

        //if the player is to the left of the enemy fire left and the same for right
        if(player.x < this.x) {
           this.Fire('left');
        }
        if(player.x > this.x){
           this.Fire('right');
        }

    } else if(this.type == "melee"){

    } else if(this.type == "exploding"){

    }

    //player is set to follow the player for a set ammount of time
    this.followingPlayer = true;
    this.followTime = this.game.time.totalElapsedSeconds() + 5;

}

Enemy.prototype.CollideBehaviour = function(player){

    //if the player collides with a melee or flying type enemy then he takes damage
    if(this.type == "melee" || this.type == "flying"){
        if(this.canAttack == true){
            player.damage(this.dps);
            this.lastAttack = this.game.time.totalElapsedSeconds() + 1;
        }
    //if the player collides with an exploding enemy then he takes damage and kill the enemy
    } else if(this.type == "exploding"){
            player.damage(this.dps);
            this.kill();
    }
}
