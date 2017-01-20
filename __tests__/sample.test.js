import emptyObj from '../src/'

describe('Sample test', () => {
  it('should just pass', () => {
    expect(2 + 2).toBe(4)
  })

  it('should evaluate empty obj', () => {
    expect(emptyObj).toBeDefined()
  })
})
