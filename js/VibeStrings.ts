// Copyright 2020-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import vibe from './vibe.js';

type StringsType = {
  'vibe': {
    'title': string;
    'titleStringProperty': TReadOnlyProperty<string>;
  }
};

const vibeStrings = getStringModule( 'VIBE' ) as StringsType;

vibe.register( 'vibeStrings', vibeStrings );

export default vibeStrings;
