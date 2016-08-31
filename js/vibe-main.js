// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var VibeScreen = require( 'VIBE/vibe/VibeScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var vibeTitleString = require( 'string!VIBE/vibe.title' );

  var simOptions = {
    credits: {
      leadDesign: '',
      softwareDevelopment: 'John Blanco, Chris Malley (PixelZoom, Inc.)',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( vibeTitleString, [ new VibeScreen() ], simOptions );
    sim.start();
  } );
} );