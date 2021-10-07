/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,SUQzAwAAAAAAPFRJVDIAAAAcAAAAUmVtb3ZlIEJhdHRlcnkgU291bmQgRWZmZWN0VFBFMQAAAAwAAABKb2huIEJsYW5jb//7QMQAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAADQAACf8AExMTExMTEycnJycnJycnOzs7Ozs7OztOTk5OTk5OYmJiYmJiYmJ2dnZ2dnZ2domJiYmJiYmdnZ2dnZ2dnbGxsbGxsbGxxMTExMTExNjY2NjY2NjY7Ozs7Ozs7Oz/////////AAAAOUxBTUUzLjk4cgGWAAAAAAAAAAAUOCQE+UIAADgAAAn/UFVQZQAAAAAA//tAxAAACEiZKBT5AAlaE/B3FVIDve//owKw0ydk7Lmq1ISgGwAAAPZAC8RuJsC0AMSCdBCQG+AcuAFYg8VwNWCdDUi58myff///+tN1GBcQMyKE4aLDwBQKBwOBwPB2KAAAAAPzjfDAL/wMdvkDtZ5LKaJ8Ddi0A2qDwMXDjtgYuBQGNRSBh0Hhe//AwiBxAw4Bkw6BRtmXwuoAwIAgyyAMDwbHQCgGi3/m4e+dAG0QAABKmoH/+0LEBAAJoNFhvCoAESuaJkwPVSD5oUUGeUoAJMTQdUDCoiEGWFzE+OaVVE0Txiyy6o2rUbIstSRk9FT/5iTAn1br0UVJVl1uk9bJJdHrbzJjInhS6Tf//xWAAAgD88KdwDApBNBwB7eDoAJgRBNGrMoCYKQCgOAHXQ78OE+bobOiksxV/9d9JalmQ/gPEwGtwQIJF0gw7jV2/////sNctm///9IECb8DP8Obz1Y5SXpXL4AZw7L/+0LECQALCM9ObaGywTKaa+g8IY9i5WZmSmQBRgQYezKIoL7ZvKIwooovZBkvb3CS+nHNwHACgeSjJuowGsUjNkboILTp1Mt+gy31p06DLehQWP5KGl9+J//nrrABKBciAciDYckAjlcmoBQZzQ4EZBAYoIA16ZyqmrZJ9Xap7//Am7d3SsJQkEen8xD7WZTvlNLbCQIh7rlolzMEEHGBY3lBCcqFreEgAACAxwAHnGq5apgBSWj/+0LEB4EJuLFBQ2mrCUiV5QXtqeqaSOigD9ObgDCocwCCxe1pjLqelpatmtlOl1A2pPR+tpwd4DdDWyieTTQvGxImg9iopIt//0klDDAmjbRU38Qg//3hdmozPQp7G/V4kGNAKEQNZh1A7G64MkeCiGgK5iIsW5ZNCakUvwJ9FXwr1dYWP1+7nO85rOpAaIBimAj1DcXFAaF2coW/am3f+Sjb//xMpQAZJSSQDYuHadiDxBUgBZL/+0LECIAKmLFlQz0KeUMV6ihtrRvjJGMLaCZBcK1WiPEwrU7pJQNFuv+JYHwQdw4PhWoeiPEwNOHHujxLVdI6SJD7VSVT7QBlQtUMqjKqH1TqhlV1VKqvVZAAAguWgBJQdCSSKSKptjRINmQTpkoYIAVeCbrW3YfeGDdm9jLq/tt38Cgfv/4lip27OH1r+Ka79dR8e9j2XWxdY8dNtBQMaRpv0DVdtUX8alLAAQWgPoABvVPYkdL/+0LEBoBH9I1NrbX0kSKRJcnsqat89zGtAI6AGvYAYFOTR9w7f59upZtRav3LWpa+HZL/+2P5qIFnFY1Uj0fNQlXorPlX/0gV///1Yk4LOkiizJgJgHGCcDeaqJlJiGAenWELKsDZm8ypIbl8khp8rfKtalv67zXcc7yKQtJF7G+2Qcw3JxJCIxkNgi8/JcAqCAAAAygAD//naSvU3FFdgYDDDsLz9iHQNKY0JCOSckJgZNWPEwn/+0LEEwBIKI01TppwiO4Rp+gexLsIHlKlX2sx7psHdBdD1/l/+gsZF+iSgnNytH8BQAYBSfHUp70pfBHcCBUapw4YNAwnOvB24XVSCrS6tMWJydl8vy9XUdB4W21WVX1vm7kYYKupIbk6TvYEAAgBuAAPlMJl0NNxQ+EQjmImDmCQRp7KNuhuNEQO1LOO6evcv5bqUykNECoQeFX+ZerQMC+aeZEVtSEUwH/FViT+s5VMWRMIRIP/+0DEJYBHrI07QXZniPcPpkge0Lh6OSM6waDgpQDofuhLBoUlYaazJ+Y016X3EilN3mcjwk1AshMDqr+U/6yUJYIRM7dVMARpwAB9UBoacaeJAA5GIQcnEz16Mov2Vc0Gq+OaJvPpsozdnsmCSnW0JqjUUTZvqMxO0EwabNIakHAAQH78hwBw0fZAIQ2c2k4qDVoMWYJIHwTwh/sKo78XptX6lzFjTUcCUNl6ClKy8rQW8nR0h//7QsQ4AEcwfzzhcakA9I/m6C5FKaVKzNvP/RIQIBtAAD/jTYxmGmQjIoNVygxmCGGuQpvGKgOIb1083Bz2j0PEE7XTUeTSWahFh0del5ge6syKx4mmSL116flDVt5ody04KpgIDmXeI1UgYCMGLx4yStQSG+BixIAh931YxLPjl9W5zqEtj+EqkwMY2cZLTVK8Dd23zMzUqD4zd0Xa+1siJCWNNILnGLCZRKmDBBh4uZUImAAKaf/7QsRNgEfofzLg8aWJBY+lCB2w6B7I2mkweVKHxFYVzrt2XNlVZzKPCCyYJXPtSzP9gcq5+ZmdGoDbxmVQUAfRlf91PUUvqKLEwLlq2CxNLPhpLT4SVmiPdz30tbeP4kaSu1Y78PdNxINMGY+t/rWGpPhIp9RLkFCNygCAABsYAAyrX7tgtG7ErGRFAou5Ry1RKZnfqx7PCkj1y4R6eHWVJI7dMMNdeNAN9U5rbfzdoFptKTU2Mv/7QsReAUh4fyIDbYlA7pBmqAy8rFbiHXnSmLvTGzFpTV0V9oUL3hTGzq/GoRAKwuHlIqlxptG1SiJ1mEcjrr2W1vzh0ZwQZ1N+wqA0EZ1Wvv91LAkaKhlRDnZ+qJcmisjCIeBlMA4hXQ+AFYBdF4Lkql8uLedMRiCjQmAFBJJyMHbO+ZarRAWCpJ/G3HGzc7//pUxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsRvAUeQfzFAZeco84+kiJyxVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsSDA8fwaw4EvMXIAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;