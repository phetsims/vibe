// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // Imports
  var Sound = require( 'VIBE/Sound' );

  var embeddedSound = new Sound( 'sounds/embedded-sound.mp3' );
  var embeddedAudioButton = document.getElementById( 'embeddedAudioButton' );
  embeddedAudioButton.onclick = function() {
    embeddedSound.stop();
    embeddedSound.play();
  };

  var relativePathSound = new Sound( 'sounds/relative-path-sound.mp3' );
  var relativePathAudioButton = document.getElementById( 'relativePathAudioButton' );
  relativePathAudioButton.onclick = function() {
    relativePathSound.stop();
    relativePathSound.play();
  };

  //Play a sound in the animation frame
  var animationFrameAudioButton = document.getElementById( 'animationFrameAudioButton' );
  animationFrameAudioButton.onclick = function() {
    var start = Date.now();
    var played = false;
    (function animloop() {
      var now = Date.now();

      if ( now - start > 1000 && !played ) {
        embeddedSound.play();
        played = true;
      }
      else {
        window.requestAnimationFrame( animloop );
      }
    })();
  };
} );

