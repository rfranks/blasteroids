Blasteroids.initEntities = function () {
    //get the origin, which is used for placing entities
    var origin = Blasteroids.world.center();

    /**
     * @mixin Blasteroids.blast
     * @mixes boxbox.entityEvents
     * @see {@link Entity} for further information
     * @desc A mixin that bestows the characteristics of a ship's laser blast to an {@link Entity}.
     * @mixes BoxBoxUtil.angleImpulse
     * @property {string} name <code>'blast'</code>
     * @property {string} shape <code>'square'</code>
     * @property {boolean} destroyed <code>false</code>
     * @property {boolean} bullet <code>true</code>
     * @property {string} image <code>'images/lasers/laserBlue01.png'</code>
     * @property {boolean} imageStretchToFit <code>true</code>
     * @property {string} soundEffect <code>'sounds/NFF-laser.wav'</code>
     * @property {number} width <code>0.25</code>
     * @property {number} height <code>1</code>
     * @property {number} restitution <code>0</code>
     * @property {boolean} fixedRotation <code>true</code>
     * @property {string} $sourceName <code>undefined</code>
     */
    Blasteroids.blast = $.extend({},
        BoxBoxUtil.angleImpulse,
        {
            name: 'blast',
            shape: 'square',
            bullet: true,
            image: 'images/lasers/laserBlue01.png',
            imageStretchToFit: true,
            soundEffect: 'sounds/NFF-laser.wav',
            width: 0.25,
            height: 1,
            restitution: 0,
            fixedRotation: true,

            $sourceName: undefined,

            /**
             * Handle when this laser blast is impacted by another laser blast coming from an <u>enemy</u> ship, or the <u>player's</u> ship.
             * @memberOf! Blasteroids.blast
             * @this blast
             * @param {Entity} blast the blast that impacted us
             */
            $onBlastImpact: function (blast) {
                this.destroyed = blast.destroyed = true;
            },

            /**
             * @see {@link boxbox.entityEvents#onImpact}
             * @memberOf! Blasteroids.blast
             * @instance
             */
            onImpact: function (entity, normalForce, tangentialForce) {
                Log.info(this.name().toUpperCase() + ' collided with ' + entity.name().toUpperCase() + '!');
                this.destroyed = true;
                entity.$onBlastImpact && entity.$onBlastImpact(this);
            },

            /**
             * @see {@link boxbox.entityEvents#onTick}
             * @memberOf! Blasteroids.blast
             * @instance
             */
            onTick: function () {
                if (this.destroyed) {
                    this._ops.width = 1;
                    this._ops.height = 1;

                    //show a laser blast impact strike quickly and then destroy
                    this.image('./images/lasers/' + Blasteroids.options.laserImpacts[Blasteroids.laserIndex || 0]);
                    this._ops.active = false;

                    setTimeout($.proxy(function () {
                        this.destroy();
                    }, this), 30);
                } else if (BoxBoxUtil.isOffCanvas(this, Blasteroids.world)) {
                    this.destroy();
                }
            }
        });

    /**
     * @mixin Blasteroids.blasteroid
     * @mixes boxbox.entityEvents
     * @desc A mixin that bestows the characteristics of a blasteroid to an {@link Entity entity}.
     * @see {@link Entity} for further information
     * @mixes BoxBoxUtil.angleImpulse
     * @property {string} name <code>'blasteroid'</code>
     * @property {string} shape <code>'circle'</code>
     * @property {number} radius <code>3</code>
     * @property {string} image <code>'images/meteorBig.png'</code>
     * @property {boolean} imageStretchToFit <code>true</code>
     * @property {number} density <code>4</code>
     * @property {number} x <code>15</code>
     * @property {number} y <code>15</code>
     * @property {number} angle <code>0</code>
     * @property {number} maxVelocityX <code>10</code>
     * @property {number} maxVelocityY <code>10</code>
     * @property {number} impulse <code>0</code>
     * @property {boolean} bullet <code>true</code>
     */
    Blasteroids.blasteroid = $.extend({}, BoxBoxUtil.angleImpulse, {
        name: 'blasteroid',
        shape: 'circle',
        radius: 3,
        image: 'images/meteors/meteorBig.png',
        imageStretchToFit: true,
        density: 4,
        x: 15,
        y: 15,
        angle: 0,
        maxVelocityX: 10,
        maxVelocityY: 10,
        impulse: 0,
        bullet: true,

        /**
         * Event handler called when this blasteroid is impacted by a laser blast.  The laser blast may be coming from
         * an <u>enemy</u> ship, or the <u>player's</u> ship.
         * @memberOf! Blasteroids.blasteroid
         * @this blasteroid
         * @param {Entity} blast the blast that impacted us
         */
        $onBlastImpact: function (blast) {
            blast.destroyed = this.destroyed = true;
        },

        /**
         * Splits or destroys this blasteroid.  Larger blasteroids are split into two, while smaller ones are destroyed.
         * @this blasteroid
         * @memberOf! Blasteroids.blasteroid
         */
        $splitOrDestroy: function (radius) {
            radius = radius || this._ops.radius || 0;

            var i = 0,
                blasteroidCount = 2,
                newRadius = radius - 1,
                radiiDistance = radius + (newRadius * 1.5),
                currentAngle = this.$angle(),
                currentPosition = this.position(),
                angles = [currentAngle - 45, currentAngle + 45];

            if (blasteroidCount && (newRadius > 0)) {
                for (; i < blasteroidCount; i++) {
                    var newAngle = angles[i],
                        rads = BoxBoxUtil.angleRads(newAngle),
                        offsetX = radiiDistance * Math.cos(rads),
                        offsetY = radiiDistance * Math.sin(rads);

                    var newBlasteroid = Blasteroids.world.createEntity(Blasteroids.blasteroid, {
                        image: 'images/meteors/' + Blasteroids.options.meteors[this.meteorIndex || 0],
                        radius: newRadius,
                        x: (currentPosition.x + offsetX),
                        y: (currentPosition.y - offsetY),
                        angle: newAngle
                    });

                    //keep same meteor image for child blasteroids
                    newBlasteroid.meteorIndex = this.meteorIndex;

                    //initialize the difficulty level via number of shots to destroy
                    newBlasteroid.shotsToDestroy = Blasteroids.options.blasteroidShotsToDestroy;


                    Blasteroids.blasteroidsRemaining += 1;

                    Log.info('BLASTEROID size #' + newRadius + ' initialized. ' + Blasteroids.blasteroidsRemaining + ' remaining...');
                }
            }
        },

        /**
         * @see {@link boxbox.entityEvents#onImpact}
         * @memberOf! Blasteroids.blasteroid
         * @instance
         */
        onImpact: function (entity, normalForce, tangentialForce) {
            var entityName = entity.name(),
                sourceName = entity.$sourceName;

            if (entityName === 'player') {
                entity.$onBlasteroidImpact(this);
            } else if (entityName === 'enemy') {
                entity.$onBlasteroidImpact(this);
            } else if (entityName === 'blast') {
                this.shotsToDestroy -= 1;

                if (this.shotsToDestroy > 0) {
                    Audio.play('sounds/NFF-ping.wav');
                    if (sourceName === 'player') {
                        Blasteroids.addScore(50);
                    }
                } else {
                    this.destroyedByBlast = entity;
                    this.forceDestroy = true;
                    this.$onBlastImpact(entity);
                }
            } else if (entityName === 'blasteroid') {
                Audio.play('sounds/NFF-ping.wav');
            }

            Log.info(this.name().toUpperCase() + ' collided with ' + entityName.toUpperCase() + '!');
        },

        /**
         * @see {@link boxbox.entityEvents#onTick}
         * @memberOf! Blasteroids.blasteroid
         * @instance
         */
        onTick: function () {
            if (this.destroyed && !this.exploded && (this.forceDestroy || !this.shotsToDestroy)) {
                var previousRadius = this._ops.radius; //show a blasteroid explosion quickly and then destroy
                this.image('./images/effects/smokecloud.png');
                this._ops.radius = 1.5;
                this._ops.active = false;
                this.exploded = true;

                setTimeout($.proxy(function () {
                    this.destroy();
                }, this), 225);

                if (this.destroyedByBlast) {
                    Audio.play('sounds/NFF-smash.wav');

                    //split if we are large enough, otherwise destroy ourselves
                    this.$splitOrDestroy(previousRadius);

                    //if player shot us, then award points
                    if (this.destroyedByBlast.$sourceName === 'player') {
                        //add more points for higher level and for smaller blasteroids
                        Blasteroids.addScore(Blasteroids.level *
                            Blasteroids.options.blasteroidShotsToDestroy *
                            Math.round((Blasteroids.options.maxBlasteroidScore / Math.max(this._ops.radius, 1)) / 10));
                    }
                }

                Blasteroids.blasteroidsRemaining -= 1;
                Log.info('BLASTEROID destroyed! ' + Blasteroids.blasteroidsRemaining + ' remaining...');

                //if no more blasteroids, and we were destroyed by blast, then start a new level
                Blasteroids.blasteroidsRemaining <= 0 && this.destroyedByBlast && Blasteroids.newLevel();
            }
        },

        /**
         * @see {@link boxbox.entityEvents#onRender}
         * @memberOf! Blasteroids.blasteroid
         * @instance
         */
        onRender: function () {
            if (!this.impulsed) {
                this.$impulse(Blasteroids.options.maxBlasteroidImpulse);
                this.impulsed = true;
            }

            BoxBoxUtil.wrapPosition(this, Blasteroids.world);
        }
    });


    /**
     * @mixin Blasteroids.enemy
     * @mixes boxbox.entityEvents
     * @desc A mixin that bestows the characteristics of an <u>enemy</u> ship to an {@link Entity entity}.
     * @extends Entity
     * @mixes BoxBoxUtil.angleImpulse
     * @property {string} name <code>'enemy'</code>
     * @property {string} shape <code>'circle'</code>
     * @property {number} radius <code>Blasteroids.options.shipRadius</code>
     * @property {number} rotation <code>180</code>
     * @property {string} image <code>'images/enemyBlack1.png'</code>
     * @property {boolean} imageStretchToFit <code>true</code>
     * @property {number} density <code>4</code>
     * @property {number} angle <code>0</code>
     * @property {number} impulse <code>0</code>
     * @property {number} restitution <code>0</code>
     * @property {boolean} fixedRotation <code>true</code>
     * @property {boolean} bullet <code>true</code>
     */
    Blasteroids.enemy = $.extend({},
        BoxBoxUtil.angleImpulse,
        {
            name: 'enemy',
            shape: 'circle',
            radius: Blasteroids.options.shipRadius,
            rotation: 180,
            image: 'images/enemies/enemyBlack1.png',
            imageStretchToFit: true,
            density: 4,
            angle: 0,
            impulse: 0,
            restitution: 0,
            fixedRotation: true,
            bullet: true,

            /**
             * Fires this enemy ship's laser.
             * @memberOf! Blasteroids.enemy
             * @instance
             */
            $fireBlast: function () {
                if (this.destroyed) {
                    return;
                }

                var position = this.position(),
                    rads = this.$polarRadians(),
                    blast = Blasteroids.world.createEntity(Blasteroids.blast, {
                        image: 'images/lasers/' + Blasteroids.options.lasers[Blasteroids.laserIndex || 0],
                        $sourceName: this.name()
                    }),
                    blastHeightOffset = blast._ops.height * .75,
                    shipAngle = this.$angle();

                var blastOffsetX = (this._ops.radius + blastHeightOffset) * Math.cos(rads),
                    blastOffsetY = (this._ops.radius + blastHeightOffset) * Math.sin(rads);

                if (Log.isDebugEnabled()) {
                    Log.trace('blastOffsetX: ' + blastOffsetX + ", blastOffsetY: " + blastOffsetY + ", polar angle: " + this.$polarAngle() + ", angle: " + this.$angle());
                    Log.trace('playerX: ' + position.x + ", playerY: " + position.y);
                    Log.trace('blastX: ' + (position.x + blastOffsetX) + ", blastY: " + (position.y + blastOffsetY));
                }

                blast.position({
                    x: (position.x - blastOffsetX),
                    y: (position.y + blastOffsetY)
                });


                var blastAngle = Math.floor(BoxBoxUtil.randomInterval(shipAngle - 60, shipAngle + 60)) - 180;
                blast.$angle(blastAngle);
                blast.$impulse(Blasteroids.options.blastImpulse);

                Audio.play('sounds/NFF-laser.wav');

                //randomly fire enemy blast again
                Blasteroids.enemyShip.blastTimeout = setTimeout($.proxy(function () {
                    !this.destroyed && this.$fireBlast();
                }, this), Math.floor(Math.random() * 1000) + 1000);
            },

            /**
             * Event handler for when this enemy ship impacts a blast entity.
             * @param {Entity} blast the blast being impacted
             * @memberOf! Blasteroids.enemy
             * @instance
             */
            $onBlastImpact: function (blast) {
                if (!this.exploded && !this.destroyed) {
                    if (blast.$sourceName !== this.name()) {
                        this.destroyed = blast.destroyed = true;

                        Blasteroids.enemyShip.blastTimeout && clearTimeout(Blasteroids.enemyShip.blastTimeout);

                        blast.$sourceName === 'player' && Blasteroids.addScore(Blasteroids.options.enemyShipBonus);
                    } else {
                        blast.destroyed = true;
                    }
                }
            },


            /**
             * Event handler for when this enemy ship impacts a blasteroid entity.
             * @param {Entity} blasteroid the blasteroid being impacted
             * @memberOf! Blasteroids.enemy
             * @instance
             */
            $onBlasteroidImpact: function (blasteroid) {
                this.destroyed = true;

                Blasteroids.enemyShip.blastTimeout && clearTimeout(Blasteroids.enemyShip.blastTimeout);
            },

            /**
             * @see {@link boxbox.entityEvents#onImpact}
             * @memberOf! Blasteroids.enemy
             * @instance
             */
            onImpact: function (entity, force) {
                var entityName = entity.name();

                if (entityName === 'player') {
                    !entity.shielded && (entity.destroyed = true);
                    this.destroyed = true;
                } else if (entityName === 'blast') {
                    this.$onBlastImpact(entity);
                } else if (entityName === 'blasteroid') {
                    this.$onBlasteroidImpact(entity);
                } else {
                    this.destroyed = true;
                }

                Log.info(this.name().toUpperCase() + ' collided with ' + entityName.toUpperCase() + '!');
            },

            /**
             * @see {@link boxbox.entityEvents#onTick}
             * @memberOf! Blasteroids.enemy
             * @instance
             */
            onTick: function () {
                if (this.destroyed && !this.exploded) {
                    //show a ship explosion quickly and then destroy
                    this.image('./images/effects/ex2.png');
                    this._ops.radius = 2.5;
                    this._ops.active = false;
                    this.exploded = true;

                    setTimeout($.proxy(function () {
                        this.destroy();
                    }, this), 225);

                    Audio.play('sounds/NFF-enemydeath.wav');

                    //respawn enemy ship at random time between 20 - 40secs
                    setTimeout($.proxy(function () {
                        Blasteroids.spawnEnemyShip();
                    }, this), Math.floor(Math.random() * 20000) + 20000);


                    Log.info('ENEMY ship destroyed!');
                }
            },

            /**
             * @see {@link boxbox.entityEvents#onRender}
             * @memberOf! Blasteroids.enemy
             * @instance
             */
            onRender: function () {
                BoxBoxUtil.wrapPosition(this, Blasteroids.world);
            }
        });

    /**
     * @mixin Blasteroids.powerup
     * @mixes boxbox.entityEvents
     * @desc A mixin that bestows the characteristics of a powerup to an {@link Entity entity}.
     * @property {string} name <code>'powerup'</code>
     * @property {string} shape <code>'square'</code>
     * @property {string} type <code>'static'</code>
     * @property {boolean} active <code>false</code>
     * @property {boolean} imageStretchToFit <code>true</code>
     * @property {number} height <code>1.5</code>
     * @property {number} width <code>1.5</code>
     */
    Blasteroids.powerup = $.extend({},
        {
            name: 'powerup',
            shape: 'square',
            type: 'static',
            active: false,
            imageStretchToFit: true,
            height: 1.5,
            width: 1.5,

            /**
             * Called when the powerup is "collected."  Default behavior is a <code>no-op</code>.
             * @function $onCollect
             * @memberOf! Blasteroids.powerup
             * @instance
             * @param {Entity} entity the entity that is doing the "collecting"
             */
            $onCollect: $.noop,

            /**
             * @see {@link boxbox.entityEvents#onTick}
             * @memberOf! Blasteroids.powerup
             * @instance
             */
            onTick: function () {
                if (!this.destroyed) {
                    var i = 0,
                        heightOffset = this._ops.height / 2.0,
                        widthOffset = this._ops.width / 2.0,
                        position = this.position(),
                        positionEntities = Blasteroids.world.find(position.x - widthOffset, position.y - heightOffset, position.x + widthOffset, position.y + heightOffset);

                    //did someone touch us?
                    if (positionEntities.length > 0) {
                        for (; i < positionEntities.length; i++) {
                            var entity = positionEntities[i];

                            if (entity.name() === 'player') {
                                //play an alert sound
                                Audio.play('sounds/NFF-powerup.wav');

                                this.$onCollect && this.$onCollect(entity);

                                this.destroyed = true;

                                //spawn powerup at random time between 20 - 40secs
                                setTimeout(function () {
                                    Blasteroids.spawnPowerup();
                                }, Math.floor(Math.random() * 20000) + 20000);
                            }
                        }
                    }
                }

                (this.destroyed || BoxBoxUtil.isOffCanvas(this, Blasteroids.world)) && this.destroy();
            }
        });

    /**
     * @mixin Blasteroids.ship
     * @mixes boxbox.entityEvents
     * @desc A mixin that bestows the characteristics of a player's ship to an {@link Entity entity}.
     * @property {string} name <code>'player'</code>
     * @property {string} shape <code>'circle'</code>
     * @property {number} radius <code>Blasteroids.options.shipRadius</code>
     * @property {boolean} imageStretchToFit <code>true</code>
     * @property {number} density <code>4</code>
     * @property {number} x <code>origin.x</code>
     * @property {number} y <code>origin.y</code>
     * @property {number} angle <code>0</code>
     * @property {number} impulse <code>0</code>
     * @property {number} restitution <code>0</code>
     * @property {boolean} fixedRotation <code>true</code>
     * @property {boolean} bullet <code>true</code>
     * @property {boolean} shielded <code>false</code>
     */
    Blasteroids.ship = $.extend({},
        BoxBoxUtil.angleImpulse,
        {
            name: 'player',
            shape: 'circle',
            radius: Blasteroids.options.shipRadius,
            image: 'images/player/player.png',
            imageStretchToFit: true,
            density: 4,
            x: origin.x,
            y: origin.y,
            angle: 0,
            impulse: 0,
            restitution: 0,
            fixedRotation: true,
            bullet: true,

            /**
             * Gets/sets the number of blasts that are fired upon each trigger press (max of 3).
             * @param {number} [numOfBlasts] the number of blasts to fire each time
             * @memberOf! Blasteroids.ship
             */
            $blastsToFire: function (numOfBlasts) {
                //default to 1
                this.blastsToFire == undefined && (this.blastsToFire = 1);

                //update, if necessary, restricting to 3 or less
                numOfBlasts != undefined && (this.blastsToFire = Math.min(3, numOfBlasts));

                return this.blastsToFire;
            },

            /**
             * Fires this ship's laser, if it is able to be fired.
             * @param {boolean} [ignoreRateLimits] flag indicating whether or not to remove firing limits (enabled by default)
             * @memberOf! Blasteroids.ship
             */
            $fireBlast: function () {
                if (this.canFireBlast) {
                    var position = this.position(),
                        rads = this.$polarRadians(),
                        blast = Blasteroids.world.createEntity(Blasteroids.blast, {
                            image: 'images/lasers/' + Blasteroids.options.lasers[Blasteroids.laserIndex || 0],
                            $sourceName: this.name()
                        }),
                        blastHeightOffset = blast._ops.height * .75;

                    var blastOffsetX = (this._ops.radius + blastHeightOffset) * Math.cos(rads),
                        blastOffsetY = (this._ops.radius + blastHeightOffset) * Math.sin(rads);

                    blast.position({
                        x: (position.x + blastOffsetX),
                        y: (position.y - blastOffsetY)
                    });

                    blast.$angle(this.$angle());
                    blast.$impulse(Blasteroids.options.blastImpulse);

                    Audio.play('sounds/NFF-laser.wav');
                }
            },


            /**
             * Fires the ship's thruster and increases the ship's velocity by <code>Blasteroids.options.velocityStep</code>.
             * @memberOf! Blasteroids.ship
             */
            $fireThrust: function () {
                this.$force(this.$force() + Blasteroids.options.velocityStep);
                setTimeout($.proxy(function () {
                    //remove the force being applied to the ship
                    this.$force(0);
                }, this), 350);

                Log.isDebugEnabled() && Log.debug('Ship Force: ' + this.$force());

                var position = this.position(),
                    rads = this.$polarRadians(),
                    shipThrust = Blasteroids.world.createEntity(Blasteroids.shipThrust, {$sourceName: this.name()}),
                    heightOffset = shipThrust._ops.height * .75,
                    offsetX = (this._ops.radius + heightOffset) * Math.cos(rads),
                    offsetY = (this._ops.radius + heightOffset) * Math.sin(rads);

                this.shipThrust = shipThrust;

                if (Log.isDebugEnabled()) {
                    Log.trace('offsetX: ' + offsetX + ", offsetY: " + offsetY + ", polar angle: " + this.$polarAngle() + ", angle: " + this.$angle());
                    Log.trace('playerX: ' + position.x + ", playerY: " + position.y);
                    Log.trace('thrustX: ' + (position.x + offsetX) + ", thrustY: " + (position.y + offsetY));
                }


                shipThrust.position({
                    x: (position.x - offsetX),
                    y: (position.y + offsetY)
                });

                shipThrust.$angle(this.$angle() - 180);
                shipThrust.$impulse(this.$impulse());

                setTimeout($.proxy(function () {
                    this.$stopThrust();
                }, this), 225);

                Audio.play('sounds/NFF-thrust-3.wav');
            },

            /**
             * Destroys the currently firing ship thrust entity.
             * @memberOf! Blasteroids.ship
             */
            $stopThrust: function () {
                this.shipThrust && (this.shipThrust.destroyed = true);
            },

            /**
             * Event handler for when this ship impacts a blast entity.
             * @param {Entity} blast the blast being impacted
             * @memberOf! Blasteroids.ship
             */
            $onBlastImpact: function (blast) {
                if (blast.$sourceName !== this.name()) {
                    !this.shielded && (this.destroyed = true);
                } else {
                    blast.destroyed = true;
                }
            },

            /**
             * Event handler for when this ship impacts a blasteroid entity.
             * @param {Entity} blasteroid the blasteroid being impacted
             * @this ship
             * @memberOf! Blasteroids.ship
             */
            $onBlasteroidImpact: function (blasteroid) {
                !this.shielded && (this.destroyed = true);
            },

            /**
             * @see {@link boxbox.entityEvents#onKeyDown}
             * @memberOf! Blasteroids.ship
             * @instance
             */
            onKeyDown: function (e) {
                if (!this.exploded) {
                    this.$stopThrust();

                    if (e.keyCode == 38) {
                        //up - fire ship thruster
                        this.$fireThrust();
                    } else if (e.keyCode == 37) {
                        this.$angle(this.$angle() - Blasteroids.options.angleStep);

                        if (!Blasteroids.shipIndex) {
                            this.image('images/player/playerLeft.png');

                            setTimeout($.proxy(function () {
                                !this.exploded && this.image('images/player/player.png');
                            }, this), 375);
                        }
                    } else if (e.keyCode == 39) {
                        this.$angle(this.$angle() + Blasteroids.options.angleStep);

                        if (!Blasteroids.shipIndex) {
                            this.image('images/player/playerRight.png');

                            setTimeout($.proxy(function () {
                                !this.exploded && this.image('images/player/player.png');
                            }, this), 375);
                        }
                    } else if (e.keyCode == 32) {
                        //space - fire modified blast
                        var ship = this;

                        for (var i = 0; i < this.$blastsToFire(); i++) {
                            var setBlastTimeout = (i === (ship.$blastsToFire() - 1));

                            //timeout so that there is a delay between each blast
                            setTimeout(function () {
                                ship.$fireBlast();

                                setBlastTimeout && (ship.canFireBlast = false);
                            }, 100 * i);

                            setBlastTimeout &&
                            (ship.canFireBlastTO = setTimeout(function () {
                                ship.canFireBlast = true;
                            }, (100 * i) + ship.fireRate));
                        }
                    } else if (e.keyCode == 68) {
                        var position = this.position();
                        if (Log.isDebugEnabled()) {
                            Log.trace('playerX: ' + position.x + ", playerY: " + position.y);
                            Log.trace('player polar angle: ' + this.$polarAngle() + ', player angle: ' + this.$angle());
                            Log.trace('player impulse: ' + this.$impulse());
                        }
                    }
                }

                e.preventDefault();
            },

            /**
             * @see {@link boxbox.entityEvents#onTick}
             * @memberOf! Blasteroids.ship
             * @instance
             */
            onTick: function () {
                if (this.shipThrust && (this.destroyed || this.shipThrust.destroyed)) {
                    this.shipThrust.destroy();
                    this.shipThrust = null;
                }

                if (this.destroyed && !this.exploded) {
                    //show a ship explosion quickly and then destroy
                    this.image('./images/effects/ex2.png');
                    this._ops.radius = 2.5;
                    this._ops.active = false;
                    this.exploded = true;

                    setTimeout($.proxy(function () {
                        this.destroy();
                    }, this), 225);

                    Audio.play('sounds/NFF-player-death-2.wav');

                    Blasteroids.takeLife();

                    Log.info('PLAYER ship destroyed!');
                }
            },

            /**
             * @see {@link boxbox.entityEvents#onRender}
             * @memberOf! Blasteroids.ship
             * @instance
             */
            onRender: function () {
                BoxBoxUtil.wrapPosition(this, Blasteroids.world);
            }
        });

    Blasteroids.shipThrust = $.extend({},
        BoxBoxUtil.angleImpulse,
        {
            name: 'shipThrust',
            shape: 'square',
            image: 'images/effects/thrust.png',
            active: false,
            imageStretchToFit: true,
            width: .5,
            height: 2,
            fixedRotation: true,

            /**
             * @see {@link boxbox.entityEvents#onTick}
             * @memberOf! Blasteroids.shipThrust
             * @instance
             */
            onTick: function () {
                if (this.destroyed || BoxBoxUtil.isOffCanvas(this, Blasteroids.world)) {
                    this.destroy();
                }
            }
        });

    /**
     * @mixin Blasteroids.weaponUpgrade
     * @mixes boxbox.entityEvents
     * @desc A mixin that bestows the characteristics of a weapon upgrade to an {@link Entity entity}.
     * @property {string} name <code>'weaponUpgrade'</code>
     * @property {string} shape <code>'square'</code>
     * @property {string} type <code>'static'</code>
     * @property {boolean} active <code>false</code>
     * @property {boolean} imageStretchToFit <code>true</code>
     * @property {number} height <code>1.5</code>
     * @property {number} width <code>1.5</code>
     */
    Blasteroids.weaponUpgrade = $.extend({},
        BoxBoxUtil.angleImpulse,
        {
            name: 'weaponUpgrade',
            shape: 'square',
            type: 'static',
            active: false,
            imageStretchToFit: true,
            height: 1.5,
            width: 1.5,

            /**
             * Called when the powerup is "collected."  Default behavior is a <code>no-op</code>.
             * @function $onCollect
             * @memberOf! Blasteroids.powerup
             * @instance
             * @param {Entity} entity the entity that is doing the "collecting"
             */
            $onCollect: $.noop,

            /**
             * @see {@link boxbox.entityEvents#onTick}
             * @memberOf! Blasteroids.powerup
             * @instance
             */
            onTick: function () {
                //rotate us
                this.$angle((this.$angle() + 5) % 360);

                if (!this.destroyed) {
                    var i = 0,
                        heightOffset = this._ops.height / 2.0,
                        widthOffset = this._ops.width / 2.0,
                        position = this.position(),
                        positionEntities = Blasteroids.world.find(
                            position.x - widthOffset,
                            position.y - heightOffset,
                            position.x + widthOffset,
                            position.y + heightOffset
                        );

                    //did someone touch us?
                    if (positionEntities.length > 0) {
                        for (; i < positionEntities.length; i++) {
                            var entity = positionEntities[i];

                            if (entity.name() === 'player') {
                                //play an alert sound
                                Audio.play('sounds/NFF-weapon-upgrade.wav');

                                //collect the power up
                                this.$onCollect && this.$onCollect(entity);

                                //destroy the powerup
                                this.destroyed = true;

                                //spawn powerup at random time between 20 - 40secs
                                setTimeout(function () {
                                    Blasteroids.spawnWeaponUpgrade();
                                }, Math.floor(Math.random() * 20000) + 40000);
                            }
                        }
                    }
                }

                (this.destroyed || BoxBoxUtil.isOffCanvas(this, Blasteroids.world)) && this.destroy();
            }
        });

};
