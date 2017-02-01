// Copyright 2015, University of Colorado Boulder

/**
 * Main screen for the test/demo harness for the 'vibe' repo, which is an audio library.
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var vibe = require( 'VIBE/vibe' );
  var VibeScreenView = require( 'VIBE/vibe/view/VibeScreenView' );

  /**
   * @constructor
   */
  function VibeScreen() {

    Screen.call( this,
      function() { return {}; },
      function( model ) { return new VibeScreenView( model ); }
    );
  }

  vibe.register( 'VibeScreen', VibeScreen );

  return inherit( Screen, VibeScreen );
} );