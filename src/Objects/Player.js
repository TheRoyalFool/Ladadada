Player = function(game, x, y, img, speed, jumpHeight) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.playerImg = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.jumpHeight = jumpHeight;
    this.dir = 'right';

    this.health = 100;

    game.load.image('bull', 'assets/bullet');

    //add the player to the physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the player some physics values and dont allow him to exit the screen
    this.body.collideWorldBounds = true;
    this.body.setSize(64 ,64);

    //sets up sprite for players melee skill
    this.meleeRange = game.add.sprite(this.body.width/2 - 80, y, null);
    game.physics.enable(this.meleeRange);
    this.meleeRange.body.gravity = -game.physics.gravity;
    this.meleeRange.body.setSize(160,64);
    this.addChild(this.meleeRange);

    this.minorAbillityTag = "";
    this.majorAbillityTag = "";

    //double jump ability variables
    this.doubleJump = true;
    this.jumps = 0;
    this.jumpsTimer = 0;

    //sliding ability variables
    this.slide = true;
    this.canSlide = false;
    this.slideCooldown = 0;


    this.majorAbility = game.add.sprite(0, 0, null);
    this.minorAbility = game.add.sprite(0, 0, null);

    this.addChild(this.majorAbility);
    this.addChild(this.minorAbility);

    //set up the players gun
    this.ChangeGun("Hail");

    //variables for movement keys
    this.LeftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.RightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.UpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.DownKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

    this.onLadder = false;



}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){


    //player movement and sliding ability
    if(this.LeftKey.isDown){

        this.dir = 'left';
        this.body.velocity.x = -this.speed;

        //when the player can slide he will slide for 250 millie seconds
        if(this.canSlide == true && this.LeftKey.timeDown+250 > this.game.time.now){

            //reset the slideCooldown variable
            this.slideCooldown  = this.game.time.totalElapsedSeconds() + 3;

            //make the player move 3x faster whilst hes sliding
            this.body.velocity.x = -this.speed*3;
        } else {
            //when the player has been holding the key for 250 millie seconds reset the canSlide variable
            this.canSlide = false;
        }


      //this all does the same as above for the opposite key
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

        //when the player is not pressing any movement key then stop the player
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


    if(this.doubleJump == true && this.jumps < 2 && this.jumpsTimer <= this.game.time.now){
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
            this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
            this.body.velocity.y = -this.jumpHeight;
            this.jumps = 2;
            console.log("2 jumps");
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

    //player crouching
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.S)){
        this.body.setSize(64 ,32 , 0, 32);
        this.loadTexture('playercrouched');
    } else if(this.game.input.keyboard.justReleased(Phaser.Keyboard.S)){
        this.body.setSize(64 ,64, 0, 0);
        this.loadTexture(this.playerImg);
    }

    //cap the falling speed of the player
    if(this.body.velocity.y > 1000){
        this.body.velocity.y = 1000;
    }

    //update the players gun
    this.playerGun.update(this.x + this.body.width / 2,  this.y + this.body.height / 2);

    this.AbilityBehaviours();

}

//function for changing the players gun
Player.prototype.ChangeGun = function(gun){
    switch(gun){
        case "Hail":
            this.playerGun = new Gun(this.game, 0.1, 3, 10, 1);
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

