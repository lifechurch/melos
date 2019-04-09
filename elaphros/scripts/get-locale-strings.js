#! /usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const flat = require('flat')
const immutable = require('immutable')

const mergedFolder = path.join(process.cwd(), './locales')

const folders = [
  [ '../ruby/config/locales/bible', './locales/bible' ],
  [ '../ruby/config/locales/bible_versions', './locales/bible-versions' ],
  [ '../ruby/config/locales/marketing', './locales/marketing' ],
  [ '../ruby/config/locales/user_accounts', './locales/user-accounts' ]
]

function yamlToJson(data) {
  const formatted = flat(yaml.safeLoad(data))
  const final = {}
  Object.keys(formatted).forEach((key) => {
    const newKey = key.split('.').slice(1).join('.')
    final[newKey] = formatted[key]
  })
  return flat.unflatten(final)
}

function prepareDataToBeWritten(json) {
  return JSON.stringify(json, null, '\t').replace(/\%\{/g, '{')
}

function processFolder([ sourceFolder, destFolder ]) {
  if (typeof sourceFolder === 'undefined') return console.error('Please specify a source folder.')
  if (typeof destFolder === 'undefined') return console.error('Please specify a destination folder.')

  console.log(`Converting YAML from ${sourceFolder} to JSON...`)

  const yamlSourceFolder = path.join(process.cwd(), sourceFolder)

  fs.readdirSync(yamlSourceFolder).forEach((file) => {
    const jsonFile = file.replace('.yml', '.json')
    const yamlFilePath = path.join(yamlSourceFolder, file)
    const destFilePath = path.join(destFolder, jsonFile)
    const mergedFilePath = path.join(mergedFolder, jsonFile)

    const json = yamlToJson(fs.readFileSync(yamlFilePath, 'utf8'))

    // Write Feature JSON String File for this Locale
    fs.writeFileSync(destFilePath, prepareDataToBeWritten(json))

    // Write Merged JSON String File for this Locale
    let mergedContents
    try {
      mergedContents = JSON.parse(fs.readFileSync(mergedFilePath, 'utf8'))
    } catch (e) {
      mergedContents = {}
      console.log(`File ${mergedFilePath} doesn't exist. I'll create it for you... you're welcome.`)
    }

    const newMergedContents = immutable.fromJS(mergedContents).mergeDeep(json).toJS()
    fs.writeFileSync(mergedFilePath, prepareDataToBeWritten(newMergedContents))
  })

  return 0
}

folders.forEach(processFolder)

process.exit()
return 0
