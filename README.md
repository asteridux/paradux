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

```js
// bootstrap.js file or something similar
import Paradux from 'paradux';
import defaultReducers from './reducers'; //import any reducers you always want present

export default const paradux = new Paradux(defaultReducers);
```

You can then import it into your redux store:

```js
import { createStore } from 'redux';
import paradux from './bootstrap';

let store = createStore(paradux.reducerWrapper());
```

### Adding reducers

Adding reducers is easy. Given the setup above, you simply need to import the new instance of Paradux and use the `register` function

```js
import paradux from './bootstrap';

function myReducer(state, action) {
  //some logic
}

paradux.register(myReducer);
```

You can also register a reducer by namespace:

```js
paradux.register(myReducer, 'my reducer');
```

### Removing reducer

There are several ways of removing a reducer from the reducer collection in Paradux.

First, via the returned handler:

```js
const removeReducer = paradux.register(myReducer);

//when you need to remove it
removeReducer();
```

Second, if you still have the original reducer handy, you can use that to deregister:

```js
paradux.redergister(myReducer);
```

Third, if you specified a namespace, you can deregister by namespace:

```js
paradux.deregisterByNamespace('my reducer');
```

### Non-removable reducers

There's always a need for reducers that cannot be removed, there are two ways of adding these.

First, via initialization:

```js
var paradux = new Paradux(arrayOfReducersThatCannotBeRemoved);
```

And second, via initializing the reducerWrapper:

```js
createStore(paradux.reducerWrapper(arrayOfReducersThatCannotBeRemoved));
```

You can use a mix and match of either techniques or both at the same time.
