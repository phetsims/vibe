// Copyright 2002-2013, University of Colorado Boulder

/**
 * Copyright 2002-2013, University of Colorado
 * RequireJS configuration file for Vibe testing.
 * @author John Blanco
 */

require.config( {
  deps: ["play-sound"],

  config: {
  },

  paths: {

    // plugins
    audio: '../../chipper/requirejs-plugins/audio',

    // PhET libs, uppercase names to identify them in require.js imports
    ASSERT: '../../assert/js',
    PHET_CORE: '../../phet-core/js',
    SHERPA: '../../sherpa',
    VIBE: '../../vibe/js'
  },

  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts

} );
