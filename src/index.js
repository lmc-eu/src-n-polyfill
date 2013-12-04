var ResponsiveImage = require('./responsiveImage.js');
var parse = require('src-n-parse').parse;
var images = [];

function addToCollection(element) {
  var i,
      rules = [],
      attrs = element.attributes;

  for (i = 0; i < attrs.length; ++i) {
    if (attrs[i].name.match(/^src(-[0-9]+)?$/i)){
      rules.push(parse(attrs[i].value));
    }
  }
  console.log(rules);
  images.push(new ResponsiveImage(
    element,
    rules
  ));
}

function buildCollection() {
  var i,
      imagesWithSrc1 = document.querySelectorAll('img[src-1]');
    
  for (i = 0; i < imagesWithSrc1.length; ++i) {
    addToCollection(imagesWithSrc1[i]);
  }
}

function renderAll() {
  images.forEach(function(img){
    img.setImage();
  });
}

window.srcnpolyfill = function() {

  // Browsers not supporting ES5 are not responsive anyway
  if (!Array.prototype.forEach || !window.matchMedia) {
    return;
  }

  buildCollection();
  renderAll();

  if (Element.prototype.addEventListener) {
    window.addEventListener('resize', renderAll);
  }
};
