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
  var base64Binary = require( 'VIBE/base64Binary' );

  /**
   * @param soundName - name of this sound no path name, e.g. "ding.mp3".
   * @constructor
   */
  function Sound( soundName ) {

    var self = this;

    // Determine whether Web Audio API is supported and set up an audio context if so.
    if ( 'AudioContext' in window ) {
      this.audioContext = new AudioContext();
    }
    else if ( 'webkitAudioContext' in window ) {
      this.audioContext = new webkitAudioContext();
    }
    else {
      this.audioContext = undefined;
    }

    // Locate the sound data.
    this.sound = document.getElementById( soundName );
    if ( this.sound !== null ) {
      // Sound data is already in the DOM.  For PhET's purposes, it should be
      // encoded as base64 data.  If it's not, throw an error.
      if ( this.sound.getAttribute( 'src' ).match( /^data/ ) === null ) {
        throw new Error( "Embedded audio data must be encoded as base64." );
      }
    }
    else {
      // Set up an audio element in the DOM with a relative path.
      this.sound = document.createElement( 'audio' );
      this.sound.setAttribute( 'src', soundName );
    }

    if ( this.sound === null ) {
      // Sound not found.
      throw new Error( "The specified sound was not found: " + soundName );
    }

    // Load the sound. TODO: Consider moving this to sim preload phase.
    if ( this.audioContext ) {
      var arrayBuff;
      if ( this.sound.getAttribute( 'src' ).match( /^data:/ ) !== null ) {
        // We're working with base64 data, so we need to decode it.
        var soundData = this.sound.getAttribute( 'src' ).replace( new RegExp( '^.*,' ), '' );
        arrayBuff = base64Binary.decodeArrayBuffer( soundData );
        this.audioContext.decodeAudioData( arrayBuff,
          function( audioData ) {
            self.audioBuffer = audioData;
          },
          function() {
            console.log( "Error: Unable to decode audio data." )
          } );
      }
      else {
        // Sound is not yet in DOM, try loading via relative URL path.
        var request = new XMLHttpRequest();
        request.open( 'GET', soundName, true );
        request.responseType = 'arraybuffer';
        request.onload = function() {
          // Decode the audio data asynchronously
          self.audioContext.decodeAudioData( request.response,
            function( audioData ) {
              self.audioBuffer = audioData;
            },
            function() { console.log( "Error loading and decoding sound, sound name: " + soundName ); }
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
    if ( this.audioContext ) {
      // Use the Web Audio API.
      this.soundSource = this.audioContext.createBufferSource();
      this.soundSource.buffer = this.audioBuffer;
      this.soundSource.connect( this.audioContext.destination );

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
    if ( this.audioContext ) {

    }
    else {
      this.sound.pause();
      this.sound.currentTime = 0;
    }
  };

  return Sound;
} );
