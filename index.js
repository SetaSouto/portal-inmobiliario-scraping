const scraper = require('./lib/scraper')

const startUrl = 'https://www.portalinmobiliario.com/arriendo/departamento/santiago-metropolitana?tp=2&op=2&ca=3&ts=1&dd=2&dh=6&bd=2&bh=6&or=&mn=1&sf=1&sp=0&pd=200.000&ph=400.000'

scraper.getProperties(startUrl).then(links => console.log(links.length))
