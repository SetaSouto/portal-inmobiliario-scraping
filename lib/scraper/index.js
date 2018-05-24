const puppeteer = require('puppeteer')
const logger = require('winston-namespace')('scraper')

/**
 * Launches a new browser to get all the links to properties starting at the given search url.
 * @param {String} startUrl - A results page for a search where to start to look for links for the properties. A
 * recommended url is for example when you look for something in the portal and then it redirects you to the first page.
 * @returns {Promise<String[]>}
 */
function getProperties (startUrl) {
  return puppeteer.launch().then(async browser => {
    const page = await browser.newPage()
    await page.goto(startUrl)
    const links = await scrapePropertiesLinks(page)
    browser.close()
    return links
  })
}

/**
 * Returns a Promise that resolves with an array with all the links to properties for the that are in the portal
 * starting at the given 'page' of results. It looks for the next 'page' with properties until it does not found more.
 * @param {Page} page - A puppeteer page.
 * @returns {Promise<String[]>}
 */
async function scrapePropertiesLinks (page) {
  return page.$$eval('.product-item-image > a', items => items.map(item => item.href))
    .then(async links => {
      const pageNumber = await page.$eval('#PaginacionSuperior > div > ul > li.active', item => item.dataset.num)
      logger.info(`Captured ${links.length} properties on the ${pageNumber} page.`)
      // Pass to the next page using the query in the url
      await page.goto(page.url().replace(/&pg=./g, '') + `&pg=${Number(pageNumber) + 1}`)
      return links.concat(await scrapePropertiesLinks(page))
    })
    .catch(err => {
      logger.debug(err)
      logger.info(`No more links found, stopping.`)
      return []
    })
}

module.exports = {
  getProperties
}
