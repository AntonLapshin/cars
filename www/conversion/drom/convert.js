define([
    'xslt',
], function (xslt) {

    var IMAGE_PREFIX = 'https://creator.zohopublic.com';

    var rules = [
        {
            name: 'idHaulRussiaType',
            action: function (value, offer$) {
                return $('idNewType', offer$).html() === 'С пробегом РФ' ? 1 : 0;
            }
        },
        {
            name: 'idNewType',
            action: function (value) {
                return value === 'Новый' ? 1 : 0;
            }
        },
        {
            name: 'idHybridType',
            action: function (value) {
                return value === 'Гибридный' ? 1 : 0;
            }
        },
        {
            name: 'idMark',
            ref: 'Mark'
        },
        {
            name: 'idModel',
            ref: 'Model'
        },
        {
            name: 'idColor',
            ref: 'Color'
        },
        {
            name: 'idTransmission',
            ref: 'Transmission'
        },
        {
            name: 'idEngineType',
            ref: 'EngineType'
        },
        {
            name: 'idDriveType',
            ref: 'DriveType'
        },
        {
            name: 'idWheelType',
            ref: 'WheelType'
        },
    ];

    function getIdFromRef(value, fieldName, ref$) {
        var fields$ = $(fieldName, ref$);
        for (var i = 0; i < fields$.length; i++) {
            var field$ = fields$.eq(i);
            var desc$ = $('s' + fieldName, field$);
            if (desc$.html() === value) {
                return $('id' + fieldName, field$).html();
            }
        }
        return 0;
    }

    function conversionByRules(xml, ref$) {
        $('Offer', xml.firstChild).each(function () {
            var offer$ = $(this);
            rules.forEach(function (rule) {
                var target$ = $(rule.name, offer$);
                if (rule.action)
                    target$.html(rule.action(target$.html(), offer$));
                else if (rule.ref)
                    target$.html(getIdFromRef(target$.html(), rule.ref, ref$));
            })
        });

        return xml;
    }

    function getSrc(html){
        var indexOfSrc = html.indexOf('src');
        if (indexOfSrc === -1) return null;

        var indexOfStart = html.indexOf('"', indexOfSrc);
        var indexOfEnd = html.indexOf('"', indexOfStart + 1);
        var src = html.substr(indexOfStart + 1, indexOfEnd - indexOfStart - 1);
        return src;
    }

    function conversionPhotos(xml) {
        $('Offer', xml.firstChild).each(function () {
            var offer$ = $(this),
                photos$ = $('Photos', offer$).attr('PhotoDir', IMAGE_PREFIX),
                firstPhoto$ = photos$.children().first();

            if (firstPhoto$.length > 0) {
                var src = getSrc(firstPhoto$.html());
                if (src) {
                    photos$.attr('PhotoMain', src);
                }
            }

            photos$.children().each(function (index) {
                var photo$ = $(this);
                if (index === 0)
                    photo$.remove();
                var src = getSrc(photo$.html());
                if (src)
                    photo$.html(src);
                else
                    photo$.remove();
            });
        });
        return xml;
    }

    function save(xml) {
        var xmlString = (new XMLSerializer()).serializeToString(xml);

        return $.Deferred(function(defer){
            $.ajax({
                type: "POST",
                url: 'http://carsxml.herokuapp.com/dromsave',
                processData: false,
                dataType: 'text/xml',
                data: xmlString,
                success: function (response) {
                    //defer.resolve(response);
                },
                error: function (response) {
                    defer.resolve(response);
                }
            });
        });
    }

    function getRef() {
        return $.Deferred(function (defer) {
            $.ajax({
                type: "GET",
                url: 'http://carsxml.herokuapp.com/dromref',
                dataType: "xml",
                complete: function (res) {
                    defer.resolve(res.responseText);
                }
            });
        });
    }

    return function () {
        return $.Deferred(function(defer){
            $('<div></div>')
                .xslt('cars.xml', 'conversion/drom/stylesheet.xsl')
                .on('finished', function (e, xml) {
                    getRef()
                        .then(function (xmlRefText) {
                            xml = conversionByRules(xml, $(xmlRefText));
                            xml = conversionPhotos(xml);
                            return save(xml);
                        })
                        .then(function () {
                            defer.resolve();
                        });
                });
        });
    };
});