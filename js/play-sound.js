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
} );

