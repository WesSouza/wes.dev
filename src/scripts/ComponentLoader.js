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
