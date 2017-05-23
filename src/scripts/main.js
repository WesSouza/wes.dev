/* globals Raven */
Raven.config('https://652c9909de254c328378997a71c5b09f@sentry.io/171332').install();

const Greeting = require('../components/Greeting/Greeting');

const ComponentLoader = require('./ComponentLoader');

ComponentLoader.addComponents({
  Greeting,
});

ComponentLoader.load(document);
