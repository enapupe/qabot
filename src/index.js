const SlackBot = require('slackbots')

const deploy = require('./git')
const prettyPrintQueueEntry = require('./utils/pretty-print-queue-entry')
const formatAsCode = require('./utils/format-as-code')

const SLACK_KEY = process.env.SLACK_KEY || 'xoxb-317873788357-c4UBADBFOlT076O4lz0hVNk2'
const BRANCH_REGEX = /`[\w-/_]+`/g

const bot = new SlackBot({
  token: SLACK_KEY,
  name: 'qabot',
})

const params = {
  icon_emoji: ':robot_face:',
}

const QUEUE = []

const sendMessage = (message) => bot.postMessageToChannel('random', message, params)

const getBranchFromMessage = (content = '') => {
  if (!content.includes('deploy')) {
    return false
  }
  if (!content.match(BRANCH_REGEX)) {
    return false
  }
  const matches = content.match(BRANCH_REGEX)
  if (matches.length === 1) {
    return matches[0].replace(/`/g, '')
  }
  return false
}

const dumpStatus = async () => {
  if (QUEUE.length) {
    const queue = [...QUEUE]
    queue.shift()
    const soonQueue =
      queue.length && (await Promise.all(queue.map((q) => prettyPrintQueueEntry(q))))
    console.log(soonQueue)
    sendMessage(`:top: ${await prettyPrintQueueEntry(QUEUE[0])}\n :soon: ${soonQueue.join(', ')}`)
    return
  }
  sendMessage('Nothing to report.')
}

const processDeployRequest = async (branch, user) => {
  if (!QUEUE.length) {
    sendMessage(`pushing branch \`${branch}\``)
    const queueEntry = { branch, user }
    QUEUE.push(queueEntry)
    console.log(QUEUE)
    try {
      const ref = await deploy(branch)
      sendMessage(`successfully pushed branch \`${branch} (${ref})\``)
    } catch (e) {
      console.warn(e)
      QUEUE.splice(QUEUE.indexOf(queueEntry), 1)
      sendMessage(`Failed to push branch: ${formatAsCode(e.message)}`)
    }
    return
  }
  sendMessage(`queueing branch \`${branch}\` after \`${QUEUE.length}\` branches`)
  QUEUE.push({ branch, user })
}

bot.on('start', () => {
  sendMessage('Initializing...')
  bot.getUsers().then(console.log)
})

bot.on('message', async (data) => {
  if (data.content) {
    if (!data.content.includes('@qabot')) {
      return false
    }
    const branch = getBranchFromMessage(data.content)
    if (branch) {
      processDeployRequest(branch, data.user)
      return
    }
    if (data.content.includes('status')) {
      return dumpStatus()
    }
  }
  console.info('Skipping message...', data)
})
