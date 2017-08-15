var tokenSaleStats = {
	cap: 40000,
	raised: 40008.0523,
	ratio: 1170
}

exports.get = (request, response) => {
	response.end(JSON.stringify(tokenSaleStats))
}