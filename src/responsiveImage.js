var $ = require('./shim-jquery.js');

module.exports = (function () {
    /**
     * @constructor
     * @param {jQuery} image
     * @param {Array} rules
     */
    function ResponsiveImage(image, rules) {
        this.image = image;
        this.rules = rules;
    }

    function hasMinimumResolution(res) {
        var operaFraction = res,
            fractionDenominator = 1;
        res = parseFloat(res);
        res -= 0.01; // Hacky
        // FML opera O_o
        while (operaFraction % 1 > 0) {
            operaFraction *= 10;
            fractionDenominator *= 10;
        }

        var mediaQuery = "(-webkit-min-device-pixel-ratio: " + res + ")," +
            "(min--moz-device-pixel-ratio: " + res + ")," +
            "(-o-min-device-pixel-ratio: " + operaFraction + "/" + fractionDenominator + ")," +
            "(min-resolution: " + res + "dppx)";

        if (window.devicePixelRatio > res) {
            return true;
        }

        return window.matchMedia && window.matchMedia(mediaQuery).matches;

    }

    ResponsiveImage.prototype.setFromXBasedUrls = function(rule) {
        // Sort from highest resolution
        var xurls = rule.urls.urls.sort(function (a, b) {
            return a.resolution.value > b.resolution.value;
        });

        // List through available images and display closest match
        for (var j = 0; j < xurls.length; j++) {
            if (hasMinimumResolution(xurls[j].resolution.value)) {
                this.image.attr("src", xurls[j].url);
                console.log("Setting image URL to: " + xurls[j].url);
                return;
            }
        }
        this.image.attr("src", xurls[0].url);
        console.log("Setting image URL to: " + xurls[0].url);
    };

    ResponsiveImage.prototype.setFromViewportUrls = function (rule) {
        var j,
            image,
            imageCandidates,
            imagePixelSize,
            imageTargetSize = "100%",
            query,
            urls = rule.urls;

        // Determine which viewport we are targeting
        for (j = 0; j < urls["size-viewport-list"].length; j++) {
            var viewport = urls["size-viewport-list"][j];
            imageTargetSize = viewport["image-size"];
            if (imageTargetSize.unit) {
                imageTargetSize = imageTargetSize.value + imageTargetSize.unit;
            }
            if (!viewport["viewport-size"]) {
                break;
            }
            query = "(min-width:" + viewport["viewport-size"].value + viewport["viewport-size"].unit + ")";
            if (!window.matchMedia(query).matches) {
                break;
            }
        }

        // Set the target with and detect what the resulting pixel size will be
        this.image.width(imageTargetSize);
        imagePixelSize = this.image.width();

        // Find the image with the closest resolution
        imageCandidates = rule.urls["size-based-urls"].sort(function(a, b) {
            return a.size > b.size;
        });
        for (j = 0; j < imageCandidates.length; j++) {
            image = imageCandidates[j].url;
            if (imagePixelSize < imageCandidates[j].size) {
                break;
            }
        }

        // Set the selected image
        this.image.attr("src", image);
    };

    ResponsiveImage.prototype.setImage = function () {
        for (var i = 0; i < this.rules.length; i++) {
            var query, rule = this.rules[i];
            if (!rule.type || rule.type != 'src-n-attribute') {
                continue;
            }

            // window.matchMedia requires a poly-fill for IE8
            if (rule['media-query']) {
                query = "(" + rule['media-query'].feature + ":" + rule['media-query'].dimension.value + rule['media-query'].dimension.unit + ")";
                if (!matchMedia(query).matches) {
                    continue;
                }
            }
            if (rule.urls.type) {
                if (rule.urls.type == "x-based-urls") {
                    // Missing support for other than X urls (DPI, DPCM)
                    this.setFromXBasedUrls(rule);
                }

                if (rule.urls.type == "viewport-urls") {
                   this.setFromViewportUrls(rule);
                }
            }
            break; // First one has to do it
        }
    };
    return ResponsiveImage;
})();