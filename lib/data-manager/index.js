const fs = require('fs')
const path = require('path')

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
  const set = new Set([...properties, ...exists(searchName) ? load(searchName) : []])
  fs.writeFileSync(getPath(searchName), JSON.stringify([...set], null, 2))
}

/**
 * Returns a Set with the links to properties for the given search identified by its name.
 * @param {String} searchName - Name to identify a search.
 * @returns {Set}
 */
function load (searchName) {
  return new Set(JSON.parse(fs.readFileSync(getPath(searchName)), 'utf-8'))
}

/**
 * Deletes all the data associated with a search by its name.
 * @param {String} searchName - Name to identify a search.
 */
function remove (searchName) {
  fs.unlinkSync(getPath(searchName))
}

/**
 * Returns a boolean indicating if the given name for a search already exists.
 * @param {String} searchName
 * @returns {boolean}
 */
function exists (searchName) {
  return fs.existsSync(getPath(searchName))
}

/**
 * List all the saved searches.
 * @returns {String[]}
 */
function list () {
  return fs.readdirSync(DIRECTORY).map(file => file.replace(/\.json/g, ''))
}

module.exports = {
  exists,
  list,
  load,
  remove,
  save
}
