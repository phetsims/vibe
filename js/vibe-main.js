// Copyright 2013-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var VibeScreen = require( 'VIBE/vibe/VibeScreen' );

  // strings
  var vibeTitleString = require( 'string!VIBE/vibe.title' );

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( vibeTitleString, [ new VibeScreen() ], simOptions );
    sim.start();
  } );
} );