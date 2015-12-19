var moment = require('moment');
var BunyanSlack = require('bunyan-slack');

// we subtract 4 because we take the picture on Friday, but reference the Monday in Excel
var fourDaysAgo = moment().subtract(4, 'days').format('YYYY-MM-DD');

var config = {

    file: {
        log: fourDaysAgo + '.log'
    },

    countries: {
        prod: [
            'en-us', 'es-us', 'en-au', 'de-at', 'pt-br', 'en-ca', 'fr-ca', 'cs-cz', 'ar-ly', 'es-ve',
            'da-dk', 'fi-fi', 'de-de', 'hu-hu', 'ko-kr', 'es-xl', 'en-my', 'nl-nl', 'en-nz', 'nb-no',
            'nn-no', 'pl-pl', 'ro-ro', 'ru-ru', 'ca-es', 'es-es', 'eu-es', 'gl-es', 'en-gb', 'es-ar',
            'nl-be', 'bg-bg', 'es-cl', 'zh-cn', 'es-co', 'es-cr', 'es-ec', 'et-ee', 'fr-fr', 'el-gr',
            'zh-hk', 'en-in', 'id-id', 'en-ie', 'he-il', 'it-it', 'ja-jp', 'es-mx', 'es-pe', 'en-ph',
            'pt-pt', 'ar-sa', 'en-sg', 'zh-sg', 'sk-sk', 'sl-si', 'en-za', 'sv-se', 'de-ch', 'fr-ch',
            'it-ch', 'zh-tw', 'th-th', 'tr-tr', 'uk-ua', 'ar-eg', 'en-zw', 'fa-ir', 'hr-hr', 'lv-lv',
            'vi-vn', 'es-bo', 'es-gt', 'es-hn', 'is-is', 'en-jm', 'lt-lt', 'es-ni', 'es-pr', 'es-uy',
            'ar-ae', 'be-by', 'ar-iq', 'ar-kw', 'ar-ma', 'mt-mt', 'en-tt', 'en-bz', 'el-cy', 'es-do',
            'es-pa', 'es-py', 'es-sv', 'hr-ba', 'kk-kz', 'bs-latn', 'sr-latn', 's-latn', 'r-lat'
        ],

        dev: ["es-ar", "en-au", "nl-be"]
    },

    countryShortIds: [
        'dn308572',
        'mt211006',
        'mt131408',
        'mt131409',
        'dn789927',
        'mt211007',
        'dn833116'
    ],

    css: {
        cle: '#Fragment_ContentSection2 .smallBlocks .block { width: 48% !important;}' +
                '.largeBlocks .block, #Fragment_ResourceList, #Fragment_ContentSection2 .smallBlocks { width: 49.1% !important;}',

        homepage: '#Fragment_HPContent1 .listItems .block .textContent { width: 55% !important;}'
    },


    webshot: {
        screenSize: {width: 1280, height: 768},
        renderDelay: 1500,
        shotSize: {width: 1280, height: 'all'},
        onLoadFinish: function () {document.write(document.cookie); },
        shotOffset: {top: 100, bottom: 700, left: 25, right: 25}
    },

    azure: {
        storage: {
            nick: {
                ACCOUNT: 'storageimages',
                ACCESS_KEY: '', // input access key,
                CONTAINER: {
                    SCREENSHOT: fourDaysAgo,
                    LOG: 'storageimages-screenshot-log'
                },

                options: {
                    container: {publicAccessLevel: 'blob'},
                    stream: {contentType: 'image/jpg'}
                }
            },

            client: {
                ACCOUNT: 'storageimages',
                ACCESS_KEY: '', // input access key
                CONTAINER: {
                    SCREENSHOT: fourDaysAgo,
                    LOG: 'storageimages-screenshot-log'
                },

                options: {
                    container: {publicAccessLevel: 'blob'},
                    stream: {contentType: 'image/jpg'},
                    timeoutIntervalInMs: 3600000 // 60 minutes
                }
            }
        }
    },

    bunyan: {
        name: 'Screenshot process',
        streams: [
            {
                path: fourDaysAgo + '.log'
            },

            {
                stream: new BunyanSlack({
                    webhook_url: '', // input slack webhook
                    channel: '#heatmapping',
                    username: 'squirrel of the app logs',
                    icon_emoji: ':squirrel:',
                    customFormatter: function (record, levelName) {
                        return {
                            text: record.name + ' [' + levelName + '] > ' + record.msg
                        };
                    }
                })
            },

            {
                stream: process.stdout,
                level: 'info'
            }
        ]
    }
};

module.exports = config;