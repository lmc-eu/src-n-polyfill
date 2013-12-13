var ResponsiveImage = require('./responsiveImage.js');
var parse = require('src-n-parse').parse;

window.srcnpolyfill = function() {
  var images = [];

  function createResponsiveImage(element) {
    var i, m, rule,
        candidates = [],
        attrs = element.attributes,
        re = /^src-([0-9][1-9]*)$/i;

    for (i = 0; i < attrs.length; ++i) {
      m = attrs[i].name.match(re);
      if (m) {
        try {
          rule = parse(attrs[i].value);
        } catch (e) {
          /* Invalid src-n attribute, silently ignore like any other HTML you don't know */
          break;
        }
        candidates.push({
          rule: rule,
          index: parseInt(m[1], 10)
        });
      }
    }

    candidates.sort(function (a, b) {
      return a.index - b.index;
    });

    if (attrs.src && attrs.src.value) {
      candidates.push({
        rule: parse(attrs.src.value),
        index: 0
      });
    }

    return new ResponsiveImage(element, candidates);
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
