'use strict';

var azure = require('azure-storage');
var Readable = require('stream').Readable;
var config = require('../libs/config');
var Q = require('q');
var log = require('bunyan').createLogger(config.bunyan);

var azureService = {

    init: function (config) {
        this.container = config.container || null;
        this.containerOptions = config.containerOptions || null;
        this.streamOptions = config.streamOptions || null;
        this.account = config.account || null;
        this.key = config.key || null;
        this.isLogFile = config.isLogFile || false;
        this.file = config.file || null;
        this.blob = azure.createBlobService(this.account, this.key);
    },

    createContainer: function () {
        var df = Q.defer();
        var self = this;

        log.info('Azure: Initiating container creation');

        this.blob.createContainerIfNotExists(this.container, this.containerOptions, function (error) {

            if (error) {
                df.reject(error);
                log.info(error);
            }

            log.info('Azure: Created container [ %s ] in account [ %s ]', self.container, self.account);
            df.resolve(self.container);
        });

        return df.promise;
    },

    uploadStreamToStorage: function (fileName, stream, onEachLimitItem) {
        var readable = new Readable().wrap(stream);
        var writeable = this.blob.createWriteStreamToBlockBlob(this.container, fileName, this.streamOptions);
        var errResults = [];

        readable.pipe(writeable);
        //log.info('Start: [%s]', fileName);

        writeable.on('error', function (error) {
            log.info(error, 'file [ %s ]', fileName);

            errResults.push(error);
        });

        writeable.on('finish', function () {
            //log.info('End: [%s]', fileName);
            return errResults.length > 0 ? onEachLimitItem.call(errResults) : onEachLimitItem.call(null);
        });
    },

    uploadLocalFileToStorage: function () {
        var df = Q.defer();
        var self = this;

        if (!this.isLogFile) {
            log.info('Azure: Initiate file upload');
        }

        this.blob.createBlockBlobFromLocalFile(this.container, this.file, this.file, function (error) {
            if (error) {
                log.info(error);
                df.reject(error);
            }

            if (!self.isLogFile) {
                log.info('Azure: [ %s ] was successfully uploaded to storage container: [ %s ]', self.file, self.container);
            }

            df.resolve(self.file);
        });

        return df.promise;
    }
};

module.exports = azureService;