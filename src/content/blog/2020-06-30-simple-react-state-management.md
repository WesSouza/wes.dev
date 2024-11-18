---
title: 'Simple React State Management'
slug: simple-react-state-management
description: 'A good state system aims to be concise, easy to scale, and easy to debug. State is very unique per pr...'
date: '2020-06-30T17:39:55.503Z'
tags: ['react', 'webdev', 'javascript', 'typescript']
published: true
wes95_file: '/C/My_Documents/Blog/Simple React State Management.doc'
---

A good state system aims to be concise, easy to scale, and easy to debug. State is very unique per project, so a "one size fits all" framework is very unlikely to ever exist. [Redux](https://redux.js.org/), [MobX](https://mobx.js.org/README.html), [XState](https://github.com/statelyai/xstate), [Apollo](https://www.apollographql.com/) and [Relay](https://relay.dev/) are some great frameworks, but they all have compromises.

Instead of utilizing a framework, we can use small libraries and apply strong concepts to guide our own code. The result is a robust and easy to debug codebase. Pure JavaScript.

---

## Action Flow and Immutability

Two concepts that go hand in hand are **action flow** and **immutability**. Actions are the only place where the state is allowed to mutate - which helps to keep the state predictable. When mutating the state, we always replace object references with new ones instead of altering the original object, preventing side effects on methods that already are operating with the data elsewhere.

[Immer](https://immerjs.github.io/immer) is a small library that helps us write object manipulations that look like traditional code, but preserve the original state of the object. Here's an example of an action updating state using Immer:

```js
import produce from 'immer';

let state = {
  isLoggedIn: false,
};

async function authenticateUser(username, password) {
  const { error, user } = await api.loginUser({ username, password });
  if (!error && user) {
    state = produce((stateDraft) => {
      stateDraft.isLoggedIn = true;
    });
  }
}
```

The `produce` function takes a callback that receives a draft version of the object we want to mutate. Every operation inside of the callback is applied to the draft, preserving the original object state.

We then update the reference to that object so that future references retrieve new data.

We can build a library that wraps `produce`, and helps us create new state objects and emits an event whenever there is a mutation. Other parts of our software can then be aware of that change and react accordingly.

You can take a look at an example on the [StateManager.ts file](https://github.com/WesSouza/immer-state/blob/master/src/StateManager.ts).

---

## Portability by Separation of Concerns

The [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) principle helps the state stay concise on its operations. The goal is to allow developers to understand and alter it with little effort. We can group files that are relative to a specific concern, such as "authentication". Only those files are allowed to read from and write to that part of the state object.

This centralizes the manipulation of that part of the state in one place, and any changes happen very close to each other. This reduces the cognitive load and keeps the code organized.

Here's an example file structure for an authentication flow:

```
/src/state
  |- /authentication/actions.js .... Log in, log out, forgot password,
  |                                  calls fetch user after login
  |- /authentication/selectors.js .. Is the user logged in?
  '- /user/actions.js .............. Fetch user, uses authentication
                                     selector
```

---

## Hooks

Hooks allows us to subscribe to the mutation events the state machine emits, using `useEffect` for the event subscription and `useState` to handle new renders.

Referencing our StateManager.ts example from before, combined with [hooks/useSelector.ts](https://github.com/WesSouza/immer-state/blob/master/src/hooks/useSelector.ts), we can read and mutate our state with ease:

```js
import { userLogout } from 'state/user/actions';
import { getUser } from 'state/user/selectors';
import { userStore } from 'state/user/store';

export function UserWelcome() {
  const user = useSelector(userStore, getUser);

  if (!user) {
    return 'Not logged in.';
  }

  return (
    <>
      <div>Hello {user.name}!</div>
      <button onClick={userLogout}>Logout</button>
    </>
  );
}
```

You can read more about it at my [WesSouza/immer-state reference repository](https://github.com/WesSouza/immer-state), which contains a simple proof of concept for this system.
