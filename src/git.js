const git = require('nodegit')

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'e83414a457126c6d0fa1b4725de7088c6ce8356d'
const TARGET_BRANCH = process.env.TARGET_BRANCH || 'qa'
const REPO_URL = process.env.REPO_URL || 'https://github.com/enapupe/nodegit-playground.git'
const SHA_LENGTH = 7
const REPO_PATH = '../tmp'

const credentials = () => git.Cred.userpassPlaintextNew(GITHUB_TOKEN, 'x-oauth-basic')
const clone = async () => {
  try {
    await git.Clone(REPO_URL, REPO_PATH, {
      fetchOpts: {
        callbacks: {
          credentials,
        },
      },
    })
  } catch (e) {
    console.info('Repository already exists')
  }
  return REPO_PATH
}

const open = async (path) => {
  const repo = await git.Repository.open(path)
  await repo.fetchAll({ credentials }, true)
  return repo
}

const getReference = async (repo, ref) => repo.getReferenceCommit(ref)

const hardReset = async (repo, reference) => git.Reset.reset(repo, reference, git.Reset.TYPE.HARD)

const push = async (remote, ref) =>
  remote.push([ref], {
    callbacks: {
      credentials,
    },
  })

const init = async (branchName) => {
  const repo = await open(await clone())
  const ref = await getReference(repo, `origin/${branchName}`)
  const shaRef = ref.sha().substr(0, SHA_LENGTH)
  await hardReset(repo, ref)
  await push(
    await repo.getRemote('origin'),
    `+refs/heads/${branchName}:refs/heads/${TARGET_BRANCH}`
  )
  return shaRef
}

module.exports = init
