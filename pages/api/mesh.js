const csv = require('csvtojson')

function sortByProperty (property) {
  return function (a, b) {
    if (a[property] > b[property]) { return 1 } else if (a[property] < b[property]) { return -1 }
    return 0
  }
}

export default async function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'max-age=180000')
  // const items = await csv({ delimiter: "'" }).fromFile(`./data/mesh.csv`)
  const items = await csv().fromFile(`./data/mesh.csv`)
  // console.log('items');
  // console.log(items);
  res.end(JSON.stringify(items.sort(sortByProperty('Name'))))
}
