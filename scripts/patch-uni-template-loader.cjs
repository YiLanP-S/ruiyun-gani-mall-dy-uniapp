const fs = require('fs')
const path = require('path')

const loaderPath = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '@dcloudio',
  'vue-cli-plugin-uni',
  'packages',
  'vue-loader',
  'lib',
  'loaders',
  'templateLoader.js'
)

if (!fs.existsSync(loaderPath)) {
  process.exit(0)
}

const source = fs.readFileSync(loaderPath, 'utf8')
const original = 'return code + `\\nexport { render, staticRenderFns, recyclableRender, components }`'
const patched = [
  'const exportShims = []',
  "  if (!/\\brecyclableRender\\b/.test(code)) exportShims.push('var recyclableRender')",
  "  if (!/\\bcomponents\\b/.test(code)) exportShims.push('var components')",
  "  return code + (exportShims.length ? `\\n${exportShims.join('\\n')}` : '') + `\\nexport { render, staticRenderFns, recyclableRender, components }`"
].join('\n  ')

if (source.includes(original)) {
  fs.writeFileSync(loaderPath, source.replace(original, patched))
}
