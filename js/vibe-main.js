// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import VibeScreen from './vibe/VibeScreen.js';
import VibeStrings from './VibeStrings.js';

const vibeTitleStringProperty = VibeStrings.vibe.titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( vibeTitleStringProperty, [ new VibeScreen() ], simOptions );
  sim.start();
} );