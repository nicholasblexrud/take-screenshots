'use strict';

var webshot = require('webshot');
var _ = require('underscore');
var Q = require('q');
var async = require('async');
var config = require('../libs/config');
var log = require('bunyan').createLogger(config.bunyan);

var AzureService = require('./azure');

var screenshotService = {
    init: function (config) {
        this.countries = config.countries || null;
        this.webshotOptions = config.webshotOptions || null;
    },

    takeIndividualScreenshot: function (shortID, country, onEachLimitItem) {
        var fileName = shortID + '-' + country + '.jpg';
        var url = 'https://msdn.microsoft.com/' + country + '/' + shortID;
        var cookieOptions = {cookies: [{name: 'msdn', value: 'L=' + country, domain: '.microsoft.com', path: '/'}]};
        var cssOptions = shortID === 'dn308572' ? config.css.homepage : config.css.cle;
        var webshotOptions = _.extend(this.webshotOptions, cookieOptions, {customCSS: cssOptions});

        webshot(url, webshotOptions, function (error, stream) {

            if (error) {
                log.info(error, '[ %s] - [ %s ]', shortID, country);
            }

            AzureService.uploadStreamToStorage(fileName, stream, onEachLimitItem);

        });
    },

    getAllCountriesOfShortId: function (shortID, options) {
        var deferred = Q.defer();
        var limit = 5;
        var self = this;

        function onEachCountry(country, onEachLimitItem) {
            self.takeIndividualScreenshot(shortID, country, options, onEachLimitItem);
        }

        async.eachLimit(this.countries, limit, onEachCountry, function (error) {
            if (error) {
                log.info(error, 'its making it here');
                deferred.reject(error);
            }

            log.info('Screenshot: [ %s ] images taken for Short ID: [ %s ]', self.countries.length, shortID);
            deferred.resolve();
        });

        return deferred.promise;
    }
};

module.exports = screenshotService;