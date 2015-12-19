'use strict';

var AzureService = require('./services/azure');
var ScreenshotService = require('./services/screenshot');

var config = require('./libs/config');
var util = require('./libs/util');
var log = require('bunyan').createLogger(config.bunyan);

// // Initalize Services
AzureService.init({
    container: config.azure.storage.client.CONTAINER.SCREENSHOT,
    containerOptions: config.azure.storage.client.options.container,
    streamOptions: config.azure.storage.client.options.stream,
    account: config.azure.storage.client.ACCOUNT,
    key: config.azure.storage.client.ACCESS_KEY
});

ScreenshotService.init({
    countries: config.countries.prod,
    webshotOptions: config.webshot
});

// /*
//     Start Screenshot Process
//  */

config.countryShortIds.reduce(function (p, countryId) {
    return p.then(function () {
        return ScreenshotService.getAllCountriesOfId(countryId).then(null, function (error) {
            log.info(error);
        });
    });
}, AzureService.createContainer())


    // Upload Log file into Azure storage
    .fin(function () {
        AzureService.init({
            container: config.azure.storage.client.CONTAINER.LOG,
            account: config.azure.storage.client.ACCOUNT,
            key: config.azure.storage.client.ACCESS_KEY,
            file: config.file.log,
            isLogFile: true
        });

        log.info('Utility: Uploading log file [ %s ] to Azure storage container [ %s ]', AzureService.file, AzureService.container);

        return AzureService.uploadLocalFileToStorage()
            .then(function () {
                return util.deleteFile({fileName: AzureService.file, isLogFile: true});
            })
            .fail(util.handleError)
            .done();
    })

    .fail(util.handleError)

    .done();
/*
    End Screenshot Process
 */
