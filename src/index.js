var ResponsiveImage = require('./responsiveImage.js');
var parser = require('src-n-parse');
var images = [];

function buildCollection() {
    $('img[src-1]').each(function (index) {
        var rules = [];
        $.each(this.attributes, function() {
            if (this.name.match(/src-[0-9]+/i)){
                rules.push(parser.parse(this.value));
            }
        });
        images.push(new ResponsiveImage(
            $(this),
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