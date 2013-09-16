// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // Imports
  var base64Binary = require( 'base64Binary' );

  /**
   * @param soundID ID in the DOM for the sound.
   * @constructor
   */
  function Sound( soundID ) {

    // Set up the audio context.  This is only used if the Web Audio API is
    // supported.
    if ( 'AudioContext' in window ) {
      this.audioContext = new AudioContext();
    }
    else if ( 'webkitAudioContext' in window ) {
      this.audioContext = new webkitAudioContext();
    }
    else {
      this.audioContext = undefined;
    }

    // Load the sound.
    this.sound = document.getElementById( soundID );
    if ( this.audioContext ) {
      var soundData = this.sound.getAttribute( 'src' ).replace( new RegExp( '^.*,' ), '' );
      var arrayBuff = base64Binary.decodeArrayBuffer( soundData );
      var self = this;
      this.audioContext.decodeAudioData( arrayBuff,
        function( audioData ) {
          self.audioBuffer = audioData;
        },
        function() {
          console.log( "Error: Unable to decode audio data." )
        } );
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
    // TODO: TBD.
  };

  return Sound;
} );
