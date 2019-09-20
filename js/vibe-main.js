// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const VibeScreen = require( 'VIBE/vibe/VibeScreen' );

  // strings
  const vibeTitleString = require( 'string!VIBE/vibe.title' );

  const simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
    const sim = new Sim( vibeTitleString, [ new VibeScreen() ], simOptions );
    sim.start();
  } );
} );