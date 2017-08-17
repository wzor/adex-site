const web3Services = require('./../../../services/web3Services')

exports.get = function*(request, response) {
	response.end(JSON.stringify({transferrable: yield web3Services.getTransferable()}))
}