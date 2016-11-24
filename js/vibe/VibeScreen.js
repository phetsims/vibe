// Copyright 2015, University of Colorado Boulder

/**
 * Main screen for the test/demo harness for the 'vibe' repo, which is an audio library.
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var VibeScreenView = require( 'VIBE/vibe/view/VibeScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var vibe = require( 'VIBE/vibe' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @constructor
   */
  function VibeScreen() {

    Screen.call( this,
      function() { return {}; },
      function( model ) { return new VibeScreenView( model ); },
      { backgroundColorProperty: new Property( Color.toColor( 'white' ) ) }
    );
  }

  vibe.register( 'VibeScreen', VibeScreen );

  return inherit( Screen, VibeScreen );
} );