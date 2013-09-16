// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // Imports
  var Sound = require( 'Sound' );

  var sound = new Sound( 'sound.mp3' );
  var button = document.getElementById( 'audioButton' );
  button.onclick = function() {
    sound.stop();
    sound.play();
  };
} );

