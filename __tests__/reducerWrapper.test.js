import Paradux from '../index'

describe('Reducer wrapper test', () => {
  it('should return plain state if no reducers registered', () => {
    const paradux = new Paradux()
    const wrapper = paradux.reducerWrapper()

    var state = { test: 'no val' }
    var action = {
      type: 'FOO',
      payload: {
        test: 'val'
      }
    }

    expect(wrapper(state, action)).toEqual(state)
  })

  it('should modify state based on initial reducer', () => {
    const REPLACE = 'REPLACE'
    const paradux = new Paradux()
    const wrapper = paradux.reducerWrapper([ (state, action) => {
      if (action.type === REPLACE)  {
        return action.payload
      }

      return state
    }])

    var state = { test: 'no val' }
    var action = {
      type: REPLACE,
      payload: {
        test: 'val'
      }
    }

    var newState = wrapper(state, action)

    expect(newState).toBeDefined()
    expect(newState.test).toEqual('val')
  })

  it('should modify state depending on currently-available reducers', () => {
    const REPLACE = 'REPLACE'
    const EXTEND = 'EXTEND'
    const paradux = new Paradux()
    const wrapper = paradux.reducerWrapper()

    const replacer = (state, action) => {
      if (action.type === REPLACE) {
        return action.payload
      }

      return state
    }

    const extender = (state, action) => {
      if (action.type === EXTEND) {
        return Object.assign({}, state, action.payload)
      }

      return state
    }

    var state = { test: 'no val' }
    var replaceAction = {
      type: REPLACE,
      payload: {
        test: 'val'
      }
    }

    var extendAction = {
      type: EXTEND,
      payload: {
        test2: 'val'
      }
    }

    paradux.register(replacer)

    var newState = wrapper(state, replaceAction)

    expect(newState).toBeDefined()
    expect(newState.test).toEqual('val')
    expect(newState.test2).toBeUndefined()

    paradux.deregister(replacer)
    paradux.register(extender)

    newState = wrapper(state, extendAction)

    expect(newState).toBeDefined()
    expect(newState.test).toEqual('no val')
    expect(newState.test2).toEqual('val')
  })
})
