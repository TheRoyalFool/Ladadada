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

    this.minorAbillity = "";
    this.majorAbillity = "";
    this.ability = this.ability = game.add.sprite(0, 0, null);

    if(this.majorAbillity == "Flare"){
        //sets up one ability sprite and the animation
        this.ability = game.add.sprite(0, 0, 'flare');
        this.abilityAnim = this.ability.animations.add('flare');
    }
    this.addChild(this.ability);
    this.ability.visible = false;

    this.ChangeGun("Hail");
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){

    //check that the current major ability has an animation
    if(this.abilityAnim != null){
        //checks if the f key has been pressed and plays the ability animation if it has been
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.F)){
            this.ability.animations.play('flare', 8, false);
            this.ability.visible = true;
        }

        //checks if the ability animation is over to make it invisible again
        if(this.abilityAnim.isFinished == true){
            this.ability.visible = false;
        }
    }

    //player movement
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
        this.body.velocity.x = -this.speed;
        this.dir = 'left';
    } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
        this.body.velocity.x = this.speed;
        this.dir = 'right';
    } else {
        this.body.velocity.x = 0;
    }

    //player jumping
    if(this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
        this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.body.velocity.y = -this.jumpHeight;
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


    this.playerGun.update(this.x + this.body.width / 2,  this.y + this.body.height / 2);
}

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
