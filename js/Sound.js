// Copyright 2013-2021, University of Colorado Boulder

/**
 * Type for loading and playing sounds.
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import { Display } from '../../scenery/js/imports.js';
import audioContextStateChangeMonitor from '../../tambo/js/audioContextStateChangeMonitor.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';
import SoundClip from '../../tambo/js/sound-generators/SoundClip.js';
import vibe from './vibe.js';

// global property that allows all audio to be turned on/off, see #11
const audioEnabledProperty = new Property( true );

// create a gain node that will be shared by all sounds and can be used to set the output level for all sounds
const sharedGainNode = phetAudioContext.createGain();
sharedGainNode.connect( phetAudioContext.destination );

sharedGainNode.gain.setValueAtTime(
  phet.chipper.queryParameters.audio === 'enabled' ? 1 : 0,
  phetAudioContext.currentTime
);

class Sound {

  /**
   * @param {WrappedAudioBuffer} soundDefinition - a wrapped audio buffer, generally obtained through loading a
   * sound module
   */
  constructor( soundDefinition ) {

    // Note to maintainers: This was basically gutted and replaces with objects from the tambo library in May 2020 in
    // order to support a new way of modularizing sounds.  See https://github.com/phetsims/tambo/issues/100 and
    // https://github.com/phetsims/vibe/issues/33 for more information.
    this.soundClip = new SoundClip( soundDefinition );

    // connect the sound clip directly to the output gain node
    this.soundClip.masterGainNode.connect( sharedGainNode );
  }

  /**
   * play the sound if audio is enabled
   * @public
   */
  play() {
    if ( audioEnabledProperty.get() ) {
      this.soundClip.play();
    }
  }

  /**
   * stop play of the sound
   * @public
   */
  stop() {
    this.soundClip.stop();
  }
}

// statics
Sound.audioEnabledProperty = audioEnabledProperty;

// Handle the audio context state, both when changes occur and when it is initially suspended.  As of this writing (Feb
// 2019), there are some differences in how the audio context state behaves on different platforms, so the code monitors
// different events and states to keep the audio context running.  As the behavior of the audio context becomes more
// consistent across browsers, it may be possible to simplify this.
if ( !phetAudioContext.isStubbed ) {

  // function to remove the listeners, used to avoid code duplication
  const removeUserInteractionListeners = () => {
    window.removeEventListener( 'touchstart', resumeAudioContext, false );
    if ( Display.userGestureEmitter.hasListener( resumeAudioContext ) ) {
      Display.userGestureEmitter.removeListener( resumeAudioContext );
    }
  };

  // listener that resumes the audio context
  const resumeAudioContext = () => {

    if ( phetAudioContext.state !== 'running' ) {

      phet.log && phet.log( `audio context not running, attempting to resume, state = ${phetAudioContext.state}` );

      // tell the audio context to resume
      phetAudioContext.resume()
        .then( () => {
          phet.log && phet.log( `resume appears to have succeeded, phetAudioContext.state = ${phetAudioContext.state}` );
          removeUserInteractionListeners();
        } )
        .catch( err => {
          const errorMessage = `error when trying to resume audio context, err = ${err}`;
          console.error( errorMessage );
          assert && alert( errorMessage );
        } );
    }
    else {

      // audio context is already running, no need to listen anymore
      removeUserInteractionListeners();
    }
  };

  // listen for a touchstart - this only works to resume the audio context on iOS devices (as of this writing)
  window.addEventListener( 'touchstart', resumeAudioContext, false );

  // listen for other user gesture events
  Display.userGestureEmitter.addListener( resumeAudioContext );

  // During testing, several use cases were found where the audio context state changes to something other than
  // the "running" state while the sim is in use (generally either "suspended" or "interrupted", depending on the
  // browser).  The following code is intended to handle this situation by trying to resume it right away.  GitHub
  // issues with details about why this is necessary are:
  // - https://github.com/phetsims/tambo/issues/58
  // - https://github.com/phetsims/tambo/issues/59
  // - https://github.com/phetsims/fractions-common/issues/82
  // - https://github.com/phetsims/friction/issues/173
  // - https://github.com/phetsims/resistance-in-a-wire/issues/190
  // - https://github.com/phetsims/tambo/issues/90
  let previousAudioContextState = phetAudioContext.state;
  audioContextStateChangeMonitor.addStateChangeListener( phetAudioContext, state => {

    phet.log && phet.log(
      `audio context state changed, old state = ${
        previousAudioContextState
      }, new state = ${
        state
      }, audio context time = ${
        phetAudioContext.currentTime}`
    );

    if ( state !== 'running' ) {

      // add a listener that will resume the audio context on the next touchstart
      window.addEventListener( 'touchstart', resumeAudioContext, false );

      // listen for other user gesture events too
      Display.userGestureEmitter.addListener( resumeAudioContext );
    }

    previousAudioContextState = state;
  } );
}

vibe.register( 'Sound', Sound );
export default Sound;