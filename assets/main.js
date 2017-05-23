(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Greeting {
  constructor({ element }) {
    const visited = !!localStorage.v;

    const message = element.getAttribute(!visited ? 'data-message-meet' : 'data-message-again');
    element.innerText = message;

    element.classList.add('Greeting-loaded');

    localStorage.v = '1';
  }
}

module.exports = Greeting;

},{}],2:[function(require,module,exports){
const componentLibrary = {};

const loadComponent = (element, componentName) => {
  if (!element._component) {
    const Component = componentLibrary[componentName];
    element._component = new Component({ element });
  }

  return element._component;
};

const loadComponentAsync = (element, componentName) => {
  requestAnimationFrame(() => loadComponent(element, componentName));
};

const addComponents = (components) => {
  Object.assign(componentLibrary, components);
};

const load = (node) => {
  const componentElements = Array.from(node.querySelectorAll('[data-component]'));

  componentElements.forEach(componentElement => {
    const componentName = componentElement.getAttribute('data-component');
    loadComponentAsync(componentElement, componentName);
  });
};

module.exports = {
  addComponents,
  load,
};

},{}],3:[function(require,module,exports){
/* globals Raven */
Raven.config('https://652c9909de254c328378997a71c5b09f@sentry.io/171332').install();

const Greeting = require('../components/Greeting/Greeting');

const ComponentLoader = require('./ComponentLoader');

ComponentLoader.addComponents({
  Greeting,
});

ComponentLoader.load(document);

},{"../components/Greeting/Greeting":1,"./ComponentLoader":2}]},{},[3])