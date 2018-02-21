const fn = require('.')

test('buildStatusMessage', () => {
  const singleQueue = [{ user: { id: '2143314', name: 'iacamigevaerd' }, branch: 'somebranch' }]
  expect(fn(singleQueue)).toBe(':top: `somebranch (iacamigevaerd)`')

  const multiQueue = [
    { user: { id: '2143314', name: 'iacamigevaerd' }, branch: 'somebranch' },
    { user: { id: '2143314', name: 'iacamigevaerd' }, branch: 'another/branch' },
    { user: { id: '2143314', name: 'iacamigevaerd' }, branch: 'heello/branh' },
  ]
  expect(fn(multiQueue)).toBe(
    `:top: \`somebranch (iacamigevaerd)\`
:soon: \`another/branch (iacamigevaerd)\`, \`heello/branh (iacamigevaerd)\``
  )
})
