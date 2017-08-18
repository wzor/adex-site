var fs = require('fs')
var Web3 = require('web3')
var Promise = require('bluebird');

var HTTP_PROVIDER = 'http://192.168.0.32:8181'
// var HTTP_PROVIDER = 'https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv'

var web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER))

var adxSCAddr = '0x4470bb87d77b963a013db939be332f927f2b992e'

var adxTeam = '0x230fe2dc4fe6a13adaa87b433862e3b21148546d'
var adxFund = '0xf83f7411046ce4a6fba6584b868fb15d45f0065a'

var adxAbi = require('./../data/adex-abi')

var cachedTransferable = null;

function getTransferable(){

    return new Promise(function(resolve, reject){
        // TODO: make it async and cache for some time
        if(cachedTransferable) return resolve(cachedTransferable)

        var adxToken = web3.eth.contract(adxAbi).at(adxSCAddr)
        
        var MIL = 1000 * 1000 
        var MULTIPLIER = 10000 // 4 decimal points
        var TOTAL = 100 * MIL * MULTIPLIER
        
        var tsSeconds = parseInt(Date.now()/1000)
        
        var nonTransferrable = 
            (adxToken.balanceOf(adxTeam) - adxToken.transferableTokens(adxTeam, tsSeconds)) 
            + (adxToken.balanceOf(adxFund) - adxToken.transferableTokens(adxFund, tsSeconds)) 
        
        var transferrable = (TOTAL - nonTransferrable) / MULTIPLIER;
        
        cachedTransferable = transferrable;

        return resolve(transferrable);
    });
}

module.exports = {
	getTransferable: getTransferable
}