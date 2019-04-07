<style type="text/css">
	.delayed {
		animation-delay: 1s;
	}

	.glyphicon {
		font-size: 18px;

	}
</style>

[![Build Status](https://travis-ci.org/jsdoc3/jsdoc.svg?branch=master)](http://travis-ci.org/jsdoc3/jsdoc)

About `Blasteroids`
-------------------
<div class="well well-sm">
	<a href="https://en.wikipedia.org/wiki/Asteroids_%28video_game%29">Asteroids</a> is an arcade space shooter released in November 1979 by <a href="https://en.wikipedia.org/wiki/Atari,_Inc.">Atari, Inc.</a> and designed by Lyle Rains, Ed Logg, and Dominic Walsh. The player controls a spaceship in an asteroid field which is periodically traversed by flying saucers.  The object is to shoot and destroy both asteroids and saucers alike, while avoiding each of them, as well as the flying saucers' counter-fire. The difficulty increases as the number of asteroids increases.
</div>

![Asteroids 1979 Gameplay](../images/doc/asteroids_1979.png "Asteroids 1979 Gameplay")

<div class="well well-sm">
	<a href="https://en.wikipedia.org/wiki/Asteroids_%28video_game%29">Asteroids</a> was one of the first major hits of the golden age of arcade games.
</div>

<div class="well well-sm">
	<code>Blasteroids</code> is an Asteroids clone built purely using HTML, CSS, and JavaScript.  <code>Blasteroids</code> was designed as an entry level introduction into both <strong>Web Programming</strong> and <strong>Game Programming</strong>. Its source code, its comments and its documentation are <strong><em><u>FREE</u></em></strong> to everyone.
</div>

![Blasteroids Gameplay](../images/doc/gameplay.png "Blasteroids Gameplay")

#### Objective
<div class="well well-sm">The primary objectives of <code>Blasteroids</code> are... 
	<ul class="list-group">
		<li class="list-group-item">...to avoid blasteroids at all costs,</li>
		<li class="list-group-item">...to avoid enemy ships at all costs,</li>
		<li class="list-group-item">...to destroy as many blasteroids as possible,</li>
		<li class="list-group-item">...to destroy enemy ships (only if they shoot first),</li>
		<li class="list-group-item">...to reach the highest level possible,</li>
		<li class="list-group-item">...and to earn the highest score.</li>
	</ul>
	<p>
		The player must do all of this while traversing levels of increasingly difficulty. 
	</p>		
</div>


<div class="well well-sm">
	<p>
		The player pilots a <em><u>state of the art</u></em>, computer generated, very pixelated ship that comes with zero guarantees.  It does however come with an infinite supply of laser blasts. The ship can also...
	</p>
	<ul class="list-group">
		<li class="list-group-item"><span class="glyphicon glyphicon-arrow-left"></span>...rotate left,</li> 
		<li class="list-group-item"><span class="glyphicon glyphicon-arrow-right"></span>...rotate right,</li>
		<li class="list-group-item"><span class="glyphicon glyphicon-option-vertical"></span>...fire shots straight forward,</li>
		<li class="list-group-item"><span class="glyphicon glyphicon-arrow-up"></span>...and thrust forward.</li>  
	</ul>
</div>

#### Underpinnings

<div class="well well-sm"><code>Blasteroids</code> is built using the following libraries:
<ul class="list-group">
	<li class="list-group-item"><a href="https://github.com/hecht-software/box2dweb">Box2dWeb</a> - a JavaScript physics engine</li>
	<li class="list-group-item"><a href="http://incompl.github.com/boxbox/">boxbox</a> - a wrapper framework for the Box2d / Box2dweb physics engine</li>
	<li class="list-group-item"><a href="https://jquery.com/">jQuery</a> - a fast, small, and feature-rich JavaScript library</li>
	<li class="list-group-item"><a href="https://github.com/daneden/animate.css">Animate.css</a> - a cross-browser library of CSS animations</li>	
</ul>

plus, its own custom libraries:
<ul class="list-group">
	<li class="list-group-item">{@link Audio}</li>
	<li class="list-group-item">{@link Log}</li>
</ul>

and some utility methods in:
<ul class="list-group">
	<li class="list-group-item">{@link BoxBoxUtil}</li>
</ul>
</div>

#### Legal Stuff

<div class="well well-sm">This version of <code>Blasteroids</code> is in no way related to or derived from Ed Rotberg's Blasteroids of 1987.</div>

<div class="well well-sm">
	<p>
		<code>Blasteroids</code> is designed as an entry level introduction into both <strong>Web Programming</strong> and <strong>Game Programming</strong>.  Its source code and documentation are <strong><em><u>FREE</u></em></strong> to everyone, forever, in perpetuity, until the end of the universe.
	</p>
	<p>
		<code>Blasteroids</code> is distributed under a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.  <code>Blasteroids</code> is <strong>free</strong> software, licensed under the MIT License(the "License"). Commercial and non-commercial use are permitted in compliance with the License.
	</p>
</div>

<div class="well well-sm" style="font-family: monospace;">Copyright (c) 2017-present by Richard Franks Jr richardfranksjr@hotmail.com and the contributors to Blasteroids. All rights reserved.</div>

#### Contributing

<div class="well well-sm">Want to contribute to <code>Blasteroids</code>? Please read {@tutorial CONTRIBUTING}.</div>

Installation and Usage
----------------------

#### Prerequisites

<div class="well well-sm">
	Running <code>Blasteroids</code> requires both <a href="https://nodejs.org/">NodeJS</a> and <a href="https://www.npmjs.com/">npm</a>.
</div>

#### Running

<div class="well well-sm">
	<code>Blasteroids</code> comes ready to run, out of the box, no building required.
	To rebuild the documentation, in case you have made changes, and start the server, run
</div>

    npm run serve

<div class="well well-sm">You should see something similar to the following.</div>
	
    Richards-MacBook-Pro:blasteroids rfranks$ npm run serve

	> blasteroids@0.0.1 serve /Users/rfranks/Developer/Code/blasteroids
	> npm install && ./build-doc.sh && ./node_modules/.bin/http-server

	audited 100 packages in 1.101s
	found 0 vulnerabilities

	Removing Documentation Directory[./doc]...
	Building Documentation using jsDoc...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/conf/options.config.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/conf/powerups.config.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/conf/weaponUpgrades.config.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/game/entities.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/game/game.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/lib/audio.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/lib/boxbox-util.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/lib/log4.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/lunr.search.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/public-lib/boxbox.doc.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/public-lib/docstrap.min.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/public-lib/lunr.min.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/sunlight.js ...
	Parsing /Users/rfranks/Developer/Code/blasteroids/js/toc.js ...
	Generating output files...
	Finished running in 1.84 seconds.
	...Done!
	Starting up http-server, serving ./
	Available on:
	  http://127.0.0.1:8080
	  http://10.0.0.182:8080
	Hit CTRL-C to stop the server

<div class="well well-sm">Press <code>CTRL-C</code> to stop the server when you have finished running <code>Blasteroids</code>.</div>	

<div class="well well-sm">
    Browse to <a href="http://127.0.0.1:8080/">http://127.0.0.1:8080/</a> to start playing!
</div>

#### Project Structure
|  <span class="label label-primary" data-balloon="The amount of space this folder's contents takes up.">Approx Size</span> | <span class="label label-primary" data-balloon="The name of this folder.">Folder</span>                            |        <span class="label label-primary" data-balloon="The folder contents' file type.">File Type</span>        | <span class="label label-primary" data-balloon="What this folder contains.">Contents</span>                                                                                                                            |
|:------------:|-----------------------------------|:-----------------------:|-------------------------------------------------------------------------------------------------------------------------------------|
|     220K     | `./blasteroids/css/doc`           |           css           | css stylesheets specific to the game's documentation                                                                                |
|     320K     | `./blasteroids/css`               |           css           | core css stylesheets                                                                                                                |
|      44K     | `./blasteroids/images/background` |        image/png        | background images for the game's canvas                                                                                             |
|     756K     | `./blasteroids/images/doc`        |        image/png        | images used in the game's documentation                                                                                             |
|     1.5M     | `./blasteroids/images`            |        image/png        | images used in the game or the game's documentation                                                                                 |
|     800K     | `./blasteroids/js/public-lib`     |            js           | 3rd party JavaScript libraries used by the game or the game's documentation (like jQuery, DocStrap or boxbox)                       |
|      68K     | `./blasteroids/js/game`           |            js           | javascript files used in the game (like the entities within the game)                                                               |
|      48K     | `./blasteroids/js/lib`            |            js           | core utility libraries used by the game or the game's documentation                                                                 |
|      20K     | `./blasteroids/js/conf`           |            js           | configuration js files                                                                                                              |
|     992K     | `./blasteroids/js`                |            js           | javascript files used in the game or the game's documentation                                                                       |
|     3.0M     | `./blasteroids/sounds`            |           wav           | sounds used within the game                                                                                                         |
|     8.0K     | `./blasteroids/static`            |            -            | just that, noise... can we remove?  required by jsdoc?                                                                              |
|     100K     | `./blasteroids/templates`         |           tmpl          | template files for the documentation ui (used during the JSDoc publish action)                                                      |
|      32K     | `./blasteroids/tutorials`         |         markdown        | markdown documents that correspond to  the tutorials in the game's documentation,  such as How To Play, or even the Code of Conduct |
|     220K     | `./blasteroids/fonts`             |  eot/svg/ttf/woff/woff2 | fonts used by the game or the game's documentation                                                                                  |
| 6.2M (total) | `./blasteroids`                   |            *            | all of the games files                                                                                                              |

How to Play
-----------
<div class="well well-sm">For details on how to play <code>Blasteroids</code>, see {@tutorial HOW_TO_PLAY}.</div>

Development and design
----------------------
<div class="well well-sm">This version of <code>Blasteroids</code> is in no way related to or derived from Ed Rotberg's 1987's Blasteroids.</div>

<div class="well well-sm"><code>Blasteroids</code> uses raster graphics instead of vectors.</div>

<div class="well well-sm"><code>Blasteroids</code> was designed as an entry level introduction into both <strong>Web Programming</strong> and <strong>Game Programming</strong>. Both its source code and documentation are <u>FREE</u> to everyone.</div>

##### Reception
<div class="well well-sm">To be determined. ;-)</div>

Attributions
------------
<div class="well well-sm"><code>Blasteroids</code> uses the great sounds provided free of charge from <a href="https://www.NoiseForFun.com" target="_blank">NoiseForFun.com</a>. Please visit and donate! :-)</div>

<div class="well well-sm"><code>Blasteroids</code> also uses the <a href="https://www.kenney.nl/assets/space-shooter-redux" target="_blank">Space Shooter Redux</a> assets library from <a href="https://www.kenney.nl" target="_blank">Kenney.nl</a>.  Please visit and donate! :-)</div>

For More Information
--------------------

+ TODO.
+ TODO.
+ Post questions tagged `blasteroids` to [Stack
Overflow](http://stackoverflow.com/questions/tagged/blasteroids).

License
-------

<div class="well well-sm"><code>Blasteroids</code> is <strong>free</strong> software, licensed under the MIT License(the "License"). Commercial and non-commercial use are permitted in compliance with the License.</div>

<div class="well well-sm" style="font-family: monospace;">Copyright (c) 2017-present by Richard Franks Jr richardfranksjr@hotmail.com and the contributors to Blasteroids. All rights reserved.</div>

The source code for <code>Blasteroids</code> is available at [GitHub](https://github.com/rfranks/blasteroids).

<code>Blasteroids</code> is distributed under a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

		
| Permissions  | Conditions| Limitations  |
|:-------------|:----------|:-------------|
|<span class="label label-success" data-balloon="This software and derivatives may be used for commercial purposes.">Commercial use</span>| <span class="label label-primary" data-balloon="A copy of the license and copyright notice must be included with the software.">License and copyright notice</span> | <span class="label label-danger" data-balloon="This license includes a limitation of liability.">Liability</span> |
|<span class="label label-success" data-balloon="This software may be distributed.">Distribution</span>| | <span class="label label-danger" data-balloon="The license explicitly states that it does NOT provide any warranty.">Warranty</span> |                            
|<span class="label label-success" data-balloon="This software may be modified.">Modification</span>|  |  |
|<span class="label label-success" data-balloon="This software may be used and modified in private.">Private use</span>|  | &nbsp; |                          

### MIT License

<div class="well well-sm" style="font-family: monospace;">
	<p>
		Copyright (c) 2017-present Richard Franks Jr richardfranksjr@hotmail.com
	</p>
	<p>
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:
	</p>
	<p>
		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.
	</p>
	<p>
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	</p>
</div>

Code of Conduct
---------------
<div class="well well-sm">
	Please note that this project is released with a Contributor {@tutorial CODE_OF_CONDUCT}.  
	By participating in this project you agree to abide by its terms.
</div>
