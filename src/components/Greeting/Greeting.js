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
