const fs = require('fs')
const path = require('path')
const logger = require('winston-namespace')('data-manager')

const DIRECTORY = path.join(__dirname, 'data')
if (!fs.existsSync(DIRECTORY)) fs.mkdirSync(DIRECTORY)

/**
 * Returns a string with the path to the file with the data for the given search's name.
 * @param {String} searchName - Name to identify a search.
 * @returns {string}
 */
function getPath (searchName) {
  return path.join(DIRECTORY, searchName + '.json')
}

/**
 * Saves the properties of a search.
 * @param {String} searchName - Name to identify a search.
 * @param {String[]} properties - Array with links to properties.
 */
function save (searchName, properties) {
  const set = new Set([...properties, ...load(searchName)])
  fs.writeFileSync(getPath(searchName), JSON.stringify([...set], null, 2))
}

/**
 * Returns a Set with the links to properties for the given search identified by its name.
 * @param {String} searchName - Name to identify a search.
 * @returns {Set}
 */
function load (searchName) {
  const filePath = getPath(searchName)
  try {
    return new Set(JSON.parse(fs.readFileSync(filePath), 'utf-8'))
  } catch (err) {
    logger.debug(err)
    return new Set()
  }
}

module.exports = {
  load,
  save
}
