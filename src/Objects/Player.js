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

    this.animations.add('idle',[0,1,2,3,4,5,6,7], 8, true);
    this.animations.add('move',[8,9,10,11,12,13,14,15], 8, true);
    this.animations.add('slide',[16,17,18,19,20,21,22], 7);
    this.animations.add('crouch',[24,25,26,27,28,29,30,31], 14, false);

    //'this' refers to the player, and this code is adding him to the games physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the player some physics values and dont allow him to exit the screen
    this.body.collideWorldBounds = true;
    this.body.setSize(64 ,64);

    this.anchor.setTo(.5,.5);

    //sets up sprite for players melee skill
    this.meleeRange = game.add.sprite(0, 0, null);
    this.meleeRange.anchor.setTo(.5,.5);
    game.physics.enable(this.meleeRange);
    this.meleeRange.body.gravity = -game.physics.gravity; //so the meleeRange body does not fall out of the world
    this.meleeRange.body.setSize(160,64);
    this.addChild(this.meleeRange); //adds melee range to the player DisplayContainer

    //double jump ability variables
    this.doubleJump = false; //this stores if the player has the double jump ability
    this.jumps = 0; //how many times has the player jumped
    this.jumpsTimer = 0; //when was the last time the player hit the jump key

    //sliding ability variables
    this.slide = false; //does the player have the slide ability
    this.canSlide = false;
    this.slideCooldown = 0;

    //dont know if this is still going to be used
    this.offensiveAbilityTag = "Infect";
    this.defensiveAbilityTag = "";

    this.offensiveAbility = game.add.sprite(0, 0, null);
    this.defensiveAbility = game.add.sprite(0, 0, null);
    this.addChild(this.defensiveAbility);
    this.addChild(this.offensiveAbility);

    this.offensiveCD = false;
    this.defensiveCD = false;

    this.offensiveAbilityActive = false;

    this.ChangeOffensiveAbility();

    this.body.maxVelocity.y = 800;

    /*
     *  When using a variable to store the current player gun it was constantly updating it
     *  which was bugging the update function. We decided to use this function to update the
     *  players gun.
    */
    this.playerGun = new Gun(this.game, 0.1, 3, 10, 1,0,0,'bull');
    this.ChangeGun("Potshot");


    this.LeftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.RightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.UpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.DownKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

    this.offensiveKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.defensiveKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);

    //variable that stores if the player is currently hitting a ladder
    this.onLadder = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){

    if(this.animations.currentAnim.name != 'crouch')
        this.animations.play('idle');

    /*
     * Using the players direction call the right slide direction.
     * This allows the player to dash quickly to one side every 3 seconds
     * once he double taps one of the movement keys.
     * Also this handles the players basic movement :)
     */

    if(this.LeftKey.isDown){

        if(this.animations.currentAnim != 'slide')
            this.animations.play('move');

        this.dir = 'left';
        this.body.velocity.x = -this.speed;
        this.scale.x = -1;
        this.scale.y = 1;
        if(this.canSlide == true && this.LeftKey.timeDown+250 > this.game.time.now && this.slide == true){
            this.slideCooldown  = this.game.time.totalElapsedSeconds() + 3;
            this.body.velocity.x = -this.speed*3;
            this.animations.play('slide');

        } else {
            this.canSlide = false;
        }

    } else if(this.RightKey.isDown){
        if(this.animations.currentAnim != 'slide')
            this.animations.play('move');

        this.dir = 'right';
        this.body.velocity.x = this.speed;
        this.scale.x = 1;
        this.scale.y = 1;
        if(this.canSlide == true && (this.RightKey.timeDown+250) > this.game.time.now && this.slide == true){
            this.slideCooldown = this.game.time.totalElapsedSeconds() + 3;
            this.body.velocity.x = this.speed*3;
            this.animations.play('slide');

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
    this.SlidingUpdate();

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
       // this.body.setSize(20 ,32, 0, 32);
       this.animations.frame = 31;

        } else if(this.game.input.keyboard.justReleased(Phaser.Keyboard.S)){
        this.body.setSize(64 ,64, 0, 0);
        this.animations.play('idle');
    }

    this.playerGun.update();
    this.playerGun.x = this.x;
    this.playerGun.y = this.y;

    this.AbilityBehaviours();

}

//function for changing the players gun
Player.prototype.ChangeGun = function(gun){


    switch(gun){
        case "Hail":
            this.playerGun = new Gun(this.game, 0.1, 3, 10, 1,0,0,'bull', 'Hail');
            break;
        case "Buckshot":
            this.playerGun = new Gun(this.game, 1.5, 3, 5, 3,0,0,'bull','Buckshot');
            break;
        case "Bullseye":
            this.playerGun = new Gun(this.game, 3, 2, 5, 5,0,0,'bull','Bullseye');
            break;
        case "Potshot":
            this.playerGun = new Gun(this.game, 0.5, 2, 12, 99,0,0,'bull','Potshot');
            break;
    }
    this.playerGun.anchor.setTo(.5,.5);
}

Player.prototype.ChangeOffensiveAbility = function(){

    this.removeChild(this.offensiveAbility);
    this.offensiveAbility.destroy();

    if(this.offensiveAbilityTag == "Flare"){
        //sets up one ability sprite and the animation
        this.offensiveAbility = this.game.add.sprite(0, 0, 'flare');
        this.offensiveAbility.anchor.setTo(.5,.5);
        this.offensiveAbilityAnim = this.offensiveAbility.animations.add('flare');
        this.offensiveAbility.visible = false;
        this.addChild(this.offensiveAbility);

    } else if(this.offensiveAbilityTag == 'Powershot'){
        this.offensiveAbility = this.game.add.sprite(0, 0, null);

    } else if(this.offensiveAbilityTag == 'Infect'){
        this.offensiveAbility = this.game.add.sprite(0, 0, null);
    }
}

var CDTimer;

Player.prototype.AbilityBehaviours = function(){



    if(this.offensiveKey.isDown == true){
        if(this.offensiveAbilityTag == 'Flare'){
            //check that the current major ability has an animation
            if(this.offensiveAbilityAnim != null){

                this.offensiveAbility.animations.play('flare', 8, false);
                this.offensiveAbility.visible = true;
            }
        } else if(this.offensiveAbilityTag == 'Powershot' && this.offensiveCD == false){
            this.offensiveAbilityActive = true;
            CDTimer = this.game.time.totalElapsedSeconds() + 5;
        } else if(this.offensiveAbilityTag == 'Infect' && this.offensiveCD == false){
            this.offensiveAbilityActive = true;
            CDTimer = this.game.time.totalElapsedSeconds() + 5;
        }
    }

    if(this.offensiveAbilityAnim != null)
        if(this.offensiveAbilityAnim.isFinished == true && this.offensiveAbilityTag == 'Flare'){
            this.offensiveAbility.visible = false;
        }

    if(CDTimer > this.game.time.totalElapsedSeconds()){
        this.offensiveCD = true;
    } else {
        this.offensiveCD = false;
    }

}



Player.prototype.SlidingUpdate = function(){
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
                this.canSlide = true;
            }
        }
        if(this.LeftKey.timeDown+100 > this.game.time.now){
            if(this.LeftKey.timeUp+100 > this.game.time.now){
                this.canSlide = true;
            }
        }
    }

}

