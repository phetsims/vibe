// Copyright 2013-2020, University of Colorado Boulder

/**
 *
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import inherit from '../../../../phet-core/js/inherit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import relativePathSound from '../../../sounds/relative-path-sound_mp3.js';
import Sound from '../../Sound.js';
import vibe from '../../vibe.js';

// sounds

// constants
const BUTTON_FONT = new PhetFont( { size: 20 } );
const EMBEDDED_SOUND = new Sound(
  { base64: 'data:audio/mpeg;base64,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' }
);

const RELATIVE_PATH_SOUND = new Sound( relativePathSound );

/**
 * @param {VibeModel} vibeModel
 * @constructor
 */
function VibeScreenView( vibeModel ) {

  ScreenView.call( this );

  // blurb with some info
  const blurb = new Text( 'Demo/Test of the Vibe library, which is for sound generation.', {
    font: new PhetFont( 20 ),
    top: 20,
    left: 20
  } );
  this.addChild( blurb );

  const playEmbeddedAudioButton = new RectangularPushButton( {
    content: new Text( 'Play Embedded Audio', { font: BUTTON_FONT } ),
    baseColor: 'rgb( 204, 102, 204 )',
    top: blurb.bottom + 10,
    left: blurb.left,
    listener: function() {
      EMBEDDED_SOUND.stop(); // just in case it's already playing
      EMBEDDED_SOUND.play();
    }
  } );
  this.addChild( playEmbeddedAudioButton );

  const playRelativePathAudioButton = new RectangularPushButton( {
    content: new Text( 'Play Relative Path Audio', { font: BUTTON_FONT } ),
    baseColor: 'rgb( 245, 184, 0 )',
    top: playEmbeddedAudioButton.bottom + 10,
    left: blurb.left,
    listener: function() {
      RELATIVE_PATH_SOUND.stop(); // just in case it's already playing
      RELATIVE_PATH_SOUND.play();
    }
  } );
  this.addChild( playRelativePathAudioButton );

  const playInAnimationFrameButton = new RectangularPushButton( {
    content: new Text( 'Play in Animation Frame (delayed)', { font: BUTTON_FONT } ),
    baseColor: '#A0D022',
    top: playRelativePathAudioButton.bottom + 10,
    left: blurb.left,
    listener: function() {
      const start = Date.now();
      let played = false;
      ( function animationLoop() {
        const now = Date.now();
        if ( now - start > 500 && !played ) {
          EMBEDDED_SOUND.play();
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

vibe.register( 'VibeScreenView', VibeScreenView );

export default inherit( ScreenView, VibeScreenView );