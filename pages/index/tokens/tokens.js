const staticData = require('./../common-data').staticData

module.exports = {
    get: (req, res) => { res.render(staticData) }
}