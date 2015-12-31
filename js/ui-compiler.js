const fs = require('fs');
const path = require('path');
const $ = require('jquery');
const _ = require('underscore');

$.fn.changeElementType = function(newType) {
    var newElements = [];
    $(this).each(function() {
        var attrs = {};
        $.each(this.attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });
        var newElement = $("<" + newType + "/>", attrs).append($(this).contents());
        $(this).replaceWith(newElement);
        newElements.push(newElement);
    });
    return $(newElements);
};


$('pane').addClass('pane').changeElementType('div')

$('.pane').each(function () {
    var element = $(this)

    var elementId = element.attr('id')
    if (element.attr('resizable-right') != undefined) {
        element.mousemove(function (e) {
            var parentOffset = $(this).parent().offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;

            var dist = relX - $(this).width();

            // console.log('(' + $(this).attr('id') + ') width: ' + $(this).width() + '; mousex: ' + relX);

            if (Math.abs(dist) < 4 && e.which === 1) {
                $(this).css('width', $(this).width() + dist);
            }
        });
    }
})

var diretoryTreeToObj = function(dir, done) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err)
            return done(err);

        var pending = list.length;
        var isLarge = pending > 75; // Replace with config setting

        if (isLarge) {
            return done(null, {
                name: path.basename(dir),
                isFolder: true,
                isLarge: true,
                children: [],
                each: function (cbStart, cbEnd) {
                    cbStart(this);
                    cbEnd(this);
                }
            })
        }

        if (!pending) {
            return done(null, {
                name: path.basename(dir),
                isFolder: true,
                children: results,
                each: function (cbStart, cbEnd) {
                    cbStart(this);
                    _.each(this.children, function (fileNode) {
                        fileNode.each(cbStart, cbEnd);
                    });
                    cbEnd(this);
                }
            });
        }

        list.forEach(function(file) {
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    diretoryTreeToObj(file, function(err, res) {
                        if (res.isLarge) {
                            results.push(res);
                        }
                        else {
                            results.push({
                                name: path.basename(file),
                                isFolder: true,
                                children: res,
                                each: function (cbStart, cbEnd) {
                                    cbStart(this);
                                    _.each(this.children, function (fileNode) {
                                        if (fileNode.each) {
                                            fileNode.each(cbStart, cbEnd);
                                        }
                                    });
                                    cbEnd(this);
                                }
                            });
                        }
                        if (!--pending)
                            done(null, results);
                    });
                }
                else {
                    results.push({
                        isFile: true,
                        name: path.basename(file),
                        each: function (cbSingle) {
                            cbSingle(this);
                        }
                    });
                    if (!--pending)
                        done(null, results);
                }
            });
        });
    });
};


content = fs.readFileSync('./index.html', 'utf8')
$('#content').text(content)

$('.branch > .label').click(function (e) {
    $(this).parent().find('.leaf').toggle()
    $(this).parent().find('.branch').toggle()
})
