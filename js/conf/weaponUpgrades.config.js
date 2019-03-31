Blasteroids.WEAPON_UPGRADE_CONFIGS = [
    /*
     cockpitRed_3.png
     cockpitRed_4.png
     cockpitRed_5.png
     cockpitRed_6.png
     cockpitRed_7.png
     */
    {
        image: 'images/cockpits/cockpitRed_0.png',
        $onCollect: function () {
            //increase our rate of fire
            Blasteroids.player.fireRate = 50;

            Log.msg('RAPID FIRE!');
        },
        $onNewGame: function () {
            //noop
            //the destruction of the player's ship resets the fireRate to its initial value
        }
    },
    {
        image: 'images/cockpits/cockpitRed_1.png',
        $onCollect: function () {
            //increase our rate of fire to 2 or greater, permanently
            Blasteroids.player.$blastsToFire(2, Math.max(Blasteroids.player.$blastsToFire()));
            Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

            Log.msg('DOUBLE SHOT!!');
        },
        $onNewGame: function () {
            //noop
            //the destruction of the player's ship resets the fireRate to its initial value
        }
    },
    {
        image: 'images/cockpits/cockpitRed_2.png',
        $onCollect: function () {
            //set our rate of fire to the maximum, permanently
            Blasteroids.player.$blastsToFire(3);
            Blasteroids.currentBlastsToFire = Blasteroids.player.$blastsToFire();

            Log.msg('TRIPLE SHOT!!!');
        },
        $onNewGame: function () {
            //noop
            //the destruction of the player's ship resets the fireRate to its initial value
        }
    }
];