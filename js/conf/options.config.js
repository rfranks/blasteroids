/** @property {*} defaultOptions the default set of options for the Blasteroids game
 *   @property {number} defaultOptions.angleStep the step increment (in degrees) for player ship rotation when rotating left or right<br/>Default: <code>10</code>
 *   @property {number} defaultOptions.velocityStep the step increment (in ?) for each firing of the player ship's thruster<br/>Default: <code>50</code>
 *   @property {number} defaultOptions.blastImpulse the impulse of laser blasts (applies to <em>both</em> <u>enemy</u> and <u>player</u> ships<br/>Default: <code>20</code>
 *   @property {number} defaultOptions.blasteroidShotsToDestroy the number of laser blasts it takes to crack or destroy a blasteroid<br/>Default: <code>2</code>

 *   @property {number} defaultOptions.minBlasteroids the number of blasteroids to start the first level with<br/>Default: <code>1</code>

 *   @property {number} defaultOptions.startingLives the number of starting lives given to the player<br/>Default: <code>3</code>
 *   @property {number} defaultOptions.startingLevel the game's starting level, higher levels mean more Blasteroids and higher difficulty<br/>Default: <code>1</code>
 *   @property {number} defaultOptions.levelWaitPeriod the number of milliseconds to wait between levels<br/>Default: <code>3000</code>
 *   @property {number} defaultOptions.shipFireRate the number of milliseconds the player's ship must wait before it can fire and fire again<br/>Default: <code>750</code>
 *   @property {number} defaultOptions.shipRadius the radius of the player's ship<br/>Default: <code>0.75</code>
 *   @property {boolean} defaultOptions.soundOn turn sounds on/off at the start of the game<br/>Default: <code>true</code>
 *   @property {string[]} defaultOptions.backgrounds list of CSS classes that can be used to control the background on the game's canvas element
 *   @property {string[]} defaultOptions.enemies list of image filenames in <code>/images/</code> folder to use for enemy ships
 *   @property {string[]} defaultOptions.lasers list of image filenames in <code>/images/</code> folder to use for laser blasts
 *   @property {string[]} defaultOptions.meteors list of image filenames in <code>/images/</code> folder to use for blasteroids
 *   @property {string[]} defaultOptions.ships list of image filenames in <code>/images/</code> folder to use for player ships
 *   @property {number} defaultOptions.enemyShipBonus number of bonus points awarded when an enemy ship is destroyed by the player<br/>Default: <code>1500</code>
 *   @property {number} defaultOptions.extraLifeScore number of points required to earn an extra life/ship<br/>Default: <code>5000</code>
 *   @property {number} defaultOptions.playerBlastsToFire the number of blasts the player ship fires each time the spacebar is pressed (can be one or two for single or twin laser, respectively)<br/>Default: <code>1</code>
 *   @property {Vector} defaultOptions.gravity x and y components of the force of gravity within the game world<br/>Default: <code>{ x: 0, y: 0 }</code>
 *   @property {boolean} defaultOptions.collisionOutlines flag indicating whether or not to show the outlines used during collision detection which can be useful for debugging<br/>Default: <code>false</code>
 *   @property {string} defaultOptions.el CSS selector for the main game <code>canvas</code> DOM element<br/>Default: <code>'#game'</code>
 *   @property {string} defaultOptions.scoreEl CSS selector for the DOM element for the player's current score amount<br/>Default: <code>'#score .amount'</code>
 *   @property {string} defaultOptions.newLevelEl CSS selector for the DOM element that is the new level "splash" screen<br/>Default: <code>'#newlevel'</code>
 *   @property {string} defaultOptions.levelEl CSS selector for the DOM element that contains the current level number<br/>Default: <code>'#newlevel .level'</code>
 *   @property {string} defaultOptions.livesEl CSS selector for the DOM element that contains the avatars for the player's remaining lives<br/>Default: <code>'#lives'</code>
 *   @property {string} defaultOptions.gameoverEl CSS selector for the DOM element that is the game over "splash" screen<br/>Default: <code>'#gameover'</code>
 *   @property {string} defaultOptions.hiscoreEl CSS selector for the DOM element that is the hi scores "splash" screen<br/>Default: <code>'#hiscore'</code>
 */
Blasteroids.defaultOptions = {
    angleStep: 10,
    velocityStep: 50,

    blastImpulse: 20,
    blasteroidShotsToDestroy: 2,
    blasteroidImpulseStep: 100,
    maxBlasteroidImpulse: 1000,

    maxEnemyImpulse: 100,

    minBlasteroids: 1,
    maxBlasteroidScore: 1000,

    startingLives: 3,
    startingLevel: 1,

    levelWaitPeriod: 3000,

    shipFireRate: 750,
    shipRadius: 0.75,

    soundOn: true,

    backgrounds: [
        'black-background',
        'blue-background',
        'dark-purple-background',
        'purple-background'
    ],

    enemies: [
        'enemyBlack1.png',
        'enemyBlack2.png',
        'enemyBlack3.png',
        'enemyBlack4.png',
        'enemyBlack5.png',
        'enemyBlue1.png',
        'enemyBlue2.png',
        'enemyBlue3.png',
        'enemyBlue4.png',
        'enemyBlue5.png',
        'enemyGreen1.png',
        'enemyGreen2.png',
        'enemyGreen3.png',
        'enemyGreen4.png',
        'enemyGreen5.png',
        'enemyRed1.png',
        'enemyRed2.png',
        'enemyRed3.png',
        'enemyRed4.png',
        'enemyRed5.png'
    ],

    lasers: [
        'laserBlue01.png',
        'laserGreen.png',
        'laserRed.png',
        'laserRed16.png',
        'laserRedShot.png'
    ],

    laserImpacts: [
        'laserBlueShot.png',
        'laserGreenShot.png',
        'laserRedShot.png',
        'laserRedShot.png'
    ],

    meteors: [
        'meteorBrown_big1.png',
        'meteorGrey_big1.png',
        'meteorBrown_big2.png',
        'meteorGrey_big2.png',
        'meteorBrown_big3.png',
        'meteorGrey_big3.png',
        'meteorBrown_big4.png',
        'meteorGrey_big4.png'
    ],

    ships: [
        'player.png',
        'playerShip1_blue.png',
        'playerShip1_green.png',
        'playerShip1_orange.png',
        'playerShip1_red.png',
        'playerShip2_blue.png',
        'playerShip2_green.png',
        'playerShip2_orange.png',
        'playerShip2_red.png',
        'playerShip3_blue.png',
        'playerShip3_green.png',
        'playerShip3_orange.png',
        'playerShip3_red.png'
    ],

    enemyShipBonus: 1500,
    extraLifeScore: 5000,
    playerBlastsToFire: 1,

    gravity: {x: 0, y: 0},
    collisionOutlines: false,

    el: '#game',
    scoreEl: '#score .amount',
    pointsAddedEl: '#score .points-added',
    newLevelEl: '#newlevel',
    levelEl: '#newlevel .level',
    livesEl: '#lives',
    gameoverEl: '#gameover',
    hiscoreEl: '#hiscore'
};