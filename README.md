src-N Polyfill
===========

Javascript src-N proposal for responsive images polyfill

Only 2,3KB minified and gzipped.

Based on [Proposal for RespImg Syntax](http://tabatkins.github.io/specs/respimg/Overview.html).

Use
---

Load the polyfill file (preffer minified `src-n-polyfill.min.js`) and call
`window.srcnpolyfill()` at the bottom of your mark-up or at DOM ready event.

```html
  <script src="src-n-polyfill.min.js"></script>
  <script>
    window.srcnpolyfill();
  </script>
</body>
```

Browser support
---------------

Works out of the box for any modern browser supporting [window.matchMedia](http://caniuse.com/matchmedia) and [ES5 array functions](http://kangax.github.io/es5-compat-table/#Array.prototype.forEach).

If you need IE 8 or IE 9 support, use the corresponding polyfills.


Changelog
---------

- v0.5.1  Enable use with Browserify and Debowerify
- v0.5.0  Fix a candidates order bug
- v0.4.0  Rewritten scope and dropped support for IE <= 9
- v0.3.0  jQuery independent
- v0.2.0  Reorganize and edit bower dependencies
- v0.1.0  Initial version

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/lmc-eu/src-n-polyfill/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

