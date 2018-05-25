// Copyright 2013-2015, University of Colorado Boulder

/**
 * Type for loading and playing sounds, works on multiple platforms and supports embedded base64 data.  This uses Web
 * Audio when available, primarily because the webkit platforms were failing with cross-domain errors when attempting to
 * load audio data from embedded data URIs.  This was occurring in mid-September 2013.  Simplification may be possible
 * if the cross-domain issue goes away at some point in the future.
 */
define( function( require ) {
  'use strict';

  // modules
  var Display = require( 'SCENERY/display/Display' );
  var inherit = require( 'PHET_CORE/inherit' );
  var platform = require( 'PHET_CORE/platform' );
  var Property = require( 'AXON/Property' );
  var vibe = require( 'VIBE/vibe' );

  // sounds
  var empty = require( 'audio!VIBE/empty.mp3' );

  // global property that allows all audio to be turned on/off, see #11
  var audioEnabledProperty = new Property( true );

  // Set up a single audio context that will be used by all sounds when using Web Audio API.
  var audioContext;
  if ( 'AudioContext' in window ) {
    audioContext = new AudioContext();
  }
  else if ( 'webkitAudioContext' in window ) {
    audioContext = new webkitAudioContext(); // eslint-disable-line no-undef
  }

  /**
   * @param {Array} soundInfoArray An array of 'soundInfo' objects.  Each soundInfo object includes *either* a url that
   * points to the sound to be played *or* a base64-encoded version of the sound data.  The array is generally used to
   * hold multiple formats for a given sound (e.g. mp3 and ogg).
   * @constructor
   */
  function Sound( soundInfoArray ) {

    var self = this;

    // For backward compatibility with earlier versions, support the case where a single soundInfo object is passed in.
    var localSoundInfoArray = soundInfoArray;
    if ( !( soundInfoArray instanceof Array ) ) {
      localSoundInfoArray = new Array( soundInfoArray );
    }
    // Parameter checking.
    localSoundInfoArray.forEach( function( soundInfo ) {
      if ( typeof( soundInfo ) !== 'object' || ( typeof( soundInfo.base64 ) === 'undefined' && typeof( soundInfo.url ) === 'undefined' ) ) {
        throw new Error( 'Error with soundInfo object: Does not contain a necessary value.' );
      }
    } );

    this.sound = document.createElement( 'audio' );
    var supportedFormatFound = false;
    var soundInfo = null;
    for ( var i = 0; i < localSoundInfoArray.length && !supportedFormatFound; i++ ) {

      soundInfo = localSoundInfoArray[ i ];

      // Identify the audio format.
      var audioFormat;
      if ( soundInfo.url ) {
        audioFormat = 'audio/' + soundInfo.url.slice( soundInfo.url.lastIndexOf( '.' ) + 1,
            soundInfo.url.lastIndexOf( '?' ) >= 0 ? soundInfo.url.lastIndexOf( '?' ) : soundInfo.url.length );
      }
      else {
        audioFormat = soundInfo.base64.slice( soundInfo.base64.indexOf( ':' ) + 1, soundInfo.base64.indexOf( ';' ) );
      }

      // Determine whether this audio format is supported (doesn't exist for phantomjs)
      if ( this.sound.canPlayType && this.sound.canPlayType( audioFormat ) ) {
        // This one is supported, so fall out of the loop to the next section.
        supportedFormatFound = true;
      }
      else {
        if ( i === localSoundInfoArray.length - 1 ) {
          console.log( 'Warning: No supported audio formats found, sound will not be played.' );
        }
      }
    }

    // Load the sound.
    if ( supportedFormatFound ) {
      if ( audioContext ) {
        var arrayBuff;

        if ( soundInfo.base64 ) {
          // We're working with base64 data, so we need to decode it. The regular expression removes the mime header.
          var soundData = ( soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' )).replace( new RegExp( '^.*,' ), '' );
          var byteChars = window.atob( soundData );
          var byteArray = new window.Uint8Array( byteChars.length );
          for ( var j = 0; j < byteArray.length; j++ ) {
            byteArray[ j ] = byteChars.charCodeAt( j ); // need check to make sure this cast doesn't give problems?
          }
          arrayBuff = byteArray.buffer;

          audioContext.decodeAudioData( arrayBuff,
            function( audioData ) {
              self.audioBuffer = audioData;
            },
            function() {
              console.log( 'Error: Unable to decode audio data.' );
            } );
        }
        else {
          // Load sound via URL.
          var request = new XMLHttpRequest();
          request.open( 'GET', soundInfo.url, true );
          request.responseType = 'arraybuffer';
          request.onload = function() {
            // Decode the audio data asynchronously
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
        // Web Audio API is not available, so insert the sound into the DOM and
        // use HTML5 audio.
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
          this.soundSource.connect( audioContext.destination );

          if ( 'AudioContext' in window ) {
            this.soundSource.start( 0 );
          }
          else if ( 'webkitAudioContext' in window ) {
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

  // Below is some platform-specific code for handling a number of issues related to audio.  It may be possible to
  // remove some or all of this as Web Audio becomes more consistently implemented.
  if ( audioContext ) {

    if ( !platform.mobileSafari ) {

      // In some browsers the audio context is not allowed to run before the user interacts with the simulation.  The
      // motivation for this is to prevent auto-play of sound (mostly videos) when users land on websites, but it ends
      // up preventing PhET sims from being able to play sound.  To deal with this, we add a listener that can check the
      // state of the audio context and "resume" it if necessary when the user starts interacting with the sim.  See
      // https://github.com/phetsims/vibe/issues/32 for more information.
      if ( audioContext.state !== 'running' ) {

        Display.userGestureEmitter.addListener( function resumeAudioContext() {
          if ( audioContext.state !== 'running' ) {

            // the audio context isn't running, so tell it to resume
            audioContext.resume().catch( function( err ) {
              assert && assert( false, 'error when trying to resume audio context, err = ' + err );
            } );
          }
          Display.userGestureEmitter.removeListener( resumeAudioContext ); // only do this once
        } );
      }
    }
    else {

      // There is a different issue for audio on iOS+Safari: On this platform, we must play an audio file from a thread
      // initiated by a user event such as touchstart before any sounds will play.  This requires the user to touch the
      // screen before audio can be played. See
      // http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
      var silence = new Sound( empty );
      var playSilence = function() {
        silence.play();
        window.removeEventListener( 'touchstart', playSilence, false );
      };
      window.addEventListener( 'touchstart', playSilence, false );
    }
  }

  return Sound;

} );