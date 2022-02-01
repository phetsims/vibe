// Copyright 2013-2022, University of Colorado Boulder

/**
 *
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import relativePathSound_mp3 from '../../../sounds/relativePathSound_mp3.js';
import Sound from '../../Sound.js';
import vibe from '../../vibe.js';

// constants
const BUTTON_FONT = new PhetFont( { size: 20 } );
const TEST_SOUND = new Sound( relativePathSound_mp3 );

class VibeScreenView extends ScreenView {

  /**
   * @param {VibeModel} vibeModel
   */
  constructor( vibeModel ) {

    super();

    // blurb with some info
    const blurb = new Text( 'Demo/Test of the Vibe library, which is for sound generation.', {
      font: new PhetFont( 20 ),
      top: 20,
      left: 20
    } );
    this.addChild( blurb );

    const playSoundImmediatelyButton = new RectangularPushButton( {
      content: new Text( 'Play Sound Immediately', { font: BUTTON_FONT } ),
      baseColor: 'rgb( 245, 184, 0 )',
      top: blurb.bottom + 10,
      left: blurb.left,
      listener: function() {
        TEST_SOUND.stop(); // just in case it's already playing
        TEST_SOUND.play();
      }
    } );
    this.addChild( playSoundImmediatelyButton );

    const playInAnimationFrameButton = new RectangularPushButton( {
      content: new Text( 'Play in Animation Frame (delayed)', { font: BUTTON_FONT } ),
      baseColor: '#A0D022',
      top: playSoundImmediatelyButton.bottom + 10,
      left: blurb.left,
      listener: function() {
        const start = Date.now();
        let played = false;
        ( function animationLoop() {
          const now = Date.now();
          if ( now - start > 500 && !played ) {
            TEST_SOUND.play();
            played = true;
          }
          else {
            window.requestAnimationFrame( animationLoop );
          }
        } )();
      }
    } );
    this.addChild( playInAnimationFrameButton );
  }
}

vibe.register( 'VibeScreenView', VibeScreenView );
export default VibeScreenView;