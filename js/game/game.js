Log.logLevel = Log.LEVELS.TRACE;

/**
 * @namespace Blasteroids
 * @property {jQuery} $game the game's <code>Canvas</code> where all the game's drawing occurs
 * @property {jQuery} $gameOver container for the game over splash screen
 * @property {jQuery} $hiScore container for the Hi Scores splash screen
 * @property {jQuery} $level container for the current level
 * @property {jQuery} $lives container for the player's remiaining lives
 * @property {jQuery} $newLevel container for the new level splash screen
 * @property {jQuery} $pointsAdded display for the number of points the player just received
 * @property {jQuery} $scoreAmount display for the player's current score
 * @property {Blasteroids.powerup[]} POWERUP_CONFIGS mixins for powerups that are mixed with {@link Blasteroids.powerup} to create powerups within the game
 * @property {Blasteroids.powerup} activePowerup the currently active powerup within the field of play (only one powerup is active at a time)
 * @property {Blasteroids.wormhole} activeWormhole the currently active wormhole within the field of play (only one wormhole (with a and b ends) is active at a time)
 * @property {number} blasteroidsRemaining the number of blasteroids currently in the field of play
 * @property {number} currentBlastsToFire the number of blasts the player's ship should fire on each trigger press
 * @property {number} earnedLives the number of lives the player has earned this game
 * @property {number} backgroundIndex the index of the game canvas element's current background CSS class
 * @property {number} enemyIndex the index of the enemy ship image to use when spawning enemy ships
 * @property {number} lives the number of lives the player currently has left
 * @property {number} meteorIndex the index of the blasteroid image to use when adding blasteroids to the field of play
 * @property {*} options the current options for the running Blasteroids game instance (see {@link Blasteroids.defaultOptions})
 * @property {number} score the player's current score
 * @property {World} world the current Blasteroids game instance's game world
 */
var Blasteroids = {
    /** Initializes and starts the Blasteroids game. This is the game's entry point.
     *   @example <caption>Starting the Blasteroids game</caption>
     *   //Start the game!
     *   Blasteroids.start({
    *       collisionOutlines: false
    *   });
     */
    start: function (options) {
        this.options = $.extend({}, this.defaultOptions, options);

        //initialize everything
        this.initAudio();
        this.initEvents();
        this.initWorld();
        this.initElements();
        this.initEntities();

        //start spawning enemy ships at random time between ~20 and ~40secs
        setTimeout($.proxy(function () {
            this.spawnEnemyShip();
        }, this), Math.floor(Math.random() * 20000) + 20000);

        //start spawning powerups at random time between ~20 and ~40secs
        setTimeout($.proxy(function () {
            this.spawnPowerup();
        }, this), Math.floor(Math.random() * 20000) + 20000);

        //start spawning wormholes at random time between ~40 and ~60secs
        setTimeout($.proxy(function () {
            this.spawnWormhole();
        }, this), Math.floor(Math.random() * 20000) + 40000);

        //start the game
        this.newGame();
    },

    /**
     * Add a given number of blasteroids to the playing field.
     * @param {number} [numBlasteroids=Blasteroids.options.minBlasteroids] the number of blasteroids to add, defaults to minBlasteroids option value
     * @param {boolean} [randomImg=true] whether or not a random image should be used for the blasteroid
     * @return {number} the number of blasteroids that were actually added
     * @example <caption>Adding more blasteroids at the start of a new level</caption>
     *   newLevel: function(){
    *       //code omitted for brevity
    *
    *       //add more blasteroids
    *       this.blasteroidsRemaining = this.addBlasteroids(this.options.minBlasteroids + this.level - 1);
    *       
    *       //commited for brevity
    *   }
     */
    addBlasteroids: function (numBlasteroids, randomImg) {
        //default to options.minBlasteroids
        numBlasteroids = numBlasteroids || this.options.minBlasteroids;

        //default random image to true
        randomImg = randomImg === undefined ? true : randomImg;

        for (var i = 0; i < numBlasteroids; i++) {
            //?  if randomImg random index from 1 thru metoers length , otherwise +1 to meteorIndex or init to 1;
            this.meteorIndex = Math.min(this.options.meteors.length - 1,
                randomImg ?
                    Math.floor((Math.random() * (this.options.meteors.length - 1)) + 1) :
                    (this.meteorIndex || 0) + 1);

            //create a blasteroid randomly placed in the field of play
            var blasteroid = this.world.createEntity(this.blasteroid, {
                image: 'images/meteors/' + Blasteroids.options.meteors[Blasteroids.meteorIndex],
                x: Math.floor((Math.random() * (Blasteroids.world.maxX() + 1))),
                y: Math.floor((Math.random() * (Blasteroids.world.maxY() + 1)))
            });

            blasteroid.meteorIndex = this.meteorIndex;

            //set the difficulty level by number of shots required to destroy the blasteroid
            blasteroid.shotsToDestroy = this.options.blasteroidShotsToDestroy;

            //set the blasteroids angle of travel and impulse velocity
            blasteroid.$angle(Math.floor((Math.random() * 360)));
            blasteroid.$impulse(Math.floor((Math.random() * (this.options.maxBlasteroidImpulse / this.options.blasteroidImpulseStep))) * this.options.blasteroidImpulseStep);

            Log.info('Initialized ' + numBlasteroids + ' BLASTEROID(S)...');
        }

        return numBlasteroids;
    },

    /**
     * Add a player life.
     * @param {boolean} [earned=false] true if the player earned the life, e.g. by scoring enough points,
     * false if it was given to the player, i.e. during initialization
     * @return {number} the number of lives the player has remaining after the life was added
     * @example <caption>Adding an extra life via a powerup</caption>
     *   $onCollect: function(){
    *       //extra life power up
    *       Blasteroids.addLife(true);
    *   }
     */
    addLife: function (earned) {
        //add a life...
        this.lives += 1;

        //...was it earned?
        if (earned) {
            this.earnedLives += 1;
            Audio.play('sounds/NFF-bonus-02.wav');
        }

        //create new life element
        var $life = $('<li></li>');
        this.$lives.append($life);

        //add element via fadeIn and pulse
        $life.addClass('animated fadeIn');
        setTimeout(function () {
            $life.removeClass('fadeIn')
            earned && $life.addClass('pulse');
        }, 225);

        earned && Log.info('PLAYER gained a life! ' + this.lives + ' remaining...');

        return this.lives;
    },

    /**
     * Add to the player's current score.
     * @param {number} amount the number of points to add to the player's score
     * @example <caption>Adding bonus points via a powerup</caption>
     *   $onCollect: function(){
    *       //mega points reward power up
    *       Blasteroids.addScore(10000);
    *       Log.msg('MEGA POINTS awarded!');
    *   }
     */
    addScore: function (amount) {
        if (amount && $.isNumeric(amount)) {
            //update the score by amount & update the display
            this.incrementScore(Math.round((this.score || 0) + amount), 50);

            //update the display
            this.$pointsAdded.html('+' + amount);

            //add animation effect to the points added display
            setTimeout($.proxy(function () {
                this.$pointsAdded.addClass('fadeOutDown');
            }, this), 3000);

            //reset the points added container after ~6 secs
            setTimeout($.proxy(function () {
                this.$pointsAdded
                    .empty()
                    .removeClass('fadeOutDown');
            }, this), 6000);

            Log.info('PLAYER scored ' + amount + '! New Score: ' + this.score + '!');
        }
    },

    /**
     * Ends the current game. Shows the game over splash screen, updates hi-scores, and resets
     * the player's current number of lives and score both to 0.
     * @example <caption>Ending the game after the player's last life</caption>
     * takeLife: function() {
    *   //code omitted for brevity    
    *
    *   if (this.lives <= 0) {
    *       //game over, if no lives remaining...
    *       this.endGame();
    *   }
    *
    *   //code omitted for brevity
    */
    endGame: function () {
        //show the gameover splash
        Blasteroids.$gameover
            .show()
            .removeClass('zoomOut')
            .addClass('animated zoomIn');

        //update and show hi scores
        this.showHiScores();

        //reset lives and score to 0
        this.lives = 0;
        this.score = 0;

        //play a nifty sound
        Audio.play('sounds/NFF-gameover.wav');
    },

    focusGame: function (e) {
        setTimeout($.proxy(function () {
            this.$game.focus();
        }, this), 500);
    },

    /** Increments the player's current score by an amount, up until a target score, updating the display every so often.
     * @param {number} toAmount the target score to increment up to
     * @param {number} [byAmount=50] the seed amount for incrementing
     * @example <caption>Adding to the player's current score</caption>
     * //update the score by amount & update the display
     * this.incrementScore(Math.round((this.score || 0) + amount), 50);
     */
    incrementScore: function (toAmount, byAmount) {
        if ($.isNumeric(toAmount) && (toAmount > this.score) && (toAmount > 0)) {
            this.score = Math.min(this.score + (byAmount || 50), toAmount);
            this.$scoreAmount.html(this.score);
            this.score < toAmount && setTimeout($.proxy(function () {
                this.incrementScore(toAmount, 2 * byAmount);
            }, this), 125);
        }

        this.$scoreAmount.html(this.score);

        //did we score enough to earn an extra life?
        while (this.score >= ((this.earnedLives + 1) * Blasteroids.options.extraLifeScore)) {
            //if so, add a life
            this.addLife(true);
            Log.info('PLAYER scored another ' + Blasteroids.options.extraLifeScore + ' and earned extra life number ' + this.earnedLives + '!');

            //alert the user
            Log.msg('EXTRA LIFE!');
        }
    },

    /** Initializes Audio aspects of the game, like whether or not sound is on/off. */
    initAudio: function () {
        this.options.soundOn ? Audio.soundOn() : Audio.soundOff();
    },

    /** Initializes the number of blasteroids to the minBlasteroids option value. */
    initBlasteroids: function () {
        this.blasteroidsRemaining = this.addBlasteroids(Blasteroids.options.minBlasteroids);
        Log.info('Playing field initialized with ' + this.blasteroidsRemaining + ' BLASTEROIDS...');
    },

    /** Initializes pointers to various HTML elements used during the game life cycle. */
    initElements: function () {
        var ops = this.options;

        this.$gameover = $(ops.gameoverEl);
        this.$scoreAmount = $(ops.scoreEl);
        this.$pointsAdded = $(ops.pointsAddedEl)
        this.$lives = $(ops.livesEl);
        this.$newLevel = $(ops.newLevelEl);
        this.$level = $(ops.levelEl);
        this.$hiscore = $(ops.hiscoreEl);
    },

    /** Initializes the game entities used during the game life cycle, e.g. blasteroids, powerups, ships, laser blasts, etc.
     *  Defaults to a no-op (see /js/entities.js)
     *  @method
     */
    initEntities: $.noop,

    /** Initializes global game event listeners. */
    initEvents: function () {
        $('[data-tab-contents="#tab__game"]').on('click', $.proxy(function (e) { }, this));

        $('#controlpanel #left__btn').on('click', function (e) {
            Blasteroids.player && Blasteroids.player.$angle(Blasteroids.player.$angle() - Blasteroids.options.angleStep);
        });

        $('#controlpanel #right__btn').bind('click', function (e) {
            Blasteroids.player && Blasteroids.player.$angle(Blasteroids.player.$angle() + Blasteroids.options.angleStep);
        });

        $('#controlpanel #green__btn').bind('click', function (e) {
            Blasteroids.player && Blasteroids.player.$fireThrust();
        });

        $('#controlpanel #red__btn').bind('click', function (e) {
            Blasteroids.player && Blasteroids.player.$fireBlast();
        });

        $('body').keydown(function (e) {
            if (e.keyCode === 27) {
                //esc - escape - quickly eject, exiting the game
                e.preventDefault();
                window.location.href = "https://www.cnn.com";
            }
        });

        $(window).keyup(function (e) {
            if (e.keyCode === 78 /* && Blasteroids.lives <= 0 */) {
                //n - new game if no lives remaining
                Blasteroids.newGame();
            } else if (e.keyCode === 87) {
                //w - change game background
                Blasteroids.backgroundIndex = ((Blasteroids.backgroundIndex || 0) + 1) % Blasteroids.options.backgrounds.length;

                Blasteroids.$game
                    .removeClass(Blasteroids.options.backgrounds.join(' '))
                    .addClass(Blasteroids.options.backgrounds[Blasteroids.backgroundIndex]);
            } else if (e.keyCode >= 49 && e.keyCode <= 53) {
                //number keys 1-5 sets the number of shots needed to destroy a blasteroid
                Blasteroids.options.blasteroidShotsToDestroy = e.keyCode - 48;
                var msg = Blasteroids.options.blasteroidShotsToDestroy + ' shot' + (Blasteroids.options.blasteroidShotsToDestroy > 1 ? 's' : '') + ' to destroy';
                Log.info(msg, true);
            } else if (e.keyCode === 66) {
                //b - create a blasteroid
                Blasteroids.addBlasteroids(1);
            } else if (e.keyCode === 80) {
                //p - change the player's ship
                Blasteroids.shipIndex = BoxBoxUtil.cycleEntityImage(Blasteroids.player, Blasteroids.options, 'ships', Blasteroids.shipIndex);
                Log.msg('Player SHIP changed!');
            } else if (e.keyCode === 76) {
                //l - change the player's ship's laser
                Blasteroids.laserIndex = ((Blasteroids.laserIndex || 0) + 1) % Blasteroids.options.lasers.length;
                Log.msg('Player SHIP LASER changed!');
            } else if (e.keyCode === 77) {
                //m - change the meteor
                Blasteroids.meteorIndex = ((Blasteroids.meteorIndex || 0) + 1) % Blasteroids.options.meteors.length;
                Log.msg('BLASTEROID type changed!');
            } else if (e.keyCode === 69) {
                //e - create an enemy ship
                Blasteroids.spawnEnemyShip();
            } else if (e.keyCode === 82) {
                //r - increase ship radius - experimental
                Blasteroids.player._ops.radius += 0.5;
            } else if (e.keyCode === 83) {
                //s - toggle sound on/off
                Log.msg('Sound is ' + (Audio.toggleSound() ? 'ON!' : 'OFF!'));
            } else if (e.keyCode === 72) {
                //h - create a wormhole
                Blasteroids.spawnWormhole();
            }
        });
    },

    /** Initializes the player's number of lives to the Blasteroids.options.startingLives.  Resets earned lives count to 0. */
    initLives: function () {
        this.lives = 0;
        this.earnedLives = 0;

        //clear out previous game's lives, if any remain
        this.$lives.empty();

        //initialize number of starting lives
        for (var i = 0; i < Blasteroids.options.startingLives; i++) {
            this.addLife();
        }

        Log.info('PLAYER initialized with ' + this.lives + ' lives...');
    },

    /** Initializes a new player ship at the origin. */
    initPlayer: function () {
        var origin = Blasteroids.world.center(),
            radiusMultiplier = 3,
            radius = radiusMultiplier * Blasteroids.options.shipRadius,
            originEntities = Blasteroids.world.find(origin.x - radius, origin.y - radius, origin.x + radius, origin.y + radius);

        //will we spawn with a blasteroid too near?
        if (originEntities.length > 0) {
            //...if so wait to spawn and try again
            setTimeout(function () {
                Blasteroids.initPlayer();
            }, 300);
            return;
        }

        Blasteroids.player = Blasteroids.world.createEntity(Blasteroids.ship, {
            image: 'images/player/' + Blasteroids.options.ships[Blasteroids.shipIndex || 0]
        });
        Blasteroids.player.fireRate = Blasteroids.options.shipFireRate;
        Blasteroids.player.canFireBlast = true;
        Blasteroids.player.$blastsToFire(this.currentBlastsToFire);

        Log.info('PLAYER SHIP initialized...');
    },

    /** Initializes the player's current score to 0 and updates the score display. */
    initScore: function () {
        //initialize the score to 0...
        this.score = 0;

        //...and update the display
        this.$scoreAmount.html(this.score);
    },


    /** Initializes the game world, enhances it, and clears the field of play. */
    initWorld: function () {
        this.$game = $(this.options.el);

        this.focusGame();

        $('[data-tab-contents="#tab__game"]').on('click mouseup keyup', this.focusGame);

        //create the game world
        this.world = boxbox.createWorld(this.$game.get(0), {
            gravity: Blasteroids.options.gravity,
            collisionOutlines: Blasteroids.options.collisionOutlines
        });

        BoxBoxUtil.enhanceWorld(this.world);

        BoxBoxUtil.clearFieldOfPlay(this.world);
    },

    /** Starts a new game, re-initializing blasteroids, player, lives, score, etc.
     * @example <caption>At the start of the game</caption>
     * start: function(options) {
      *     //code omitted for brevity
      *  
      *     //initialize everything
      *     this.initEvents();
      *     this.initWorld();
      *     this.initElements();
      *     this.initEntities();
      *
      *     //start the game
      *     this.newGame();
      * }
     * @example <caption> Pressing 'N' to start a new game</caption>
     * initEvents: function(){
      *     $(window).keyup(function(e) {
      *         if (e.keyCode == 78 && Blasteroids.lives <= 0) {
      *          //n - new game if no lives remaining
      *          Blasteroids.newGame();
      *      }
      *     //code omitted for brevity
      * }
    */
    newGame: function () {
        Log.info('NEW GAME started!');

        //clear the field of play
        BoxBoxUtil.clearFieldOfPlay(Blasteroids.world);

        setTimeout($.proxy(function () {
            //set the starting level
            this.level = Blasteroids.options.startingLevel;

            //initialize blasteroids
            this.initBlasteroids();

            //initialize player ship and lives and the number of blasts the player can fire
            this.currentBlastsToFire = Blasteroids.options.playerBlastsToFire;
            this.initPlayer();
            this.initLives();

            //initialize the player's score
            this.initScore();

            //remove splash screens
            this.$gameover.addClass('zoomOut');
            this.$hiscore.addClass('zoomOut');

            //play a nifty sound
            Audio.play('sounds/NFF-new-game.wav');
        }, this), 225);
    },

    /**
     * Starts a new level.  Shows a level splash screen.  Re-initializes the number of blasteroids remaining.
     * @example <caption>Starting a new level when the last blasteroid is destroyed</caption>
     *  //if no more blasteroids, and we were destroyed by blast, then start a new level
     *  Blasteroids.blasteroidsRemaining <= 0 && this.destroyedByBlast && Blasteroids.newLevel();
     */
    newLevel: function () {
        //show a level splash screen with level number
        this.level += 1;
        this.$level.html(this.level);

        this.$newLevel
            .show()
            .removeClass('zoomOut')
            .addClass('animated zoomIn');

        //play a nifty sound effect 
        Audio.play('sounds/NFF-level-up.wav');

        setTimeout($.proxy(function () {
            //hide the new level splash
            this.$newLevel
                .removeClass('zoomIn')
                .addClass('zoomOut');

            //add more blasteroids
            this.blasteroidsRemaining = this.addBlasteroids(this.options.minBlasteroids + this.level - 1);
            Log.info('PLAYER reached Level ' + this.level + '!');
        }, this), this.options.levelWaitPeriod);
    },

    /** Update and show the hi scores. */
    showHiScores: function () {
        //update the hiscores
        //FIXME make this better
        var $yourScore = $('<li>Y.O.U. - ' + this.score + '</li>')
        if (this.score > 50000) {
            this.$hiscore.prepend($yourScore);
        } else if (this.score > 25000) {
            $yourScore.insertBefore(this.$hiscore.children().eq(2));
        } else if (this.score > 10000) {
            $yourScore.insertBefore(this.$hiscore.children().eq(3));
        } else {
            this.$hiscore.append($yourScore);
        }

        //show the hiscores splash      
        this.$hiscore
            .show()
            .removeClass('zoomOut')
            .addClass('animated zoomIn');
    },

    /**
     * Spawn a new enemy ship at the provided x,y location.  If x, or y is not provided, then a random value is used.
     * @param {number} x the x position to place the enemy ship at, from 0 to the world's max x
     * @param {number} y the y position to place the enemy ship at, from 0 to the world's max y
     * @example <caption>Spawning a new enemy ship after one is destroyed</caption>
     *   onTick: function(){
    *      //this.destroyed === true
    *      if (this.destroyed && !this.exploded){
    *           //code omitted for brevity...
    *
    *           //respawn enemy ship at random time between 20 - 40secs
    *           setTimeout($.proxy(function(){
    *               Blasteroids.spawnEnemyShip();
    *           }, this), Math.floor(Math.random() * 20000) + 20000);
    *
    *           Log.info('ENEMY ship destroyed!');
    *       }
    *   }
     */
    spawnEnemyShip: function (x, y) {
        var position = {
            x: x || Math.floor(Math.random() > .5 ? 0 : Blasteroids.world.maxX()),
            y: y || Math.floor(Math.random() > .5 ? 0 : Blasteroids.world.maxY())
        },
            radiusMultiplier = 3,
            radius = radiusMultiplier * this.options.shipRadius,
            positionEntities = this.world.find(position.x - radius, position.y - radius, position.x + radius, position.y + radius);

        //will we spawn with a blasteroid or player too near?
        if (positionEntities.length > 0) {
            //...if so wait to spawn and try again
            setTimeout($.proxy(function () {
                this.spawnEnemyShip(position.x, position.y);
            }, this), 300);
            return;
        }

        //?
        this.enemyIndex = Math.min(this.options.enemies.length - 1,
            Math.floor((Math.random() * (this.options.enemies.length - 1)) + 1));


        this.enemyShip = this.world.createEntity(this.enemy,
            position, {
            image: 'images/effects/spacewarp.png'
        });

        setTimeout($.proxy(function () {
            !this.enemyShip.destroyed && this.enemyShip.image('images/enemies/' + this.options.enemies[this.enemyIndex || 0]);
        }, this), 225);

        //set the enemy ship's angle of travel and impulse velocity
        this.enemyShip.$angle(Math.floor(Math.random() * 360));
        this.enemyShip.applyImpulse(Math.floor(Math.random() * this.options.maxEnemyImpulse), this.enemyShip.$angle() - 180);

        //randomly fire enemy blast
        this.enemyShip.blastTimeout = setTimeout($.proxy(function () {
            this.enemyShip.$fireBlast();
        }, this), Math.floor(Math.random() * 1000) + 1000);

        //alert the user
        Log.info('ENEMY SHIP initialized...');
        Log.msg('An ENEMY SHIP has appeared!');
    },


    /**
     * Spawn a random powerup at the given x and y coordinates, or a random x-y coordinate in the
     * world's field of play if no x-y coordinate is provided. A powerup gives the player certain
     * abilities and/or rewards when collected. They remain visible for 10 seconds.
     * @param {number} [x] x coordinate for power up to spawn at. Defaults to a random x coordinate in the world's field of play.
     * @param {number} [y] y coordinate for power up to spawn at. Defaults to a random y coordinate in the world's field of play.
     * @example <caption>Spawning a random powerup at a random time</caption>
     *   //spawn powerup at random time between 20 - 40secs
     *   setTimeout(function(){
    *       Blasteroids.spawnPowerup();
    *   }, Math.floor(Math.random() * 20000) + 20000);
     */
    spawnPowerup: function (x, y) {
        if (this.activePowerup) {
            return;
        }

        var position = {
            x: x || Math.floor(Math.random() * this.world.maxX()),
            y: y || Math.floor(Math.random() * this.world.maxY())
        },
            heightOffset = this.powerup.height / 2.0,
            widthOffset = this.powerup.width / 2.0,
            positionEntities = this.world.find(position.x - widthOffset, position.y - heightOffset, position.x + widthOffset, position.y + heightOffset);

        //will we spawn with a blasteroid, enemy, or player too near?
        if (positionEntities.length > 0) {
            //...if so wait to spawn and try again at same location
            setTimeout($.proxy(function () {
                this.spawnPowerup(position.x, position.y);
            }, this), 300);
            return;
        }

        //destroy active powerup if we have one
        this.activePowerup && (this.activePowerup.destroyed = true);

        ///create a new active powerup
        this.activePowerup = this.world.createEntity(
            this.powerup,
            position,
            this.POWERUP_CONFIGS[Math.floor(Math.random() * this.POWERUP_CONFIGS.length)]
        );


        //expire powerup in 20 secs
        setTimeout($.proxy(function () {
            if (this.activePowerup) {
                this.activePowerup.destroyed = true;
                this.activePowerup = null;
            }

            //spawn powerup at random time between 20 - 40secs
            setTimeout($.proxy(function () {
                this.spawnPowerup();
            }, this), Math.floor(Math.random() * 20000) + 20000);
        }, this), 20000);


        Log.info('POWERUP initialized...');

        //alert the user
        Log.msg('A POWERUP has appeared!');
    },

    /**
     * Spawn a wormhole at the given x1,y1 and x2,y2 coordinates, or a random x-y coordinate pair in the
     * world's field of play if no x-y coordinate pair is provided. A wormhole allows objects to instantaneously
     * travel from one point in space, to another point in space.
     * abilities and/or rewards when collected. They remain visible for 10 seconds. Their effects tend to
     * be permanent.
     * @param {number} [x1] x coordinate for the wormhole's first endpoint. Defaults to a random x coordinate in the world's field of play.
     * @param {number} [y1] y coordinate for the wormhole's first endpoint. Defaults to a random y coordinate in the world's field of play.
     * @param {number} [x2] x coordinate for the wormhole's second endpoint. Defaults to a random x coordinate in the world's field of play.
     * @param {number} [y2] y coordinate for the wormhole's second endpoint. Defaults to a random y coordinate in the world's field of play.
     * @example <caption>Spawning a random wormhole at a random time</caption>
     *   //spawn wormhole at random time between 40 - 60secs
     *   setTimeout(function(){
    *       Blasteroids.spawnWormhole();
    *   }, Math.floor(Math.random() * 20000) + 40000);
     */
    spawnWormhole: function (x1, y1, x2, y2) {
        var position = {
            x1: x1 || Math.floor(Math.random() * this.world.maxX()),
            y1: y1 || Math.floor(Math.random() * this.world.maxY()),
            x2: x2 || Math.floor(Math.random() * this.world.maxX()),
            y2: y2 || Math.floor(Math.random() * this.world.maxY())
        },
            heightOffset = this.powerup.height / 2.0, // TODO this may not be right
            widthOffset = this.powerup.width / 2.0, //TODO this may not be right
            positionEntities1 = this.world.find(position.x1 - widthOffset, position.y1 - heightOffset, position.x1 + widthOffset, position.y1 + heightOffset),
            positionEntities2 = this.world.find(position.x2 - widthOffset, position.y2 - heightOffset, position.x2 + widthOffset, position.y2 + heightOffset);

        //will we spawn with a blasteroid, enemy, or player too near to our endpoints?
        if (positionEntities1.length > 0 || positionEntities2.length > 0) {
            //...if so wait to spawn and try again at same location
            setTimeout($.proxy(function () {
                this.spawnWormhole(position.x1, position.y1, position.x2, position.y2);
            }, this), 300);
            return;
        }

        //destroy active wormhole if we have one
        this.activeWormhole && (this.activeWormhole.destroyed = this.activeWormhole.a.destroyed = this.activeWormhole.b.destroyed = true);

        ///create a new active wormhole with two endpoints, a and b
        this.activeWormhole == null && (this.activeWormhole = {});

        //a endpoint
        this.activeWormhole.a = this.world.createEntity(
            this.wormhole,
            {
                x: position.x1,
                y: position.y1
            }
        );

        //b endpoint
        this.activeWormhole.b = this.world.createEntity(
            this.wormhole,
            {
                x: position.x2,
                y: position.y2
            }
        );

        //expire wormhole in 30 secs
        setTimeout($.proxy(function () {
            if (this.activeWormhole) {
                this.activeWormhole.destroyed = true;
                this.activeWormhole.a.destroyed = true;
                this.activeWormhole.b.destroyed = true;
                this.activeWormhole = null;
            }

            //spawn powerup at random time between 40 - 60secs
            setTimeout($.proxy(function () {
                this.spawnWormhole();
            }, this), Math.floor(Math.random() * 20000) + 40000);
        }, this), 30000);


        Log.info('Wormhole initialized...');

        //alert the user
        Log.msg('DANGER! A WORMHOLE has appeared!');
    },

    /**
     * Takes a life from the player, updates the number of lives display, and alerts the player.  Displays game over if the user
     * has no lives remaining.  Otherwise, a new player ship is initialized within 3 secs.
     * @return {number} the number of lives the player has remaining
     * @example <caption>Taking the player's life</caption>
     *     //playerShipDestroyed ==> true
     *     if (playerShipDestroyed){
    *         this.destroy();
    *                
    *         Audio.play('sounds/NFF-player-death-2.wav');
    *
    *         Blasteroids.takeLife();
    *
    *         Log.info('PLAYER ship destroyed!');
    *     }
     */
    takeLife: function () {
        if (this.lives > 0) {
            //reduce the number of lives remaining
            this.lives -= 1;

            //update the display
            var $life = this.$lives
                .find('li:last')
                .addClass('animated rollOut');

            //cleanup after animation
            setTimeout(function () {
                $life.remove();
            }, 375);

            var lifeTakenMsg = 'PLAYER lost a life! ' + (this.lives === 0 ? 'GAME OVER' : '' + this.lives + ' remaining...');
            Log.info(lifeTakenMsg);

            //alert the player
            Log.msg(lifeTakenMsg);
        }

        if (this.lives <= 0) {
            //game over, if no lives remaining...
            this.endGame();
        } else {
            //...otherwise, wait 3 secs and then re-initialize the player
            setTimeout($.proxy(function () {
                this.initPlayer();
            }, this), 3000);
        }

        //return number of lives remaining
        return this.lives;
    }
};
