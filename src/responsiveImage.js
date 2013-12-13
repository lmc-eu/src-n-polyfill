module.exports = (function () {
    /**
     * @constructor
     * @param {jQuery} image
     * @param {Array} candidates
     */
    function ResponsiveImage(image, candidates) {
        this.image = image;
        this.candidates = candidates;
    }

    function hasMinimumResolution(res) {
        var operaFraction = res,
            fractionDenominator = 1;

        if (window.devicePixelRatio > res) {
            return true;
        }

        res = parseFloat(res);
        // FML opera O_o
        while (operaFraction % 1 > 0) {
            operaFraction *= 10;
            fractionDenominator *= 10;
        }

        var mediaQuery = "(-webkit-min-device-pixel-ratio: " + res + ")," +
            "(min--moz-device-pixel-ratio: " + res + ")," +
            "(-o-min-device-pixel-ratio: " + operaFraction + "/" + fractionDenominator + ")," +
            "(min-resolution: " + res + "dppx)";

        return window.matchMedia && window.matchMedia(mediaQuery).matches;
    }

    ResponsiveImage.prototype.setFromXBasedUrls = function(rule) {
        // Sort from highest resolution
        var xurls = rule.urls.urls.sort(function (a, b) {
            return a.resolution.value - b.resolution.value;
        });

        // List through available images and display closest match
        for (var j = 0; j < xurls.length; j++) {
            if (hasMinimumResolution(xurls[j].resolution.value)) {
                this.image.src = xurls[j].url;
                return;
            }
        }
        this.image.src = xurls[0].url;
    };

    ResponsiveImage.prototype.setFromViewportUrls = function (rule) {
        var j,
            image,
            imageCandidates,
            imagePixelSize,
            imageTargetSize,
            query,
            urls = rule.urls;

        // Determine which viewport we are targeting
        for (j = 0; j < urls["size-viewport-list"].length; j++) {
            var viewport = urls["size-viewport-list"][j];
            imageTargetSize = viewport["image-size"];
            if (!viewport["viewport-size"]) {
                break;
            }
            query = "(min-width:" + viewport["viewport-size"].value + viewport["viewport-size"].unit + ")";
            if (!window.matchMedia(query).matches) {
                break;
            }
        }

        // Percentages are relative to the viewport
        if (imageTargetSize.unit === '%') {
            imageTargetSize = ((imageTargetSize.value / 100) * window.innerWidth) + 'px';
        }
        if (imageTargetSize.unit) {
            imageTargetSize = imageTargetSize.value + imageTargetSize.unit;
        }
        // Set the target with and detect what the resulting pixel size will be
        this.image.style.width = imageTargetSize;
        compStyle = window.getComputedStyle ?
                    window.getComputedStyle(this.image, null) :
                    this.image.currentStyle;
        imagePixelSize = parseInt(compStyle.width, 10);
        imagePixelSize = window.devicePixelRatio ? imagePixelSize * window.devicePixelRatio : imagePixelSize;

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
        this.image.src = image;
    };

    ResponsiveImage.prototype.setImage = function () {
        for (var i = 0; i < this.candidates.length; i++) {
            var query,
                rule = this.candidates[i].rule;
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
