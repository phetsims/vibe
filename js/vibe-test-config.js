// Copyright 2002-2015, University of Colorado Boulder

/**
 * RequireJS configuration file for vibe testing.
 * @author John Blanco
 */
require.config( {
  deps: [ 'vibe-test-main' ],

  config: {
  },

  paths: {

    // plugins
    audio: '../../chipper/requirejs-plugins/audio',

    // PhET libs, uppercase names to identify them in require.js imports
    AXON: '../../axon/js',
    PHET_CORE: '../../phet-core/js',
    SHERPA: '../../sherpa',

    // This library
    VIBE: '.'
  },

  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
} );
