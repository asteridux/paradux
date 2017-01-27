export default class Paradux {

  constructor (initialReducers = []) {
    this._reducers = initialReducers
    this._registry = {}

    this.reducerWrapper = this.reducerWrapper.bind(this)
    this.register = this.register.bind(this)
    this.deregister = this.deregister.bind(this)
  }

  reducerWrapper (initReducers = []) {
    this._reducers = this._reducers.concat(initReducers)

    return (state, action) => {
      return this._reducers.reduce((collectiveState, reducer) => {
        return reducer(collectiveState, action)
      }, state)
    }
  }

  register (reducer, namespace) {
    this._reducers.push(reducer)

    var deregister = this.deregister(reducer, namespace)

    if (namespace) {
      this._registry[namespace] = {
        reducer,
        deregister
      }
    }

    return deregister
  }

  deregister (reducer, namespace) {
    return () => {
      this._reducers.splice(this._reducers.indexOf(reducer), 1)

      if (namespace) {
        delete this._registry[namespace]
      }

      return true
    }
  }

  deregisterByNamespace (namespace) {
    this._registry[namespace].deregister()

    delete this._registry[namespace]

    return true
  }
}
