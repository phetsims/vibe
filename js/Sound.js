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

  // Constants
  var SILENCE_PATH = 'sounds/empty.mp3';

  // Set up a single audio context that will be used by all sounds when
  // using Web Audio API.
  var audioContext;
  if ( 'AudioContext' in window ) {
    audioContext = new AudioContext();
  }
  else if ( 'webkitAudioContext' in window ) {
    audioContext = new webkitAudioContext();
  }

  /**
   * @param {String|{url|base64}} soundURL - name of this sound no path name, e.g. "ding.mp3".
   * If it is an object, it has either a url or base64 field, depending on whether it is running at requirejs development time or build time.
   * @constructor
   */
  function Sound( soundName ) {
    var soundURL = soundName;

    //TODO: Switch over to this style for the constructor once clients are all using it.
    if ( typeof(soundName) === 'object' ) {

      //Load the path from the requirejs development option
      if ( soundName.url ) {
        soundURL = soundName.url;
      }

      //Load the base64 text
      else if ( soundName.base64 ) {
        var base64 = soundName.base64;

      }
      else {
        throw new Error( 'Sound argument incorrect' );
      }
    }

    var self = this;

    // Locate the sound data.
    this.sound = document.getElementById( soundURL );
    if ( this.sound !== null ) {
      // Sound data is already in the DOM.  For PhET's purposes, it should be
      // encoded as base64 data.  If it's not, throw an error.
      if ( this.sound.getAttribute( 'src' ).match( /^data/ ) === null ) {
        throw new Error( "Embedded audio data must be encoded as base64." );
      }
    }
    else {
      // Set up an audio element in the DOM with a relative path.
      //TODO: This is for backward compatibility, can be deleted once we have cut over to audio! plugin
      if ( !base64 ) {
        this.sound = document.createElement( 'audio' );
        this.sound.setAttribute( 'src', soundURL );
        this.sound.load();
      }
    }

    if ( this.sound === null && !base64 ) {
      // Sound not found.
      throw new Error( "The specified sound was not found: " + soundURL );
    }

    // Load the sound. TODO: Consider moving this to sim preload phase.
    if ( audioContext ) {
      var arrayBuff;

//      debugger;
      if ( base64 || this.sound.getAttribute( 'src' ).match( /^data:/ ) !== null ) {
        // We're working with base64 data, so we need to decode it.

        //The regular expression removes the mime header
        var soundData = (base64 ? base64 : this.sound.getAttribute( 'src' )).replace( new RegExp( '^.*,' ), '' );
        arrayBuff = base64Binary.decodeArrayBuffer( soundData );
        audioContext.decodeAudioData( arrayBuff,
          function( audioData ) {
//            debugger;
            self.audioBuffer = audioData;
          },
          function() {
            console.log( "Error: Unable to decode audio data." );
          } );
      }
      else {
        // Sound is not yet in DOM, try loading via relative URL path.
        var request = new XMLHttpRequest();
        request.open( 'GET', soundURL, true );
        request.responseType = 'arraybuffer';
        request.onload = function() {
          // Decode the audio data asynchronously
          audioContext.decodeAudioData( request.response,
            function( audioData ) {
              self.audioBuffer = audioData;
            },
            function() { console.log( "Error loading and decoding sound, sound name: " + soundURL ); }
          );
        };
        request.onerror = function() {
          console.log( "Error occurred on request (delete this code when debugged)" );
        };

        request.send();
      }
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
    var silenceDomNode = document.createElement( 'audio' );
    silenceDomNode.setAttribute( 'id', SILENCE_PATH );
    // Base64 encoded silence, taken from empty.mp3, created by PhET.
    silenceDomNode.setAttribute( 'src', 'data:audio/mpeg;base64,//s0wAAAAAABLgAAACAAACXAAAAE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////s0wD2AAAABLgAAACAAACXAAAAE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAA//s0wHsAAAABLgAAACAAACXAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//s0wLiAAAABLgAAACAAACXAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//s0wPYADQABLgAAACAAACXAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//s0wP+AD2ABLgAAACAAACXAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' );
    document.body.appendChild( silenceDomNode );

    var silence = new Sound( SILENCE_PATH );
    var playSilence = function() {
      silence.play();
      window.removeEventListener( 'touchstart', playSilence, false );
    };
    window.addEventListener( 'touchstart', playSilence, false );
  }

  return Sound;
} );
