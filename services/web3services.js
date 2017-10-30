const fs = require('fs')
const Web3 = require('web3')
const Promise = require('bluebird');

// var HTTP_PROVIDER = 'http://192.168.0.32:8181'
const HTTP_PROVIDER = 'https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv'

var web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER))

const adxSCAddr = '0x4470bb87d77b963a013db939be332f927f2b992e'

const adxTeam = '0x230fe2dc4fe6a13adaa87b433862e3b21148546d'
const adxFund = '0xf83f7411046ce4a6fba6584b868fb15d45f0065a'

const adxAbi = require('./../data/adex-abi')

var cachedTransferable = null;
const LAST_TRANSFERRABLE = 58751038.9974; // 30.10.2017
const CACHE_INTERVAL = 2 * 60 * 60 * 1000 // 2 hours
var lastCached = null

function getTransferable() {

    return new Promise(function (resolve, reject) {
        if (cachedTransferable && lastCached && (Date.now() - lastCached) < CACHE_INTERVAL) {
            return resolve(cachedTransferable);
        }

        try {
            if (typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider);
            } else {
                // set the provider you want from Web3.providers
                web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            }

            var adxToken = web3.eth.contract(adxAbi).at(adxSCAddr)

            var MIL = 1000 * 1000
            var MULTIPLIER = 10000 // 4 decimal points
            var TOTAL = 100 * MIL * MULTIPLIER

            var tsSeconds = parseInt(Date.now() / 1000)
            var adxTeamBalance
            var teamTransferrableBalance
            var adxFundBalance
            var fundTransferrableBalance

            adxToken.balanceOf(adxTeam, (err, value) => {
                if (err) throw Error(err);
                adxTeamBalance = value;
                adxToken.transferableTokens(adxTeam, tsSeconds, (err, value) => {
                    if (err) throw Error(err);
                    teamTransferrableBalance = value;
                    adxToken.balanceOf(adxFund, (err, value) => {
                        if (err) throw Error(err);
                        adxFundBalance = value;
                        adxToken.transferableTokens(adxFund, tsSeconds, (err, value) => {
                            if (err) throw Error(err);
                            fundTransferrableBalance = value;

                            var nonTransferrable =
                                (adxTeamBalance - teamTransferrableBalance)
                                + (adxFundBalance - fundTransferrableBalance)

                            var transferrable = (TOTAL - nonTransferrable) / MULTIPLIER;

                            cachedTransferable = transferrable;
                            lastCached = Date.now();

                            return resolve(transferrable);
                        })
                    })

                });
            });
        } catch (err) {
            console.log('Transferrable error -> ', err)
            return resolve(LAST_TRANSFERRABLE);
        }
    });
}

module.exports = {
    getTransferable: getTransferable
}