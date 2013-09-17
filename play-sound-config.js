// Copyright 2002-2013, University of Colorado Boulder

/**
 * Copyright 2002-2013, University of Colorado
 * RequireJS configuration file for Vibe testing.
 * @author John Blanco
 */

require.config( {
  deps: ["js/play-sound"],

  config: {
  },

  paths: {
    VIBE: '../vibe/js'
  },

  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts

} );
