const fn = require('.')

test('getBranchFromMessage', () => {
  expect(fn('`somebranch`')).toBe('somebranch')
  expect(fn('`some/branch`')).toBe('some/branch')
  expect(fn('`some/br/anch`')).toBe('some/br/anch')
  expect(fn('`some/br_anch`')).toBe('some/br_anch')
  expect(fn('`some/br-anch`')).toBe('some/br-anch')
  expect(fn('`som.ebranch`')).toBe(false)
  expect(fn('somebranch')).toBe(false)
})
