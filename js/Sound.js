// Copyright 2002-2013, University of Colorado Boulder

/**
 * Type for loading and playing sounds, works on multiple platforms and
 * supports embedded base64 data.  This uses Web Audio when available,
 * primarily because the webkit platforms were failing with cross-domain
 * errors when attempting to load audio data from embedded data URIs.  This
 * was occurring in mid-September 2013.  Simplification may be possible if the
 * cross-domain issue goes away at some point in the future.
 */
define( function( require ) {
  'use strict';

  // modules
  var Display = require( 'SCENERY/display/Display' );
  var platform = require( 'PHET_CORE/platform' );
  var empty = require( 'audio!VIBE/empty.mp3' );
  var Property = require( 'AXON/Property' );

  // Global property that allows all audio to be turned on/off, see #11
  var audioEnabledProperty = new Property( true );

  // Set up a single audio context that will be used by all sounds when
  // using Web Audio API.
  var audioContext;
  if ( 'AudioContext' in window ) {
    audioContext = new AudioContext();
  }
  else if ( 'webkitAudioContext' in window ) {
    audioContext = new webkitAudioContext(); // eslint-disable-line no-undef
  }

  /**
   * @param {Array} soundInfoArray An array of 'soundInfo' objects.  Each
   * soundInfo object includes *either* a url that points to the sound to be
   * played *or* a base64-encoded version of the sound data.  The array is
   * generally used to hold multiple formats for a given sound (e.g. mp3 and
   * ogg).
   * @constructor
   */
  function Sound( soundInfoArray ) {

    var self = this;

    // For backward compatibility with earlier versions, support the case
    // where a single soundInfo object is passed in.
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

      // Determine whether this audio format is supported.
      if ( this.sound.canPlayType( audioFormat ) ) {
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

  /**
   * Plays the sound using the Web Audio API if available or HTML5 audio if not.
   * @public
   */
  Sound.prototype.play = function() {
    if ( !Sound.audioEnabledProperty.get() ) {
      return;
    }
    if ( audioContext ) {
      // Use the Web Audio API.
      this.soundSource = audioContext.createBufferSource();
      this.soundSource.buffer = this.audioBuffer;
      this.soundSource.connect( audioContext.destination );

      if ( typeof this.soundSource.start === 'function' ) {
        this.soundSource.start( 0 );
      }
      else if ( typeof this.soundSource.noteOn === 'function' ) {
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
   * @public
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

  // If an audio context was created, it means that we are using Web Audio.  Many browsers have adopted policies to
  // prevent a web page from being able to play a sound before a user interacts with it, so the following code was
  // necessary to essentially detect when the user starts interacting with the sim and enable the audio context, which
  // in turn enables the ability to produce sound.
  if ( audioContext ) {

    // function to remove the listeners, used to avoid code duplication
    var removeUserInteractionListeners = function(){
      window.removeEventListener( 'touchstart', resumeAudioContext, false );
      if ( Display.userGestureEmitter.hasListener( resumeAudioContext ) ) {
        Display.userGestureEmitter.removeListener( resumeAudioContext );
      }
    };

    // listener that resumes the audio context
    var resumeAudioContext = function(){

      if ( audioContext.state !== 'running' ) {

        // tell the audio context to resume
        audioContext.resume()
          .then( function(){
            removeUserInteractionListeners();
          } )
          .catch( function(){
            var errorMessage = 'error when trying to resume audio context, err = ' + err;
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

  // @pubic
  Sound.audioEnabledProperty = audioEnabledProperty;

  return Sound;
} );