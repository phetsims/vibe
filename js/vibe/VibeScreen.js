// Copyright 2015-2021, University of Colorado Boulder

/**
 * Main screen for the test/demo harness for the 'vibe' repo, which is an audio library.
 * @author John Blanco
 */

import Screen from '../../../joist/js/Screen.js';
import vibe from '../vibe.js';
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

vibe.register( 'VibeScreen', VibeScreen );
export default VibeScreen;