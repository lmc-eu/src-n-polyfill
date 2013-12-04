var ResponsiveImage = require('./responsiveImage.js');
var parse = require('src-n-parse').parse;

window.srcnpolyfill = function() {
  var images = [];

  function createResponsiveImage(element) {
    var i,
        rules = [],
        attrs = element.attributes;

    for (i = 0; i < attrs.length; ++i) {
      if (attrs[i].name.match(/^src(-[0-9]+)?$/i)) {
        rules.push(parse(attrs[i].value));
      }
    }

    return new ResponsiveImage(element, rules);
  }

  function buildCollection() {
    var i,
        imgs = [],
        imagesWithSrc1 = document.querySelectorAll('img[src-1]');

    for (i = 0; i < imagesWithSrc1.length; ++i) {
      imgs.push(createResponsiveImage(imagesWithSrc1[i]));
    }

    return imgs;
  }

  function renderAll() {
    images.forEach(function(img) {
      img.setImage();
    });
  }

  // Browsers not supporting ES5 are not responsive anyway
  if (!Array.prototype.forEach || !window.matchMedia) {
    return;
  }

  images = buildCollection();
  renderAll();

  if (Element.prototype.addEventListener) {
    window.addEventListener('resize', renderAll);
  }
};
