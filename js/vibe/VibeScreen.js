// Copyright 2015-2019, University of Colorado Boulder

/**
 * Main screen for the test/demo harness for the 'vibe' repo, which is an audio library.
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );
  const vibe = require( 'VIBE/vibe' );
  const VibeScreenView = require( 'VIBE/vibe/view/VibeScreenView' );

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