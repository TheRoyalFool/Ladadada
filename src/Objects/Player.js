Player = function(game, x, y, img, speed, jumpHeight) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.playerImg = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.jumpHeight = jumpHeight;
    this.dir = 'right';

    //changing players starting health from 0 to 100
    this.health = 100;

    //'this' refers to the player, and this code is adding him to the games physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the player some physics values and dont allow him to exit the screen
    this.body.collideWorldBounds = true;
    this.body.setSize(64 ,64);

    //sets up sprite for players melee skill
    this.meleeRange = game.add.sprite(this.body.width/2 - 80, y, null);
    game.physics.enable(this.meleeRange);
    this.meleeRange.body.gravity = -game.physics.gravity; //so the meleeRange body does not fall out of the world
    this.meleeRange.body.setSize(160,64);
    this.addChild(this.meleeRange); //adds melee range to the player DisplayContainer

    //dont know if this is still going to be used
    this.minorAbillityTag = "";
    this.majorAbillityTag = "";


    //double jump ability variables
    this.doubleJump = true; //this stores if the player has the double jump ability
    this.jumps = 0; //how many times has the player jumped
    this.jumpsTimer = 0; //when was the last time the player hit the jump key

    //sliding ability variables
    this.slide = true; //does the player have the slide ability
    this.canSlide = false;
    this.slideCooldown = 0;

    //dont know about this either, still to be completed
    this.majorAbility = game.add.sprite(0, 0, null);
    this.minorAbility = game.add.sprite(0, 0, null);
    this.addChild(this.majorAbility);
    this.addChild(this.minorAbility);
    //till here

    /*
     *  When using a variable to store the current player gun it was constantly updating it
     *  which was bugging the update function. We decided to use this function to update the
     *  players gun.
    */
    this.ChangeGun("Hail");

    this.LeftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.RightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.UpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.DownKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

    //variable that stores if the player is currently hitting a ladder
    this.onLadder = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){

    /*
     * Using the players direction call the right slide direction.
     * This allows the player to dash quickly to one side every 3 seconds
     * once he double taps one of the movement keys.
     * Also this handles the players basic movement :)
     */
    if(this.LeftKey.isDown){

        this.dir = 'left';
        this.body.velocity.x = -this.speed;
        if(this.canSlide == true && this.LeftKey.timeDown+250 > this.game.time.now){
            this.slideCooldown  = this.game.time.totalElapsedSeconds() + 3;
            this.body.velocity.x = -this.speed*3;
        } else {
            this.canSlide = false;
        }

    } else if(this.RightKey.isDown){

        this.dir = 'right';
        this.body.velocity.x = this.speed;
        if(this.canSlide == true && (this.RightKey.timeDown+250) > this.game.time.now){
            this.slideCooldown = this.game.time.totalElapsedSeconds() + 3;
            this.body.velocity.x = this.speed*3;
        } else{
            this.canSlide = false;
        }

    } else {

        this.body.velocity.x = 0;

    }

    if(this.onLadder == true){
        if(this.UpKey.isDown){
            this.body.velocity.y = -this.speed;
        }
        if(this.DownKey.isDown){
            this.body.velocity.y = this.speed;
        }

        if(this.body.velocity.y < -this.speed){
            this.body.velocity.y = -this.speed
        }
    }

    //handles everything about sliding
    SlidingUpdate();

    //This allows the player to jump for a second time whilst in the air
    if(this.doubleJump == true && this.jumps < 2 && this.jumpsTimer <= this.game.time.now){
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
            this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
            this.body.velocity.y = -this.jumpHeight;
            this.jumps = 2;
        }
    }

    //player jumping
    if(this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
        this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.body.velocity.y = -this.jumpHeight;
        this.jumps = 1;
        //if the jumping the undesirable then change it so the player can only jump a second time whilst his velocity is > 0
        this.jumpsTimer = this.game.time.now + 500;
    }

    if(this.body.onFloor()){
        this.jumps = 0;
    }

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.S)){
        this.body.setSize(64 ,32 , 0, 32);
        this.loadTexture('playercrouched');
    } else if(this.game.input.keyboard.justReleased(Phaser.Keyboard.S)){
        this.body.setSize(64 ,64, 0, 0);
        this.loadTexture(this.playerImg);
    }

    this.body.maxVelocity.y = 1000;

    //update the players gun
    this.playerGun.update();

    this.AbilityBehaviours();


    var deltaX = this.game.input.activePointer.worldX - this.x;
    var deltaY = this.game.input.activePointer.worldY - this.y;
    var angle = Math.atan2(deltaX, deltaY) * 180 / Math.PI; // Convert to radians

    this.playerGun.x = this.x;
    this.playerGun.y = this.y;
    this.playerGun.pivot.x = -50;
    this.playerGun.pivot.y = -50;

    this.game.debug.text(angle, 10,20);

    this.playerGun.angle = angle - 360;

}

//function for changing the players gun
Player.prototype.ChangeGun = function(gun){
    switch(gun){
        case "Hail":
            this.playerGun = new Gun(this.game, 0.1, 3, 10, 1,0,0,'bull');
            break;
        case "Buckshot":
            this.playerGun = new Gun(this.game, 0.1, 3, 30, 1);
            break;
        case "Bullseye":
            this.playerGun = new Gun(this.game, 0.1, 3, 30, 1);
            break;
        case "Potshot":
            this.playerGun = new Gun(this.game, 3, 3, 30, 1);
            break;
    }
}

Player.prototype.ChangeAbility = function(){

    if(this.majorAbillityTag == "Flare"){
        //sets up one ability sprite and the animation
        this.majorAbility = this.game.add.sprite(0, 0, 'flare');
        this.majorAbilityAnim = this.majorAbility.animations.add('flare');
        this.majorAbility.visible = false;
    }
}


Player.prototype.AbilityBehaviours = function(){

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.E)){

    }

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        //check that the current major ability has an animation
        if(this.majorAbilityAnim != null){

            this.majorAbility.animations.play('flare', 8, false);
            this.majorAbility.visible = true;

            if(this.majorAbilityAnim.isFinished == true){
                this.majorAbility.visible = false;
            }
        }

    }



    if(this.slide === true){

    }
}



function SlidingUpdate(){
    //this keeps the canSlide variable false while the slideCooldown is active
    if(this.slideCooldown > this.game.time.totalElapsedSeconds() && this.RightKey.isUp && this.dir == 'right' ||
        this.slideCooldown > this.game.time.totalElapsedSeconds() && this.LeftKey.isUp && this.dir == 'left'){
        this.canSlide = false;
    }

    //whilst the slide abillity variable is active and the slideCooldown is not active
    if(this.slide == true && this.slideCooldown < this.game.time.totalElapsedSeconds()){

        /*
         These two statements are timed to check 2 separate key events
         - KeyDown
         - KeyUp
         the player has 100 millie seconds to hit the right of left key twice
         this code paired with the movement code above allows the player to slide.
         */

        if((this.RightKey.timeDown+100) > this.game.time.now){
            if((this.RightKey.timeUp+100) > this.game.time.now){
                console.log("can slide");
                this.canSlide = true;
            }
        }
        if(this.LeftKey.timeDown+100 > this.game.time.now){
            if(this.LeftKey.timeUp+100 > this.game.time.now){
                console.log("can slide");
                this.canSlide = true;
            }
        }
    }

}

