// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import VibeScreen from './vibe/VibeScreen.js';
import vibeStrings from './vibeStrings.js';

const vibeTitleStringProperty = vibeStrings.vibe.titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( vibeTitleStringProperty, [ new VibeScreen() ], simOptions );
  sim.start();
} );