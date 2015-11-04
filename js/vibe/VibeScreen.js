// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var VibeScreenView = require( 'VIBE/vibe/view/VibeScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var vibeTitleString = require( 'string!VIBE/vibe.title' );

  /**
   * @constructor
   */
  function VibeScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, vibeTitleString, icon,
      function() { return {}; },
      function( model ) { return new VibeScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, VibeScreen );
} );