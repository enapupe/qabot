const fn = require('.')

expect(fn(bot, { user: 'aaa', branch: 'branch/name' })).toBe('seila')
