![Logo](docs/logo.png)

# Paradux

[![CircleCI](https://circleci.com/gh/asteridux/paradux.svg?style=svg)](https://circleci.com/gh/AntJanus/paradux:Why)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Why?

When bootstrapping Redux, Redux assumes that all of your reducers are ready right then and there. There is no way to add new reducers, no way to deregister them, and no way to manipulate interceptors.

And while the immutable nature of "available Reducers" is great, there are some caveats to this process which Paradux tries to solve.

### Self-bootstrapping

Paradux can create an instance of itself in a module file and while it's being bootstrapped into a Redux store, reducers can register themselves to Paradux like so:

```js
// a paradux setup file
import Paradux from 'paradux';
import defaultReducers from './defaults'; // reducers that are always present

export default new Paradux(defaultReducers);
```

And additional reducers need only to require that module and register themselves and be immediately available to Redux:

```js
// a random reducer file
import paradux from '../paradux';

function reducer(state, action) {
  // ... all kinds of logic goes here
}

paradux.register(reducer); // no need to export due to module singleton nature
```

This means that reducers and reducer logic can be kept close to the modules and components it actually affects. Adding new component/modules/reducers doesn't require bloated import statements during the Redux bootstrap process.

It's a little bit like dependency inversion where the store doesn't "require" all the reducers. The reducers, instead, register themselves.

### Code-splitting friendly

Redux, right now, is not very friendly to code-splitting. Making a reducer available down the line is pretty much unheard of; however, there are plenty of cases for it.

Since code-splitting requires asynchrony, it can't be used directly within reducers and that's okay. So where does one split? You can't. With Paradux, you can!

Let's imagine a React component that requires complex reducer logic but only for a subset of certain routes. We can use require ensure for this!

```js
// sample route config file
import paradux from './paradux';

export default {
  component: App,
  childRoutes: [
    {
      path: '/admin',
      getComponent(location, cb) {
        require.ensure('./adminReducers', function(require) {
          var adminReducers = require('./adminReducers');
          paradux.register(adminReducers);
        })
      }
    }
  ]
}
```

### Cleanup friendly

Ever find yourself in a situation where you don't need reducer logic available anymore? Let's consider the previous example and disregard the code splitting portion. Our `adminReducers` are complex, have a ton of logic in them, a ton of switch/case statements. And all of that because they run almost an entirely separate app for a user that is able to login.

But what if you logged out? Let's consider the following action:


```js
import paradux from './paradox';

export function logoutUser() {
  return (dispatch) => {
    return fetch('/api/logout')
      .then((res) => res.toJSON())
      .then(() => {
        paradux.deregisterByNamespace('adminReducers');

        // admin reducers no longer available or run.
        dispatch(userLoggedOut());
      })
    ;
  }
}
```

The only requirement for deregistration by namespace is to specify the namespace in the first place:

```js
paradux.register(adminReducers, 'adminReducers');
```

### Middleware - all of the above advantages (WIP)

The cool thing is that Paradux allows you to add and run middleware whenever you want to as well. You can add logger middleware when you want to, start DevTools when you want to, and so on. On demand and only when needed.

This opens up a whole new world of possibilities like having toggleable `debug` functionality, logging bootup on certain actions, registering/deregistering middleware on the fly for various situations.

## Installation and setup

Installation:

```bash
npm install paradux --save
```

And I suggest creating a separate file for the paradux instance for easy importing: