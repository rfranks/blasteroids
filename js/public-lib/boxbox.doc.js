/**
 * A point in space within the world.
 * @typedef {Object} Point
 * @property {number} x the point's x-coordinate
 * @property {number} y the point's y-coordinate
 */

/**
 * A quantity with both an x component and a y component.
 * @typedef {Object} Vector
 * @property {number} x the magnitude of the vector's x component
 * @property {number} y the magnitude of the vector's y component
 */

//===============================================================================================================================

/**
 * @class Entity
 * @classdesc An object within the game {@link World}.
 * @hideconstructor
 * @desc The following options can be passed when {@link World#createEntity creating an entity} within the game world.  Custom methods and parameters can also be supplied but must be prefixed with a `$`.
 * @property {string} name name of this entity
 * @property {number} [angle=0] the entity's angle of rotation
 * @property {number} x starting x coordinate for the center of the new entity
 * @property {number} y starting y coordinate for the center of the new entity
 * @property {string} type `dynamic` or `static`. static objects do not move
 * @property {string} shape `square` or `circle` or `polygon`
 * @property {number} [height=1] height for `square`
 * @property {number} [width=1] width for `square`
 * @property {number} [radius=1] radius for `circle`
 * @property {Point[]} points for `polygon` [{x,y}, {x,y}, {x,y}] must go clockwise, must be convex
 * @property {number} [density=2] this entity's density
 * @property {number} [friction=1] friction
 * @property {number} [restitution=.2] restitution or bounciness
 * @property {boolean} [active=true] active flag indicicating whether or not this entity participates in collisions and dynamics
 * @property {number} [rotation=0] initial rotation in degrees
 * @property {boolean} [fixedRotation=false] flag that, if true, prevents the entity from rotating
 * @property {boolean} [bullet=false] flag, when true, performs expensive continuous collision detection
 * @property {number} [maxVelocityX] the maximum left or right speed of this entity. prevents an entity from moving too fast either left or right
 * @property {number} [maxVelocityY] the maximum up or down speed of this entity, prevents entity from moving too fast either up or down
 * @property {string} [image] path to image file for rendering
 * @property {number} [imageOffsetX=0] x direction offset for `image`
 * @property {number} [imageOffsetY=0] y direction offset for `image`
 * @property {boolean} [imageStretchToFit=false] flag indicating whether or not to strecth `image` to fit `shape`
 * @property {boolean} [spriteSheet=false] flag indicating whether or not `image` is a sprite sheet
 * @property {number} [spriteWidth=16] Width of `spriteSheet`
 * @property {number} [spriteHeight=16] Height of `spriteSheet`
 * @property {number} [spriteX=0] x for `spriteSheet`
 * @property {number} [spriteY=0] y for `spriteSheet`
 * @property {string} [color='gray'] CSS color for rendering if no `image` is given
 * @property {string} [borderColor='black'] CSS color for rendering the `shape`'s border
 * @property {number} [borderWidth=1] width of the border, border does not affect physics
 * @property {function} [draw] provide a custom draw function, params are `context`, `x`, and `y`
 * @property {function} [init] provide a custom function that is run when the entity is created
 * @mixes boxbox.entityEvents
 * @example <caption>Creating a Simple Entity</caption>
 * //create a simple disc
 *     var player = world.createEntity({
 *         name: 'player',
 *         shape: 'circle',
 *         radius: 2
 *     });
 * @example <caption>Templates<p>You can pass multiple options objects on creating allowing for the use of "templates" with reusable defaults. The options objects on the right take precedence.</p></caption>
 * //create red circles from a template
 *      var redCircleTemplate = {color: 'red', shape: 'circle', radius: 3};
 *      var redCircle = world.createEntity(redCircleTemplate, {x: 5, y: 5});
 *      var anotherRedCircle = world.createEntity(redCircleTemplate, {x: 10, y: 5});
 *
 *      //redCircle.position().x === anotherRedCircle.position().x ===> false
 *      //redCircle.position().y === anotherRedCircle.position().y ===> true
 * @example <caption>Dollar Properties <p>You can provide custom methods and properties as options whose names start with a <code>$</code>.  This allows you to provide your own custom functionality.</p></caption>
 * //create a customValue property
 *      var ball = world.createEntity({color: 'red', $customValue: 15});
 *      //ball.$customValue === 15 ===> true
 * @example <caption>Creating a blasteroid entity</caption>
 * //creating a more complex entitys
 *      var blasteroidEntityType = $.extend({}, BoxBoxUtil.angleImpulse, {
 *               name: 'blasteroid',
 *               shape: 'circle',
 *               radius: 3,
 *               image: 'images/meteorBig.png',
 *               imageStretchToFit: true,
 *               density: 4,
 *               x: 15,
 *               y: 15,
 *               angle: 0,
 *               maxVelocityX: 10,
 *               maxVelocityY: 10,
 *               impulse: 0,
 *               bullet: true
 *       });
 */

/**
 * Destroys the entity, removing it from tbe world and, if applicable, the physics engine. This method
 * <b>SHOULD NOT</b> be called from within the `onRender` method as it can lead to unpredictable results.
 *
 * @method
 * @name Entity#destroy
 */

/**
 * Gets/sets the name of this entity.
 *
 * @method
 * @name Entity#name
 * @param {string} [name] the name for the entity
 * @returns {string} the name of the entity
 */

/**
 * Gets/sets the position of this entity.
 *
 * @method
 * @name Entity#position
 * @param {Point} [position] the new position for the entity
 * @returns {Point} the entity's current position
 */

/**
 * Gets/sets the path to the image file being used for rendering.
 *
 * @method
 * @name Entity#image
 * @param {string} [image] the image path to set
 * @returns {number} the path to the entity's current image file
 * @example <caption>Switching Image Out Temporarily <p>Different effects can be achieved simply by swapping images.</p></caption>
 *     //this.image() ===> 'images/player.png'
 *     //bank ship left by changing image, temporarily...
 *     this.image('images/playerLeft.png');
 *
 *     //return to previous/normal ship image in 225ms
 *     setTimeout($.proxy(function(){
 *         this.image('images/player.png');
 *      }, this), 225);
 */

/**
 * Gets/sets the degree of rotation for the entity.
 *
 * @method
 * @name Entity#rotation
 * @param {number} [degrees] the new angle of rotation for the entity
 * @returns {number} the entity's current angle of rotation
 */
//=======================================================================================================================================
/**
 * @classdesc An object that represents the game world.  May also be referred to as the <em>field of play</em>. Contains a single, self-contained, physics simulation.
 * @class World
 * @hideconstructor
 * @property {number} level
 * @property {string} name an identifying name for this entity
 */

/**
 * Gets/sets the position of the camera with respect to the game world.
 *
 * @method
 * @instance
 * @name World#camera
 * @param {Vector} [position] the new position for the camera
 * @returns {Vector} the camera's current position
 */

/**
 * Get the <code>canvas</code> position for a corresponding <em>world</em> position. Useful for custom rendering in <code>onRender</code>.
 * Respects both world scale and camera position.
 *
 * @method
 * @instance
 * @name World#canvasPositionAt
 * @param {number} x the x-coordinate for the point within the world
 * @param {number} y the y-coordinate for the point within the world
 * @returns {Vector} the <code>canvas</code> position that corresponds to the given world coordinates
 */

/**
 * Creates an {@link Entity} within the game world. If applicable, the world will begin applying the physics engine to the new entity.
 *
 * @method
 * @instance
 * @name World#createEntity
 * @param {...Entity} entity the options to use for entity creation
 */

/**
 * (Experimental Joint Support) Creates a link between two entities within the game world.
 * @see {@link http://box2d.org/ box2d documentation}
 * @method
 * @instance
 * @name World#createJoint
 * @param {Entity} entity1 the entity at one end of the joint
 * @param {Entity} entity2 the entity at the opposite end of the joint
 * @param {*} [options] additional options to pass for the joint
 * @param {boolean} [options.allowCollisions=false] whether or not this joint is affected by collisions
 * @param {boolean} [options.enableMotor=false] whether or not to enable the joint's motor
 * @param {string} [options.type='distance'] the type of joint, can be one of <code>'distance', 'revolute', 'gear', 'friction', 'prismatic', 'weld', 'pulley', 'mouse' or 'line'</code>
 */

/**
 * Finds {@link Entity}s in the game world that are withen the given bounding rectangle.
 *
 * @method
 * @instance
 * @name World#find
 * @param {number} x1 x-coordinate of the upper left of the bounding rectangle
 * @param {number} y1 y-coordinate of the upper left of the bounding rectangle
 * @param {number} x2 x-coordinate of the lower right of the bounding rectangle
 * @param {number} y2 y-coordinate of the lower right of the bounding rectangle
 * @returns {Entity[]} an array, possibly empty, of {@link Entity}s within a given bounding rectangle
 */

/**
 * Gets/sets the gravity within the game world.
 *
 * @method
 * @instance
 * @name World#gravity
 * @param {Vector} [gravity] the new value for gravity, can be horizontal, negative, etc
 * @returns {Vector} the current gravity within the game world
 */

/**
 * Gets/sets the scale (in <code>px/m</code>) for rendering within the game world.
 *
 * @method
 * @instance
 * @name World#scale
 * @param {number} [scale] the new value for scale
 * @returns {number} the current scale (in <code>px/m</code>) for rendering within the game world
 */


/**
 * @namespace boxbox
 */

/**
 * Creates a new game {@link World}.
 *
 * @constructs World
 * @method
 * @name boxbox#createWorld
 * @param {Element} canvas the canvas element to render on
 * @param {*} [options] options options to apply when creating the world
 * @param {Vector} [options.gravity={x:0, y:10}] gravity for the game world, x and y component, can be horizontal, negative, etc
 * @param {boolean} [options.allowSleep=true] flag indicating whether or not entities may "sleep" when they come to rest, meaning that the entity is no longer being simulated, which can improve performance
 * @param {number} [options.scale=30] scale for rendering in the the game world (in <code>pixels/meter</code> or <code>px/m</code>)
 * @param {number} [options.tickFrequency=50] the frequency at which <code>onTick</code> events occur (in <code>milliseconds</code>, or <code>ms</code>)
 * @param {boolean} [options.collisionOutlines=false] flag indicating whether or not to draw outlines around entities for collision detection (useful for debugging collisions)
 * @returns {World} a new game world
 * @example <caption>Creating a world using the default options</caption>
 * var canvasElem = document.getElementById("myCanvas");
 * var world = boxbox.createWorld(canvasElem);
 * @example <caption>Creating a world <em><u>overriding</u></em> default options</caption>
 * var canvasElem = document.getElementById("myCanvas");
 * var world = boxbox.createWorld(canvasElem, {
 *     gravity: {x: 0, y: 20},
 *     scale: 60
 * });
 */

/**
 * @mixin boxbox.entityEvents
 * @memberOf! boxbox
 * @desc Mixes in standard event handlers for entities.
 * @see {@link Entity}
 */

/**
 * Handle keydown event for this entity.
 * @method
 * @name boxbox.entityEvents#onKeydown
 * @this entity
 * @param {Event} e the keydown event
 */

/**
 * Handle keyup event for this entity.
 * @method
 * @name boxbox.entityEvents#onKeyup
 * @this entity
 * @param {Event} e the keyup event
 */

/**
 * Handle start of contact with another entity.
 * @method
 * @name boxbox.entityEvents#onStartContact
 * @this entity
 * @param {Entity} entity the entity that contact started with
 */

/**
 * Handle end of contact with another entity.
 * @method
 * @name boxbox.entityEvents#onFinishContact
 * @this entity
 * @param {Entity} entity the entity that contact ended with
 */

/**
 * Handle impact with another entity.
 * @method
 * @name boxbox.entityEvents#onImpact
 * @this entity
 * @param {Entity} entity the entity that collided with us
 * @param {number} normalForce force of the two entites colliding
 * @param {number} tangentialForce force of the two entites "rubbing" up against each other
 */

/**
 * Handle when this entity is rendered.
 * @method
 * @name boxbox.entityEvents#onRender
 * @this entity
 * @param {Element} <code>canvas</code> context for rendering
 */

/**
 * Handle a <strong>tick</strong>.  <strong>Ticks</strong> are periodic events that happen independant of rendering. You can use ticks as your "game loop". The default tick frequency is <code>50 ms</code>, and it can be set as an option when creating the world.
 * @method
 * @name boxbox.entityEvents#onTick
 * @this entity
 */