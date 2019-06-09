/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "c7c1c02d5732923fc9dae77d47696c87"
  },
  {
    "url": "api.html",
    "revision": "770999efc357d364012909b991a13e30"
  },
  {
    "url": "assets/css/0.styles.fed9bb94.css",
    "revision": "5174ead5b8d76daf7caa8e28ee2d08f5"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.ee91756f.js",
    "revision": "9e8d4a1d4a7a93d12b324a13e4e51c53"
  },
  {
    "url": "assets/js/3.f728959b.js",
    "revision": "b4e41d4d5919485f610c706cc99e3ec4"
  },
  {
    "url": "assets/js/4.2bec89dc.js",
    "revision": "efa021c2c7e9024bc421182b4bab13b8"
  },
  {
    "url": "assets/js/5.075598e9.js",
    "revision": "eee3fa3c19c8695953b6c77627d0373a"
  },
  {
    "url": "assets/js/6.50dea713.js",
    "revision": "fffff27bd20b5788303c8b03f21d3146"
  },
  {
    "url": "assets/js/7.d236ab7b.js",
    "revision": "486a7ad3ee093e788c3bad20bc3f6e02"
  },
  {
    "url": "assets/js/app.79038135.js",
    "revision": "9890d735c65557ea54cce2b0c11ff168"
  },
  {
    "url": "examples.html",
    "revision": "9d10ed5fe3379c846192f972163681f3"
  },
  {
    "url": "getting-started.html",
    "revision": "2dac0f7fcc302ef79d05dc74a29eabd3"
  },
  {
    "url": "hooper.svg",
    "revision": "e138dfdb27cd6a48518049a5571ce28d"
  },
  {
    "url": "index.html",
    "revision": "8f0b32cfabaffa3f75007deddb0f1e14"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
