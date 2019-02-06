const tokenSaleStats = {
	cap: 40000,
	raised: 40008.0523,
	ratio: 1170
}

const staticData = {
    team:  require('./../../data/team.json'),
    earlyStageAdvisors: require('./../../data/early-stage-advisors.json'),
    partners: require('./../../data/partners.json'),
    stats: tokenSaleStats    
}

module.exports = {
    staticData: staticData
};