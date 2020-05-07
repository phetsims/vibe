// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import vibeStrings from './vibeStrings.js';
import VibeScreen from './vibe/VibeScreen.js';

const vibeTitleString = vibeStrings.vibe.title;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

simLauncher.launch( function() {
  const sim = new Sim( vibeTitleString, [ new VibeScreen() ], simOptions );
  sim.start();
} );