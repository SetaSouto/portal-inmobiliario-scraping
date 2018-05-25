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
 * Creates and save a new search. It contains the initial schema of the search model.
 * @param searchName
 * @param startUrl
 */
function create (searchName, startUrl) {
  save(searchName, {url: startUrl, properties: {favorites: [], archived: []}})
}

/**
 * Saves on disk the data of the search.
 * @param {String} searchName - Name to identify a search.
 * @param {Object} data - Data to save for the search.
 */
function save (searchName, data) {
  fs.writeFileSync(getPath(searchName), JSON.stringify(data, null, 2))
}

/**
 * Returns the data with the links to properties for the given search identified by its name.
 * @param {String} searchName - Name to identify a search.
 * @returns {Object} - Object as the schema in 'create' function.
 */
function load (searchName) {
  return JSON.parse(fs.readFileSync(getPath(searchName), 'utf-8'))
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
  create,
  exists,
  list,
  load,
  remove,
  save
}
