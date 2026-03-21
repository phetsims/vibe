// Copyright 2015-2026, University of Colorado Boulder

/**
 * Main screen for the test/demo harness for the 'vibe' repo, which is an audio library.
 * @author John Blanco
 */

import Screen from '../../../joist/js/Screen.js';
import VibeScreenView from './view/VibeScreenView.js';

class VibeScreen extends Screen {

  constructor() {

    super(
      () => {
        return {};
      },
      model => new VibeScreenView( model )
    );
  }
}

export default VibeScreen;
