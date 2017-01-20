export default class Paradux {

  constructor() {
    this.reducers = [];

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

  register({ reducer, path }) {
    this.reducers.push(reducer);

    return this.deregister(reducer);
  }

  deregister(reducer) {
    return () => {
      this.reducers.splice(this.reducers.indexOf(reducer), 1);

      return true;
    }
  }

  registerMiddleware(middleware) {

  }

  removeMiddleware(middleware) {

  }
}
