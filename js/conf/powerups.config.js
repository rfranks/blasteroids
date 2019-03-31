Blasteroids.POWERUP_CONFIGS = [
    {
        image: 'images/powerups/powerupYellow_star.png',
        $onCollect: function () {
            //points reward power up
            Blasteroids.addScore(2500);
            Log.msg('BONUS POINTS awarded!');
        }
    },
    {
        image: 'images/powerups/powerupRed_star.png',
        $onCollect: function () {
            //points reward power up
            Blasteroids.addScore(5000);
            Log.msg('BONUS POINTS awarded!');
        }
    },
    {
        image: 'images/powerups/powerupGreen_star.png',
        $onCollect: function () {
            //mega points reward power up
            Blasteroids.addScore(10000);
            Log.msg('MEGA POINTS awarded!');
        }
    },
    {
        image: 'images/powerups/powerupBlue_star.png',
        $onCollect: function () {
            //extra life power up
            Blasteroids.addLife(true);
        }
    },
    {
        image: 'images/powerups/powerupYellow_shield.png',
        $onCollect: function () {
            //harden our outer hull
            Blasteroids.player.shielded = true;
            Log.msg('SHIP SHIELDS have powered UP (10 seconds)!');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.shielded = false;
                Log.msg('SHIP SHIELDS have powered DOWN!');
            }, 10000);
        }
    },
    {
        image: 'images/powerups/powerupRed_shield.png',
        $onCollect: function () {
            //harden our outer hull
            Blasteroids.player.shielded = true;
            Log.msg('SHIP SHIELDS have powered UP (20 seconds)!');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.shielded = false;
                Log.msg('SHIP SHIELDS have powered DOWN!');
            }, 20000);
        }
    },
    {
        image: 'images/powerups/powerupGreen_shield.png',
        $onCollect: function () {
            //harden our outer hull
            Blasteroids.player.shielded = true;
            Log.msg('SHIP SHIELDS have powered UP (30 seconds)!');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.shielded = false;
                Log.msg('SHIP SHIELDS have powered DOWN!');
            }, 30000);
        }
    },
    {
        image: 'images/powerups/powerupBlue_shield.png',
        $onCollect: function () {
            //harden our outer hull
            Blasteroids.player.shielded = true;
            Log.msg('SHIP SHIELDS have powered UP (60 seconds)!');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.shielded = false;
                Log.msg('SHIP SHIELDS have powered DOWN!');
            }, 60000);
        }
    },
    {
        image: 'images/powerups/powerupYellow_bolt.png',
        $onCollect: function () {
            //increase our rate of fire
            Blasteroids.player.fireRate = 50;

            Log.msg('RATE OF FIRE increased!');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.fireRate = Blasteroids.options.shipFireRate;

                Log.msg('RATE OF FIRE has returned to NORMAL!');
            }, 10000);
        }
    },
    {
        image: 'images/powerups/powerupRed_bolt.png',
        $onCollect: function () {
            //double the fire power
            Blasteroids.player.$blastsToFire(Math.min(3, (2 * Blasteroids.options.playerBlastsToFire)));
            Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

            Log.msg('FIRE POWER temporarily INCREASED! (10 secs)');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.$blastsToFire(Math.min(3, Blasteroids.options.playerBlastsToFire));
                Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

                Log.msg('Returning to NORMAL FIRE POWER!');
            }, 10000);
        }
    },
    {
        image: 'images/powerups/powerupGreen_bolt.png',
        $onCollect: function () {
            //increase our rate of fire to 2 or greater, permanently
            Blasteroids.player.$blastsToFire(2, Math.max(Blasteroids.player.$blastsToFire()));
            Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

            Log.msg('FIRE POWER temporarily INCREASED! (20 secs)');

            //expire powerup effect in 10secs
            setTimeout(function () {
                Blasteroids.player.$blastsToFire(Math.min(3, Blasteroids.options.playerBlastsToFire));
                Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

                Log.msg('Returning to NORMAL FIRE POWER!');
            }, 20000);
        }
    },
    {
        image: 'images/powerups/powerupBlue_bolt.png',
        $onCollect: function () {
            //set our rate of fire to the maximum, permanently
            Blasteroids.player.$blastsToFire(3);
            Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

            Log.msg('FIRE POWER temporarily INCREASED! (30 secs)');

            //expire powerup effect in 30 secs
            setTimeout(function () {
                Blasteroids.player.$blastsToFire(Math.min(3, Blasteroids.options.playerBlastsToFire));
                Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

                Log.msg('Returning to NORMAL FIRE POWER!');
            }, 30000);
        }
    }
];