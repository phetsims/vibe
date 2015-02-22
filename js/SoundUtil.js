// Copyright 2002-2015, University of Colorado Boulder

/**
 * Utility functions for working with audio.
 *
 * TODO: This was developed for the sonification prototypes and has not been thoroughly tested.  This will need to be
 * done before this is used in any production code.
 */
define( function( require ) {
  'use strict';

  // modules
  var base64Binary = require( 'SHERPA/base64binary' );

  return {

    /**
     * Function that loads the specified sound into the provided WebAudio 'buffer source' node.  The loading is done
     * asynchronously, so the node is not guaranteed to be immediately after this is called.
     * @param {AudioNode} sourceAudioNode - a WebAudio buffer node
     * @param {Array} soundInfoArray An array of 'soundInfo' objects.  Each soundInfo object includes *either* a url
     * that points to the sound to be played *or* a base64-encoded version of the sound data.  The array is generally
     * used to hold multiple formats for a given sound (e.g. mp3 and ogg) and to support loading of base64 data for
     * built PhET simulations.  The format is intended to be compatible with the PhET audio plugin.
     */
    loadSoundIntoAudioSource: function( sourceAudioNode, soundInfoArray ) {

      // For backward compatibility with earlier versions, support the case where a single soundInfo object is passed in.
      var localSoundInfoArray = soundInfoArray;
      if ( !( soundInfoArray instanceof Array ) ) {
        localSoundInfoArray = new Array( soundInfoArray );
      }

      // parameter checking
      localSoundInfoArray.forEach( function( soundInfo ) {
        if ( typeof( soundInfo ) !== 'object' || ( typeof( soundInfo.base64 ) === 'undefined' && typeof( soundInfo.url ) === 'undefined' ) ) {
          throw new Error( 'Error with soundInfo object: Does not contain a necessary value.' );
        }
      } );

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

      this.audioElement = document.createElement( 'audio' );
      var supportedFormatFound = false;
      var soundInfo = null;
      for ( var i = 0; i < localSoundInfoArray.length && !supportedFormatFound; i++ ) {

        soundInfo = localSoundInfoArray[ i ];

        // Identify the audio format.
        var audioFormat;
        if ( soundInfo.url ) {
          audioFormat = 'audio/' + soundInfo.url.slice( soundInfo.url.lastIndexOf( '.' ) + 1 );
        }
        else {
          audioFormat = soundInfo.base64.slice( soundInfo.base64.indexOf( ':' ) + 1, soundInfo.base64.indexOf( ';' ) );
        }

        // Determine whether this audio format is supported.
        if ( this.audioElement.canPlayType( audioFormat ) ) {
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
      if ( supportedFormatFound && audioContext ) {
        var arrayBuff;

        if ( soundInfo.base64 ) {
          // We're working with base64 data, so we need to decode it. The regular expression removes the mime header.
          var soundData = ( soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' )).replace( new RegExp( '^.*,' ), '' );
          arrayBuff = base64Binary.decodeArrayBuffer( soundData );
          audioContext.decodeAudioData( arrayBuff,
            function( audioData ) {
              sourceAudioNode.buffer = audioData;
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
                sourceAudioNode.buffer = audioData;
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
        // TODO: May need to do something less drastic here if support doesn't exist on all targeted PhET platforms.
        throw new Error( 'web audio not supported on this platform' );
      }
    }
  };
} );