// Copyright 2002-2013, University of Colorado Boulder

/**
 * Type for loading a playing sounds, works on multiple platforms and supports
 * embedded base64 data.  This uses Web Audio when available, primarily
 * because the webkit platforms were failing with cross-domain errors when
 * attempting to load audio data from embedded data URIs.  This was occurring
 * in mid-September 2013.  Simplification may be possible if the cross-domain
 * issue goes away at some point in the future.
 *
 * TODO: Do we want to specify just the stem of the file name and have this
 * code figure out whether to use mp3 or ogg?
 */
define( function( require ) {
  'use strict';

  // Imports
  var base64Binary = require( 'SHERPA/base64Binary' );
  var platform = require( 'PHET_CORE/platform' );
  var empty = require( 'audio!VIBE/../audio/empty.mp3' );

  // Set up a single audio context that will be used by all sounds when
  // using Web Audio API.
  var audioContext;
  if ( 'AudioContext' in window ) {
    /*global AudioContext*/ // Disable jshint warning.
    audioContext = new AudioContext();
  }
  else if ( 'webkitAudioContext' in window ) {
    /*global webkitAudioContext*/
    /*jshint newcap:false*/ // Disable jshint warning.
    audioContext = new webkitAudioContext();
  }

  /**
   * @param {Object} soundInfo - Object containing information
   * that defines the sound, either a RUL or a base64 definition.
   * @constructor
   */
  function Sound( soundInfo ) {

    // Parameter checking.
    if ( typeof( soundInfo ) !== 'object' || ( typeof( soundInfo.base64 ) === 'undefined' && typeof( soundInfo.url ) === 'undefined' ) ) {
      throw new Error( 'Error with soundInfo object: Does not contain a necessary value.' );
    }

    var self = this;

    // Load the sound.
    if ( audioContext ) {
      var arrayBuff;

      if ( soundInfo.base64 ) {
        // We're working with base64 data, so we need to decode it.
        // The regular expression removes the mime header
        var soundData = ( soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' )).replace( new RegExp( '^.*,' ), '' );
        arrayBuff = base64Binary.decodeArrayBuffer( soundData );
        audioContext.decodeAudioData( arrayBuff,
          function( audioData ) {
            self.audioBuffer = audioData;
          },
          function() {
            console.log( "Error: Unable to decode audio data." );
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
            function() { console.log( "Error loading and decoding sound, sound name: " + soundInfo.url ); }
          );
        };
        request.onerror = function() {
          console.log( "Error occurred on attempt to load sound data." );
        };
        request.send();
      }
    }
    else {
      // Web Audio API is not available, so insert the sound into the DOM and
      // use HTML5 audio.
      this.sound = document.createElement( 'audio' );
      this.sound.setAttribute( 'src', soundInfo.base64 ? soundInfo.base64 : soundInfo.url );
      this.sound.load();
    }
  }

  /**
   * Plays the sound using the Web Audio API if available or HTML5 audio if not.
   */
  Sound.prototype.play = function() {
    if ( audioContext ) {
      // Use the Web Audio API.
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
    else {
      // Use the HTML5 API.
      this.sound.play();
    }
  };

  /**
   * Stop the sound if it is currently playing.
   */
  Sound.prototype.stop = function() {
    if ( 'AudioContext' in window ) {
      // TODO: TBD
    }
    else if ( 'webkitAudioContext' in window ) {
      // TODO: TBD
    }
    else {
      this.sound.pause();
      this.sound.currentTime = 0;
    }
  };

  // Workaround for iOS+Safari: In this situation, we must play an audio file
  // from a thread initiated by a user event such as touchstart before any
  // sounds will play. This is impossible with scenery, since all scenery
  // events are batched and dispatched from the animation loop.
  // See http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
  // Note: This requires the user to touch the screen before audio can be played
  if ( platform.mobileSafari ) {

    var silence = new Sound( empty );
    var playSilence = function() {
      silence.play();
      window.removeEventListener( 'touchstart', playSilence, false );
    };
    window.addEventListener( 'touchstart', playSilence, false );
  }

  return Sound;
} );
