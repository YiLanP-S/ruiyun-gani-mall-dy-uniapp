const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const mode = process.argv[2] === 'production' ? 'production' : 'development'
const projectRoot = path.resolve(__dirname, '..')
const cli = path.join(projectRoot, 'node_modules', '@vue', 'cli-service', 'bin', 'vue-cli-service.js')

const node20Candidates = [
  process.env.NODE20_PATH,
  path.join(
    process.env.LOCALAPPDATA || '',
    'Microsoft',
    'WinGet',
    'Packages',
    'OpenJS.NodeJS.20_Microsoft.Winget.Source_8wekyb3d8bbwe',
    'node-v20.20.2-win-x64',
    'node.exe'
  )
].filter(Boolean)

const major = Number(process.versions.node.split('.')[0])
const nodeBin = major <= 20 ? process.execPath : node20Candidates.find(candidate => fs.existsSync(candidate))

if (!nodeBin) {
  console.error('Node 20 is required for this Vue2 uni-app build chain. Set NODE20_PATH to node.exe.')
  process.exit(1)
}

const env = {
  ...process.env,
  NODE_ENV: mode,
  UNI_PLATFORM: 'mp-toutiao',
  UNI_INPUT_DIR: '.',
  UNI_CLI_CONTEXT: '.'
}

const result = spawnSync(nodeBin, [cli, 'uni-build'], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
  shell: false
})

if (result.status) {
  process.exit(result.status)
}

const distOutput = path.join(projectRoot, 'dist', 'dev', 'mp-toutiao')
const unpackageOutput = path.join(projectRoot, 'unpackage', 'dist', 'dev', 'mp-toutiao')

if (fs.existsSync(distOutput)) {
  fs.rmSync(unpackageOutput, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(unpackageOutput), { recursive: true })
  fs.cpSync(distOutput, unpackageOutput, { recursive: true })
}

process.exit(0)
