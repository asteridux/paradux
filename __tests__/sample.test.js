import Paradux from '../'

describe('Sample test', () => {
  const paradux = new Paradux([])

  it('should have an empty collection of reducers', () => {
    expect(paradux._reducers.length).toEqual(0)
  })

  it('should register a reducer successfully', () => {
    var func = function () { }

    paradux.register(func)

    expect(paradux._reducers.indexOf(func)).toBeGreaterThan(func)
  })

  it('should register/deregister a reducer successuflly', () => {
    var func = () => { }
    var deregister = paradux.register(func)

    expect(paradux._reducers.indexOf(func)).toBeGreaterThan(-1)

    deregister()

    expect(paradux._reducers.indexOf(func)).toBeLessThan(0)
  })
})
