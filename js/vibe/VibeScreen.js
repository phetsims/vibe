// Copyright 2015-2020, University of Colorado Boulder

/**
 * Main screen for the test/demo harness for the 'vibe' repo, which is an audio library.
 * @author John Blanco
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import vibe from '../vibe.js';
import VibeScreenView from './view/VibeScreenView.js';

/**
 * @constructor
 */
function VibeScreen() {

  Screen.call( this,
    function() { return {}; },
    function( model ) { return new VibeScreenView( model ); }
  );
}

vibe.register( 'VibeScreen', VibeScreen );

inherit( Screen, VibeScreen );
export default VibeScreen;