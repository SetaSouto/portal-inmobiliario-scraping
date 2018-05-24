const puppeteer = require('puppeteer')
const logger = require('winston-namespace')('spider')

const startUrl = 'https://www.portalinmobiliario.com/arriendo/departamento/santiago-metropolitana?tp=2&op=2&ca=3&ts=1&dd=2&dh=6&bd=2&bh=6&or=&mn=1&sf=1&sp=0&pd=200.000&ph=400.000'

puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  await page.goto(startUrl)
  await getProperties(page)
  browser.close()
})

/**
 * Returns a Promise that resolves with an array with all the links to properties for the that are in the portal
 * starting at the given 'page' of results. It looks for the next 'page' with properties until it does not found more.
 * @param {Page} page - A puppeteer page.
 * @returns {Promise<String[]>}
 */
async function getProperties (page) {
  return page.$$eval('.product-item-image > a', items => items.map(item => item.href))
    .then(async links => {
      const pageNumber = await page.$eval('#PaginacionSuperior > div > ul > li.active', item => item.dataset.num)
      logger.info(`Captured ${links.length} properties on the ${pageNumber} page.`)
      // Pass to the next page using the query in the url
      await page.goto(startUrl.replace(/&pg=./g, '') + `&pg=${Number(pageNumber) + 1}`)
      return links.concat(await getProperties(page))
    })
    .catch(err => {
      logger.debug(err)
      logger.info(`No more links found, stopping.`)
      return []
    })
}
