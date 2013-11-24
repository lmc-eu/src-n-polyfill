var ResponsiveImage = require('./responsiveImage.js');
var parser = require('src-n-parse');
var images = [];

function buildCollection() {
    $('img[src-1]').each(function (index) {
        var rules = [],
            el = $(this);
        $.each(this.attributes, function() {
            if (this.name.match(/src-[0-9]+/i)){
                rules.push(parser.parse(this.value));
            }
        });
        rules.push(parser.parse(el.attr('src')));
        images.push(new ResponsiveImage(
            el,
            rules
        ));
    });
}
function renderAll() {
    $.each(images, function(index, img){
        img.setImage();
    });
}

$(function() {
    var watchInterval;
    buildCollection();
    renderAll();
    $(window).resize(function () {
        if (watchInterval) {
            clearTimeout(watchInterval);
        }
        watchInterval = setTimeout(renderAll, 50);
    }).resize();
});