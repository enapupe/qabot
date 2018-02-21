const fn = require('.')

test('prettyPrintQueueEntry', () => {
  expect(fn({ user: { id: 'U9BMJNVFW', name: 'iacamigevaerd' }, branch: 'brancha/name' })).toEqual(
    `\`brancha/name (iacamigevaerd)\``
  )
})
