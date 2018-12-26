const Greeting = require('../components/Greeting/Greeting');

const ComponentLoader = require('./ComponentLoader');

ComponentLoader.addComponents({
  Greeting,
});

ComponentLoader.load(document);
