export default class Paradux {

  constructor(initialReducers = []) {
    this.reducers = initialReducers;
    this.registry = {};


    this.reducerWrapper = this.reducerWrapper.bind(this);
    this.register = this.register.bind(this);
    this.deregister = this.deregister.bind(this);
    this.registerMiddleware = this.registerMiddleware.bind(this);
    this.removeMiddleware = this.removeMiddleware.bind(this);
  }

  reducerWrapper(initReducers) {
    this.reducers = this.reducers.concat(initReducers);

    return (state, action) => {
      return this.reducers.reduce((collectiveState, reducer) => {
        return reducer(collectiveState, action);
      }, state);
    };
  }

  register(reducer, namespace) {
    this.reducers.push(reducer);

    var deregister = this.deregister(reducer);

    if (namespace) {
      this.registry[namespace] = {
        reducer,
        deregister
      }
    }

    return deregister;
  }

  deregister(reducer) {
    return () => {
      this.reducers.splice(this.reducers.indexOf(reducer), 1);

      return true;
    }
  }

  deregisterNamespace(namespace) {
    this.registry[namespace].deregister();

    return true;
  }

  registerMiddleware(middleware) {

  }

  removeMiddleware(middleware) {

  }
}
