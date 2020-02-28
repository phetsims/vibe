// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import vibeStrings from './vibe-strings.js';
import VibeScreen from './vibe/VibeScreen.js';

const vibeTitleString = vibeStrings.vibe.title;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

SimLauncher.launch( function() {
  const sim = new Sim( vibeTitleString, [ new VibeScreen() ], simOptions );
  sim.start();
} );