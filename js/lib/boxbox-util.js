/**
 * @namespace BoxBoxUtil
 * @description Various utility methods useful when using the BoxBox+Box2DWeb libraries.
 */
var BoxBoxUtil = {
    /**
     * Enhances the provided game <code>world</code> with the additional properties and
     * methods of the <code>enhancedWorld</code> mixin.
     * @param {World} world the game world to enhance
     * @returns {World} the enhanced world
     * @see {@link BoxBoxUtil.enhancedWorld}
     */
    enhanceWorld: function (world) {
        if (!world._enhanced) {
            world._$canvas = $(world._canvas);
            world._maxY = world._$canvas.height() / (1.0 * world.scale());
            world._maxX = world._$canvas.width() / (1.0 * world.scale());
            world._center = {
                x: world._maxX / 2.0,
                y: world._maxY / 2.0
            };

            world.maxX = function () {
                return world._maxX;
            };

            world.maxY = function () {
                return world._maxY;
            };

            world.center = function () {
                return world._center;
            };

            world._enhanced = true;
        }

        return world;
    },

    /**
     * @mixin enhancedWorld
     * @memberOf BoxBoxUtil
     *
     * @property {jQuery} _$canvas jQuery object containing the world's <code>canvas</code> element
     * @property {boolean} _enhanced flag indicating whether or not <code>world</code> has been augmented with the <code>enhancedWorld</code> mixin
     * @property {number} _maxX the maximum computed x-coordinate (in <code>meters</code>, or <code>m</code>)? for the game world/canvas element
     * @property {number} _maxY the maximum computed y-coordinate (in <code>meters</code>, or <code>m</code>)? for the game world/canvas element
     * @property {Point} _center the x-,y-coordinates for the center of the game world/canvas element
     */
    enhancedWorld: {
        /**
         * @function center
         * @instance
         * @memberOf BoxBoxUtil.enhancedWorld
         * @returns {Point} the x-,y-coordinates for the center of the game <code>world</code>/<code>canvas</code> element
         */
        center: $.noop,

        /**
         * @function maxX
         * @instance
         * @memberOf BoxBoxUtil.enhancedWorld
         * @returns {number} the maximum computed x-coordinate (in <code>meters</code>, or <code>m</code>)? for the game world/canvas element
         */
        maxX: $.noop,

        /**
         * @function maxY
         * @instance
         * @memberOf BoxBoxUtil.enhancedWorld
         * @returns {number} the maximum computed y-coordinate (in <code>meters</code>, or <code>m</code>)? for the game world/canvas element
         */
        maxY: $.noop
    },

    /**
     * Enhances the world, if needed, and clears the field of play of all entities. It does
     * this by setting a destroyed/forceDestroy flag on the entity. Entities can then be
     * removed during their `onTick`.
     */
    clearFieldOfPlay: function (world) {
        BoxBoxUtil.enhanceWorld(world);

        var entities = Blasteroids.world.find(0, 0, world.maxX(), world.maxY());

        for (var i = 0; i < entities.length; i++) {
            entities[i].destroyed = true;
            entities[i].forceDestroy = true;
        }
    },

    cycleEntityImage: function (entity, options, propertyName, index) {
        if (entity && typeof entity.image === 'function' &&
            propertyName && typeof propertyName === 'string' && propertyName.length &&
            options && options[propertyName] && options[propertyName].length) {
            index = (index || 0) + 1;

            index >= options[propertyName].length && (index = 0);

            entity.image('images/' + options[propertyName][index]);
        }

        return index;
    },

    /**
     * @description Mixin of useful entity methods for observing and manipulating angles and forces.
     * @mixin angleImpulse
     * @memberOf BoxBoxUtil
     */
    angleImpulse: {
        /**
         * Gets/sets the angle of rotation for this entity.
         * @instance
         * @param {number} [angle] the angle to set
         * @returns {number} the entity's angle of rotation
         */
        $angle: function (angle) {
            if (angle != undefined) {
                this._ops.angle = angle % 360;
                this.rotation(this._ops.angle);
            }

            return this._ops.angle || 0;
        },


        $impulse: function (impulse) {
            if (impulse != undefined) {
                //impulse must be zero or greater
                this._ops.impulse = Math.max(impulse, 0);

                this.applyImpulse(this._ops.impulse, this.$angle());
            }

            return this._ops.impulse || 0;
        },

        /**
         * Gets the magnitude of the current force being applied to the entity. Optionally, applies a
         * 0, or positive, magnitude <code>force</code> at either the entity's current <code>$angle()</code>, or at an optional <code>angle</code>.
         * Pass a <code>0</code>, or negative, force to clear the current force being applied to the entity.
         * @instance
         * @param {number} [force] <code>0</code>, or positive, force to apply
         * @param {number} [angle] the angle at which to apply the force
         * @see {@link http://127.0.0.1:8080/doc/BoxBoxUtil.angleImpulse.html#__angle angleImpulse.$angle}
         * @returns {number} the magnitude of the force currently being applied to the entity, which may be <code>0</code>
         */
        $force: function (force, angle) {
            if (force !== undefined) {
                this._ops.force = Math.max(force, 0);

                if (this._ops.force === 0) {
                    //clear the force if it is being set to 0
                    this.clearForce('force');
                } else {
                    //otherwise, set the force and angle
                    this.setForce('force', this._ops.force, angle != undefined ? angle : this.$angle());
                }
            }

            return this._ops.force || 0;
        },

        $polarAngle: function () {
            return BoxBoxUtil.polarAngle(this._ops.angle);
        },

        $polarRadians: function () {
            return BoxBoxUtil.polarAngleRads(this.$polarAngle());
        },
    },

    /**
     * Enhances the world, if needed, and positions the entity at the center of the world.
     * @param {Entity} entity the entity to position
     * @param {World} world the world to position the entity in
     */
    center: function (entity, world) {
        if (!entity || !world) {
            return;
        }

        BoxBoxUtil.enhanceWorld(world);

        entity.position({
            x: world.maxX() / 2.0,
            y: world.maxY() / 2.0
        });
    },

    /**
     * @param {Entity} entity the entity to test
     * @param {World} world the world to check against
     * @returns {boolean} true if entity's position is <em>outside</em> of the world's
     * viewable field of play, false otherwise
     */
    isOffCanvas: function (entity, world) {
        if (!entity || !world) {
            return;
        }

        BoxBoxUtil.enhanceWorld(world);

        var position = entity.position();

        return position.x < 0 ||
            position.x > world.maxX() ||
            position.y < 0 ||
            position.y > world.maxY();

    },


    polarAngle: function (angle) {
        return (450 - angle) % 360;
    },

    /** Converts an angle to its equivalent in radians.
     * @param {number} angle the angle to convert into radians
     * @returns {number} <code<angle</code>'s equivalent in radians
     */
    angleRads: function (angle) {
        return BoxBoxUtil.polarAngleRads(BoxBoxUtil.polarAngle(angle));
    },

    /** Converts polar angle into equivalent radians.
     * @param {number} polarAngle the angle to convert
     * @returns {number} <code>polarAngle</code> as radians
     */
    polarAngleRads: function (polarAngle) {
        return polarAngle * (Math.PI / 180);
    },

    /**
     * @param {number} from
     * @param {number} to
     * @returns {number} random number between from and to, to excluded, in other words [from, to)
     */
    randomInterval: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },

    /** Combines a magnitude and direction into a {@link Vector} of x and y components.
     * @param {number} power magnitude to apply to the vector
     * @param {number} a May be one of  <ol><li>the angle of orientation (in <code>degrees</code>) of the vector, or</li><li>if <code>b</code> is also provided, this is interpreted as the x component of a vector</li></ol>
     * @param {number} [b] y component of the vector
     * @returns {Vector} the resulting vector
     */
    toVector: function (power, a, b) {
        var x = 0, y = 0;
        a = a || 0;

        if (b == undefined) {
            a -= 90;
            x = Math.cos(a * (Math.PI / 180)) * power;
            y = Math.sin(a * (Math.PI / 180)) * power;
        } else {
            x = a * power;
            y = b * power;
        }

        return {x: x, y: y};
    },

    /**
     * Wraps an entity's position across sides of the field of play.
     * Useful for when an entity goes <em>outside</em> the field of play.
     * @param {Entity} entity the entity whose position is being wrapped
     * @param {World} world the world in which to position the entity
     */
    wrapPosition: function (entity, world) {
        BoxBoxUtil.enhanceWorld(world);

        var canvasPosition = $.extend({}, entity.canvasPosition()),
            scale = world.scale(),
            wrapped = false;

        if (Log.isDebugEnabled()) {
            Log.debug('Position: ' + JSON.stringify(this.position()));
            Log.debug('Canvas Position: ' + JSON.stringify(canvasPosition));
            Log.debug('Canvas Position (scaled): ' + JSON.stringify({
                    x: (canvasPosition.x / scale),
                    y: (canvasPosition.y / scale)
                }));

        }

        if (canvasPosition.x > world._$canvas.width()) {
            canvasPosition.x = 0;
            wrapped = true;
        } else if (canvasPosition.x < 0) {
            canvasPosition.x = world._$canvas.width();
            wrapped = true;
        }

        if (canvasPosition.y > world._$canvas.height()) {
            canvasPosition.y = 0;
            wrapped = true;
        } else if (canvasPosition.y < 0) {
            canvasPosition.y = world._$canvas.height();
            wrapped = true;
        }

        if (wrapped) {
            entity.position({
                x: (canvasPosition.x / scale),
                y: (canvasPosition.y / scale)
            });
        }
    }
};
