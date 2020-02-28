// Copyright 2013-2020, University of Colorado Boulder

/**
 * Type for loading and playing sounds, works on multiple platforms and supports embedded base64 data.  This uses Web
 * Audio when available, primarily because the webkit platforms were failing with cross-domain errors when attempting to
 * load audio data from embedded data URIs.  This was occurring in mid-September 2013.  Simplification may be possible
 * if the cross-domain issue goes away at some point in the future.
 */

import Property from '../../axon/js/Property.js';
import inherit from '../../phet-core/js/inherit.js';
import Display from '../../scenery/js/display/Display.js';
import vibe from './vibe.js';

// global property that allows all audio to be turned on/off, see #11
const audioEnabledProperty = new Property( true );

// set up a single audio context that will be used by all sounds when using Web Audio API
let audioContext;
if ( 'AudioContext' in window ) {
  audioContext = new AudioContext();
}
else if ( 'webkitAudioContext' in window ) {
  audioContext = new webkitAudioContext(); // eslint-disable-line no-undef
}

// controls volume if Web Audio API supported
if ( audioContext ) {
  var gainNode = audioContext.createGain();
  gainNode.connect( audioContext.destination );
  gainNode.gain.setValueAtTime( phet.chipper.queryParameters.audioVolume, audioContext.currentTime );
}

/**
 * @param {Object} soundInfo - An object that includes *either* a url that points to the sound to be played *or* a
 * base64-encoded version of the sound data.  The former is generally used when a sim is running in RequireJS mode,
 * the latter is used in built versions.
 * @constructor
 */
function Sound( soundInfo ) {

  const self = this;

  // parameter checking
  if ( typeof soundInfo !== 'object' ||
       ( typeof soundInfo.base64 === 'undefined' && typeof soundInfo.url === 'undefined' ) ) {
    throw new Error( 'Error with soundInfo object: Does not contain a necessary value.' );
  }

  this.sound = document.createElement( 'audio' );
  let supportedFormatFound = false;

  // Identify the audio format.  The URL is generally used when running in RequieJS mode, base64 is used when running
  // single-html-file (aka "built") simulations.
  let audioFormat;
  if ( soundInfo.url ) {
    audioFormat = 'audio/' +
                  soundInfo.url.slice( soundInfo.url.lastIndexOf( '.' ) + 1,
                    soundInfo.url.lastIndexOf( '?' ) >= 0 ? soundInfo.url.lastIndexOf( '?' ) : soundInfo.url.length
                  );
  }
  else {
    audioFormat = soundInfo.base64.slice( soundInfo.base64.indexOf( ':' ) + 1, soundInfo.base64.indexOf( ';' ) );
  }

  // determine whether this audio format is supported (doesn't exist for phantomjs, which is used in automated testing)
  if ( this.sound.canPlayType && this.sound.canPlayType( audioFormat ) ) {
    supportedFormatFound = true;
  }
  else {
    console.warn( 'audio format not supported, sound will not be played.' );
  }

  // load the sound into memory
  if ( supportedFormatFound ) {
    if ( audioContext ) {
      let arrayBuff;

      if ( soundInfo.base64 ) {

        // We're working with base64 data, so we need to decode it. The regular expression removes the mime header.
        const soundData = ( soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' ) ).replace( new RegExp( '^.*,' ), '' );
        const byteChars = window.atob( soundData );
        const byteArray = new window.Uint8Array( byteChars.length );
        for ( let j = 0; j < byteArray.length; j++ ) {
          byteArray[ j ] = byteChars.charCodeAt( j ); // need check to make sure this cast doesn't give problems?
        }
        arrayBuff = byteArray.buffer;

        audioContext.decodeAudioData( arrayBuff,
          function( audioData ) {
            self.audioBuffer = audioData;
          },
          function() {
            console.log( 'Error: Unable to decode audio data.' );
          }
        );
      }
      else {

        // load the sound via URL
        const request = new XMLHttpRequest();
        request.open( 'GET', soundInfo.url, true );
        request.responseType = 'arraybuffer';
        request.onload = function() {

          // decode the audio data asynchronously
          audioContext.decodeAudioData( request.response,
            function( audioData ) {
              self.audioBuffer = audioData;
            },
            function() { console.log( 'Error loading and decoding sound, sound name: ' + soundInfo.url ); }
          );
        };
        request.onerror = function() {
          console.log( 'Error occurred on attempt to load sound data.' );
        };
        request.send();
      }
    }
    else {

      // web Audio API is not available, so insert the sound into the DOM and use HTML5 audio
      this.sound.setAttribute( 'src', soundInfo.base64 ? soundInfo.base64 : soundInfo.url );
      this.sound.load();
    }
  }
}

vibe.register( 'Sound', Sound );

inherit( Object, Sound, {

  /**
   * Plays the sound using the Web Audio API if available or HTML5 audio if not.
   * @public
   */
  play: function() {
    if ( !Sound.audioEnabledProperty.get() ) {
      return;
    }
    if ( audioContext ) {

      // Use the Web Audio API.  The following 'if' clause is necessary to be sure that the audio has finished
      // loading, see https://github.com/phetsims/vibe/issues/20.
      if ( this.audioBuffer ) {
        this.soundSource = audioContext.createBufferSource();
        this.soundSource.buffer = this.audioBuffer;
        this.soundSource.connect( gainNode );

        if ( typeof this.soundSource.start === 'function' ) {
          this.soundSource.start( 0 );
        }
        else if ( typeof this.soundSource.noteOn === 'function' ) {
          this.soundSource.noteOn( 0 );
        }
      }
    }
    else {

      // Use the HTML5 API (doesn't exist for phantomjs)
      this.sound.play && this.sound.play();
    }
  },

  stop: function() {
    if ( audioContext && this.soundSource ) {

      // use Web Audio API
      this.soundSource.stop();
    }
    else {

      // use HTML5 audio (doesn't exist for phantomjs)
      this.sound.pause && this.sound.pause();
      this.sound.currentTime = 0;
    }
  }
}, {

  // @public, @static, global control for audio on/off
  audioEnabledProperty: audioEnabledProperty
} );

// If an audio context was created, it means that we are using Web Audio.  Many browsers have adopted policies to
// prevent a web page from being able to play a sound before a user interacts with it, so the following code was
// necessary to essentially detect when the user starts interacting with the sim and enable the audio context, which
// in turn enables the ability to produce sound.
if ( audioContext ) {

  // function to remove the listeners, used to avoid code duplication
  const removeUserInteractionListeners = () => {
    window.removeEventListener( 'touchstart', resumeAudioContext, false );
    if ( Display.userGestureEmitter.hasListener( resumeAudioContext ) ) {
      Display.userGestureEmitter.removeListener( resumeAudioContext );
    }
  };

  // listener that resumes the audio context
  const resumeAudioContext = () => {

    if ( audioContext.state !== 'running' ) {

      // tell the audio context to resume
      audioContext.resume()
        .then( () => {
          removeUserInteractionListeners();
        } )
        .catch( err => {
          const errorMessage = 'error when trying to resume audio context, err = ' + err;
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
}

export default Sound;