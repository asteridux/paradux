import Paradux from '../index'

describe('Registry test', () => {
  it('should have an empty registry', () => {
    const paradux = new Paradux([])

    expect(Object.keys(paradux._registry).length).toEqual(0)
  })

  it('should register a reducer successfully', () => {
    const paradux = new Paradux([])

    var func = function () { }

    paradux.register(func, 'func')

    expect(paradux._registry.func).toBeDefined()
  })

  it('should register/deregister a reducer successuflly via registry', () => {
    const paradux = new Paradux([])

    var func = () => { }
    var deregister = paradux.register(func, 'func')

    expect(paradux._registry.func).toBeDefined()

    paradux.deregisterByNamespace('func')

    expect(paradux._registry.func).toBeUndefined()
  })
})
