#! /usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const flat = require('flat')

const [ , , sourceFolder, destFolder ] = process.argv

if (typeof sourceFolder === 'undefined') return console.error('Please specify a source folder.')
if (typeof destFolder === 'undefined') return console.error('Please specify a destination folder.')

console.log(`Converting YAML from ${sourceFolder} to JSON...`)

const yamlSourceFolder = path.join(process.cwd(), sourceFolder)

function formatData(data) {
  const formatted = flat(yaml.safeLoad(data))
  const final = {}
  Object.keys(formatted).forEach((key) => {
    const newKey = key.split('.').slice(1).join('.')
    final[newKey] = formatted[key]
  })
  return JSON.stringify(flat.unflatten(final), null, '\t').replace(/\%\{/g, '{')
}
fs.readdirSync(yamlSourceFolder).forEach(async (file) => {
  const yamlFilePath = path.join(yamlSourceFolder, file)
  const destFilePath = path.join(destFolder, file.replace('.yml', '.json'))

  fs.writeFileSync(destFilePath, formatData(fs.readFileSync(yamlFilePath, 'utf8')))
})

process.exit()
return 0
