/**
  * Hopper 0.2.1
  * (c) 2019
    * @license MIT
    */
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function getInRange(value, min, max) {
  return Math.max(Math.min(value, max), min);
}
function now() {
  return Date.now();
}
function Timer(callback, time) {
  this.create = function createTimer() {
    return window.setInterval(callback, time);
  };

  this.stop = function stopTimer() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  };

  this.start = function startTimer() {
    if (!this.timer) {
      this.timer = this.create();
    }
  };

  this.restart = function restartTimer(newTime) {
    time = newTime || time;
    this.stop();
    this.start();
  };

  this.timer = this.create();
}
function camelCaseToString(camelCase) {
  camelCase = camelCase.replace(/([A-Z]+)/g, ' $1');
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}
function normalizeSlideIndex(index, slidesCount) {
  if (index < 0) {
    return (index + slidesCount) % slidesCount;
  }

  return index % slidesCount;
}

function extractData(vnode, indx) {
  var cOpts = vnode.componentOptions;
  var data = {
    class: vnode.data.class,
    staticClass: vnode.data.staticClass,
    style: vnode.data.style,
    attrs: vnode.data.attrs,
    props: _objectSpread({}, cOpts.propsData, {
      isClone: true,
      index: indx
    }),
    on: cOpts.listeners,
    nativeOn: vnode.data.nativeOn,
    directives: vnode.data.directives,
    scopesSlots: vnode.data.scopesSlots,
    slot: vnode.data.slot,
    ref: vnode.data.ref,
    key: vnode.data.key ? "".concat(indx, "-clone") : undefined
  };
  return data;
}

function cloneSlide(vnode, indx) {
  // use the context that the original vnode was created in.
  var h = vnode.context && vnode.context.$createElement;
  var children = vnode.componentOptions.children;
  var data = extractData(vnode, indx);
  var tag = vnode.componentOptions.Ctor;
  return h(tag, data, children);
}

//
var script = {
  name: 'Hooper',
  provide: function provide() {
    return {
      $hooper: this
    };
  },
  props: {
    // count of items to showed per view
    itemsToShow: {
      default: 1,
      type: Number
    },
    // count of items to slide when use navigation buttons
    itemsToSlide: {
      default: 1,
      type: Number
    },
    // index number of initial slide
    initialSlide: {
      default: 0,
      type: Number
    },
    // control infinite scrolling mode
    infiniteScroll: {
      default: false,
      type: Boolean
    },
    // control center mode
    centerMode: {
      default: false,
      type: Boolean
    },
    // vertical sliding mode
    vertical: {
      default: false,
      type: Boolean
    },
    // enable rtl mode
    rtl: {
      default: null,
      type: Boolean
    },
    // enable auto sliding to carousel
    autoPlay: {
      default: false,
      type: Boolean
    },
    // speed of auto play to trigger slide
    playSpeed: {
      default: 2000,
      type: Number
    },
    // toggle mouse dragging
    mouseDrag: {
      default: true,
      type: Boolean
    },
    // toggle touch dragging
    touchDrag: {
      default: true,
      type: Boolean
    },
    // toggle mouse wheel sliding
    wheelControl: {
      default: true,
      type: Boolean
    },
    // toggle keyboard control
    keysControl: {
      default: true,
      type: Boolean
    },
    // enable any move to commit a slide
    shortDrag: {
      default: true,
      type: Boolean
    },
    // sliding transition time in ms
    transition: {
      default: 300,
      type: Number
    },
    // sync two carousels to slide together
    sync: {
      default: '',
      type: String
    },
    // pause autoPlay on mousehover
    hoverPause: {
      default: true,
      type: Boolean
    },
    // remove empty space around slides
    trimWhiteSpace: {
      default: false,
      type: Boolean
    },
    // an object to pass all settings
    settings: {
      default: function _default() {
        return {};
      },
      type: Object
    }
  },
  data: function data() {
    return {
      isDragging: false,
      isSliding: false,
      isTouch: false,
      isHover: false,
      isFocus: false,
      slideWidth: 0,
      slideHeight: 0,
      slidesCount: 0,
      trimStart: 0,
      trimEnd: 1,
      currentSlide: null,
      timer: null,
      slides: [],
      defaults: {},
      breakpoints: {},
      delta: {
        x: 0,
        y: 0
      },
      config: {}
    };
  },
  computed: {
    trackTransform: function trackTransform() {
      var _this$config = this.config,
          infiniteScroll = _this$config.infiniteScroll,
          vertical = _this$config.vertical,
          rtl = _this$config.rtl,
          centerMode = _this$config.centerMode;
      var direction = rtl ? -1 : 1;
      var slideLength = vertical ? this.slideHeight : this.slideWidth;
      var containerLength = vertical ? this.containerHeight : this.containerWidth;
      var dragDelta = vertical ? this.delta.y : this.delta.x;
      var clonesSpace = infiniteScroll ? slideLength * this.slidesCount : 0;
      var centeringSpace = centerMode ? (containerLength - slideLength) / 2 : 0; // calculate track translate

      var translate = dragDelta + direction * (centeringSpace - clonesSpace - this.currentSlide * slideLength);

      if (vertical) {
        return "transform: translate(0, ".concat(translate, "px);");
      }

      return "transform: translate(".concat(translate, "px, 0);");
    },
    trackTransition: function trackTransition() {
      if (this.isSliding) {
        return "transition: ".concat(this.config.transition, "ms");
      }

      return '';
    }
  },
  methods: {
    // controlling methods
    slideTo: function slideTo(slideIndex) {
      var _this = this;

      var mute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.isSliding || slideIndex === this.currentSlide) {
        return;
      }

      this.$emit('beforeSlide', {
        currentSlide: this.currentSlide,
        slideTo: index
      });
      var _this$config2 = this.config,
          infiniteScroll = _this$config2.infiniteScroll,
          transition = _this$config2.transition;
      var previousSlide = this.currentSlide;
      var index = infiniteScroll ? slideIndex : getInRange(slideIndex, this.trimStart, this.slidesCount - this.trimEnd);

      if (this.syncEl && !mute) {
        this.syncEl.slideTo(slideIndex, true);
      }

      this.currentSlide = index;
      this.isSliding = true;
      window.setTimeout(function () {
        _this.isSliding = false;
        _this.currentSlide = normalizeSlideIndex(index, _this.slidesCount);
      }, transition);
      this.$emit('slide', {
        currentSlide: this.currentSlide,
        slideFrom: previousSlide
      });
    },
    slideNext: function slideNext() {
      this.slideTo(this.currentSlide + this.config.itemsToSlide);
    },
    slidePrev: function slidePrev() {
      this.slideTo(this.currentSlide - this.config.itemsToSlide);
    },
    initEvents: function initEvents() {
      // get the element direction if not explicitly set
      if (this.defaults.rtl === null) {
        this.defaults.rtl = getComputedStyle(this.$el).direction === 'rtl';
      }

      if (this.config.autoPlay) {
        this.initAutoPlay();
      }

      if (this.config.mouseDrag) {
        this.$refs.track.addEventListener('mousedown', this.onDragStart);
      }

      if (this.config.touchDrag) {
        this.$refs.list.addEventListener('touchstart', this.onDragStart, {
          passive: false,
          capture: false
        });
        this.$refs.list.addEventListener('touchmove', this.onDrag, {
          passive: false,
          capture: false
        });
        this.$refs.list.addEventListener('touchend', this.onDragEnd, {
          passive: true,
          capture: false
        });
      }

      if (this.config.keysControl) {
        this.$el.addEventListener('keydown', this.onKeypress);
      }

      if (this.config.wheelControl) {
        this.lastScrollTime = now();
        this.$el.addEventListener('wheel', this.onWheel, {
          passive: false
        });
      }

      window.addEventListener('resize', this.update);
    },
    initSync: function initSync() {
      if (this.config.sync) {
        var el = this.$parent.$refs[this.config.sync];

        if (!el && process && process.env.NODE_ENV !== 'production') {
          console.warn("Hooper: expects an element with attribute ref=\"".concat(this.config.sync, "\", but found none."));
          return;
        }

        this.syncEl = this.$parent.$refs[this.config.sync];
        this.syncEl.syncEl = this;
      }
    },
    initAutoPlay: function initAutoPlay() {
      var _this2 = this;

      this.timer = new Timer(function () {
        if (_this2.isSliding || _this2.isDragging || _this2.isHover && _this2.config.hoverPause || _this2.isFocus) {
          return;
        }

        if (_this2.currentSlide === _this2.slidesCount - 1 && !_this2.config.infiniteScroll) {
          _this2.slideTo(0);

          return;
        }

        _this2.slideNext();
      }, this.config.playSpeed);
    },
    initDefaults: function initDefaults() {
      this.breakpoints = this.settings.breakpoints;
      this.defaults = Object.assign({}, this.$props, this.settings);
      this.config = Object.assign({}, this.defaults);
    },
    initSlides: function initSlides() {
      var _this3 = this;

      this.slides = this.filteredSlides();
      this.slidesCount = this.slides.length;
      this.slides.forEach(function (slide, indx) {
        slide.componentOptions.propsData.index = indx;
      });

      if (this.config.infiniteScroll) {
        var before = [];
        var after = [];
        this.slides.forEach(function (slide, indx) {
          before.push(cloneSlide(slide, indx - _this3.slidesCount));
          after.push(cloneSlide(slide, indx + _this3.slidesCount));
        });
        this.$slots['clone-before'] = before;
        this.$slots['clone-after'] = after;
      }
    },
    // updating methods
    update: function update() {
      if (this.breakpoints) {
        this.updateConfig();
      }

      this.updateWidth();
      this.updateTrim();
      this.$emit('updated', {
        containerWidth: this.containerWidth,
        containerHeight: this.containerHeight,
        slideWidth: this.slideWidth,
        slideHeight: this.slideHeight,
        settings: this.config
      });
    },
    updateTrim: function updateTrim() {
      var _this$config3 = this.config,
          trimWhiteSpace = _this$config3.trimWhiteSpace,
          itemsToShow = _this$config3.itemsToShow,
          centerMode = _this$config3.centerMode,
          infiniteScroll = _this$config3.infiniteScroll;

      if (!trimWhiteSpace || infiniteScroll) {
        this.trimStart = 0;
        this.trimEnd = 1;
        return;
      }

      this.trimStart = centerMode ? Math.floor((itemsToShow - 1) / 2) : 0;
      this.trimEnd = centerMode ? Math.ceil(itemsToShow / 2) : itemsToShow;
    },
    updateWidth: function updateWidth() {
      var rect = this.$el.getBoundingClientRect();
      this.containerWidth = rect.width;
      this.containerHeight = rect.height;

      if (this.config.vertical) {
        this.slideHeight = this.containerHeight / this.config.itemsToShow;
        return;
      }

      this.slideWidth = this.containerWidth / this.config.itemsToShow;
    },
    updateConfig: function updateConfig() {
      var _this4 = this;

      var breakpoints = Object.keys(this.breakpoints).sort(function (a, b) {
        return b - a;
      });
      var matched;
      breakpoints.some(function (breakpoint) {
        matched = window.matchMedia("(min-width: ".concat(breakpoint, "px)")).matches;

        if (matched) {
          _this4.config = Object.assign({}, _this4.config, _this4.defaults, _this4.breakpoints[breakpoint]);
          return true;
        }
      });

      if (!matched) {
        this.config = Object.assign(this.config, this.defaults);
      }
    },
    restartTimer: function restartTimer() {
      if (this.timer) {
        this.timer.restart();
      }
    },
    restart: function restart() {
      var _this5 = this;

      this.initSlides();
      this.$nextTick(function () {
        _this5.update();
      });
    },
    // events handlers
    onDragStart: function onDragStart(event) {
      this.isTouch = event.type === 'touchstart';

      if (!this.isTouch && event.button !== 0) {
        return;
      }

      this.startPosition = {
        x: 0,
        y: 0
      };
      this.endPosition = {
        x: 0,
        y: 0
      };
      this.isDragging = true;
      this.startPosition.x = this.isTouch ? event.touches[0].clientX : event.clientX;
      this.startPosition.y = this.isTouch ? event.touches[0].clientY : event.clientY;
    },
    onDrag: function onDrag(event) {
      if (this.isSliding) {
        return;
      }

      this.endPosition.x = this.isTouch ? event.touches[0].clientX : event.clientX;
      this.endPosition.y = this.isTouch ? event.touches[0].clientY : event.clientY;
      this.delta.x = this.endPosition.x - this.startPosition.x;
      this.delta.y = this.endPosition.y - this.startPosition.y;
      event.preventDefault();
      event.stopPropagation();
    },
    onDragEnd: function onDragEnd() {
      var tolerance = this.config.shortDrag ? 0.5 : 0.15;
      this.isDragging = false;

      if (this.config.vertical) {
        var draggedSlides = Math.round(Math.abs(this.delta.y / this.slideHeight) + tolerance);
        this.slideTo(this.currentSlide - Math.sign(this.delta.y) * draggedSlides);
      }

      if (!this.config.vertical) {
        var direction = (this.config.rtl ? -1 : 1) * Math.sign(this.delta.x);

        var _draggedSlides = Math.round(Math.abs(this.delta.x / this.slideWidth) + tolerance);

        this.slideTo(this.currentSlide - direction * _draggedSlides);
      }

      this.delta.x = 0;
      this.delta.y = 0;
      this.restartTimer();
    },
    onTransitionend: function onTransitionend() {
      this.isSliding = false;
      this.$emit('afterSlide', {
        currentSlide: this.currentSlide
      });
    },
    onKeypress: function onKeypress(event) {
      var key = event.key;

      if (key.startsWith('Arrow')) {
        event.preventDefault();
      }

      if (this.config.vertical) {
        if (key === 'ArrowUp') {
          this.slidePrev();
        }

        if (key === 'ArrowDown') {
          this.slideNext();
        }

        return;
      }

      if (this.config.rtl) {
        if (key === 'ArrowRight') {
          this.slidePrev();
        }

        if (key === 'ArrowLeft') {
          this.slideNext();
        }

        return;
      }

      if (key === 'ArrowRight') {
        this.slideNext();
      }

      if (key === 'ArrowLeft') {
        this.slidePrev();
      }
    },
    onWheel: function onWheel(event) {
      event.preventDefault();

      if (now() - this.lastScrollTime < 200) {
        return;
      } // get wheel direction


      this.lastScrollTime = now();
      var value = event.wheelDelta || -event.deltaY;
      var delta = Math.sign(value);

      if (delta === -1) {
        this.slideNext();
      }

      if (delta === 1) {
        this.slidePrev();
      }
    },
    filteredSlides: function filteredSlides() {
      return this.$slots.default.filter(function (el) {
        if (!el.componentOptions || !el.componentOptions.Ctor) {
          return false;
        }

        return el.componentOptions.Ctor.options.name === 'HooperSlide';
      });
    }
  },
  beforeUpdate: function beforeUpdate() {
    var isForcUpdated = this.config.infiniteScroll && (!this.$slots['clone-before'] || !this.$slots['clone-after']);
    var isSlidesUpdated = this.filteredSlides().length !== this.slidesCount;

    if (isForcUpdated || isSlidesUpdated) {
      this.initSlides();
    }
  },
  created: function created() {
    this.initDefaults();
    this.initSlides();
  },
  mounted: function mounted() {
    var _this6 = this;

    this.initEvents();
    this.$nextTick(function () {
      _this6.initSync();

      _this6.update();

      _this6.slideTo(_this6.config.initialSlide);

      _this6.$emit('loaded');
    });
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.update);
    this.$refs.list.removeEventListener('touchstart', this.onDragStart);
    this.$refs.list.removeEventListener('touchmove', this.onDrag);
    this.$refs.list.removeEventListener('touchend', this.onDragEnd);

    if (this.timer) {
      this.timer.stop();
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('section', {
    staticClass: "hooper",
    class: {
      'is-vertical': _vm.config.vertical,
      'is-rtl': _vm.config.rtl
    },
    attrs: {
      "tabindex": "0"
    },
    on: {
      "mouseover": function mouseover($event) {
        _vm.isHover = true;
      },
      "mouseleave": function mouseleave($event) {
        _vm.isHover = false;
      },
      "focusin": function focusin($event) {
        _vm.isFocus = true;
      },
      "focusout": function focusout($event) {
        _vm.isFocus = false;
      }
    }
  }, [_c('div', {
    ref: "list",
    staticClass: "hooper-list"
  }, [_c('ul', {
    ref: "track",
    staticClass: "hooper-track",
    class: {
      'is-dragging': _vm.isDragging
    },
    style: _vm.trackTransform + _vm.trackTransition,
    on: {
      "transitionend": _vm.onTransitionend
    }
  }, [_vm._t("clone-before"), _vm._v(" "), _vm._t("default"), _vm._v(" "), _vm._t("clone-after")], 2)]), _vm._v(" "), _vm._t("hooper-addons"), _vm._v(" "), _c('div', {
    staticClass: "hooper-liveregion hooper-sr-only",
    attrs: {
      "aria-live": "polite",
      "aria-atomic": "true"
    }
  }, [_vm._v("\n    " + _vm._s("Item " + (_vm.currentSlide + 1) + " of " + _vm.slidesCount) + "\n  ")])], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

var Hooper = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$1 = {
  name: 'HooperSlide',
  inject: ['$hooper'],
  props: {
    isClone: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0,
      required: true
    }
  },
  computed: {
    style: function style() {
      var _ref = this.$hooper || {},
          config = _ref.config,
          slideHeight = _ref.slideHeight,
          slideWidth = _ref.slideWidth;

      if (config.vertical) {
        return "height: ".concat(slideHeight, "px");
      }

      return "width: ".concat(slideWidth, "px");
    },
    lower: function lower() {
      var _ref2 = this.$hooper || {},
          config = _ref2.config,
          currentSlide = _ref2.currentSlide,
          slidesCount = _ref2.slidesCount;

      var siblings = config.itemsToShow;
      return config.centerMode ? Math.ceil(currentSlide - siblings / 2) : currentSlide;
    },
    upper: function upper() {
      var _ref3 = this.$hooper || {},
          config = _ref3.config,
          currentSlide = _ref3.currentSlide,
          slidesCount = _ref3.slidesCount;

      var siblings = config.itemsToShow;
      return config.centerMode ? Math.floor(currentSlide + siblings / 2) : Math.floor(currentSlide + siblings - 1);
    },
    isActive: function isActive() {
      return this.index >= this.lower && this.index <= this.upper;
    },
    isPrev: function isPrev() {
      return this.index <= this.lower - 1;
    },
    isNext: function isNext() {
      return this.index >= this.upper + 1;
    },
    isCurrent: function isCurrent() {
      return this.index === this.$hooper.currentSlide || this.index === this.$hooper.currentSlide - this.$hooper.slidesCount || this.index === this.$hooper.currentSlide + this.$hooper.slidesCount;
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('li', {
    staticClass: "hooper-slide",
    class: {
      'is-clone': _vm.isClone,
      'is-active': _vm.isActive,
      'is-prev': _vm.isPrev,
      'is-next': _vm.isNext,
      'is-current': _vm.isCurrent
    },
    style: _vm.style,
    attrs: {
      "aria-hidden": _vm.isActive
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

var Slide = normalizeComponent_1({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

var Mixin = {
  inject: ['$hooper']
};

var icons = {
  arrowUp: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  arrowDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  arrowRight: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z',
  arrowLeft: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z'
};
var Icons = {
  name: 'HooperIcon',
  functional: true,
  inheritAttrs: true,
  props: {
    name: {
      type: String,
      required: true,
      validator: function validator(val) {
        return val in icons;
      }
    }
  },
  render: function render(createElement, _ref) {
    var props = _ref.props;
    var icon = icons[props.name];
    var children = [];
    children.push(createElement('title', camelCaseToString(props.name)));
    children.push(createElement('path', {
      attrs: {
        d: 'M0 0h24v24H0z',
        fill: 'none'
      }
    }));
    children.push(createElement('path', {
      attrs: {
        d: icon
      }
    }));
    return createElement('svg', {
      attrs: {
        class: "icon icon-".concat(props.name),
        viewBox: '0 0 24 24',
        width: '24px',
        height: '24px'
      }
    }, children);
  }
};

//
var script$2 = {
  inject: ['$hooper'],
  name: 'HooperProgress',
  computed: {
    currentSlide: function currentSlide() {
      return normalizeSlideIndex(this.$hooper.currentSlide, this.$hooper.slidesCount);
    },
    progress: function progress() {
      var range = this.$hooper.slidesCount - this.$hooper.trimStart - this.$hooper.trimEnd;
      return (this.currentSlide - this.$hooper.trimStart) * 100 / range;
    }
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "hooper-progress"
  }, [_c('div', {
    staticClass: "hooper-progress-inner",
    style: "width: " + _vm.progress + "%"
  })]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

var Progress = normalizeComponent_1({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, undefined, undefined);

//
var script$3 = {
  inject: ['$hooper'],
  name: 'HooperPagination',
  props: {
    mode: {
      default: 'indicator',
      type: String
    }
  },
  computed: {
    currentSlide: function currentSlide() {
      return normalizeSlideIndex(this.$hooper.currentSlide, this.$hooper.slidesCount);
    },
    slides: function slides() {
      var slides = this.$hooper.slides.map(function (_, index) {
        return index;
      });
      return slides.slice(this.$hooper.trimStart, this.$hooper.slidesCount - this.$hooper.trimEnd + 1);
    }
  }
};

/* script */
var __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "hooper-pagination",
    class: {
      'is-vertical': _vm.$hooper.config.vertical
    }
  }, [_vm.mode === 'indicator' ? _c('ol', {
    staticClass: "hooper-indicators"
  }, _vm._l(_vm.slides, function (index) {
    return _c('li', {
      key: index
    }, [_c('button', {
      staticClass: "hooper-indicator",
      class: {
        'is-active': _vm.currentSlide === index
      },
      on: {
        "click": function click($event) {
          return _vm.$hooper.slideTo(index);
        }
      }
    }, [_c('span', {
      staticClass: "hooper-sr-only"
    }, [_vm._v("item " + _vm._s(index))])])]);
  }), 0) : _vm._e(), _vm._v(" "), _vm.mode === 'fraction' ? [_c('span', [_vm._v(_vm._s(_vm.currentSlide + 1))]), _vm._v(" "), _c('span', [_vm._v("/")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$hooper.slidesCount))])] : _vm._e()], 2);
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = undefined;
/* functional template */

var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

var Pagination = normalizeComponent_1({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, undefined, undefined);

//
var script$4 = {
  inject: ['$hooper'],
  name: 'HooperNavigation',
  components: {
    Icons: Icons
  },
  computed: {
    isPrevDisabled: function isPrevDisabled() {
      if (this.$hooper.config.infiniteScroll) {
        return false;
      }

      return this.$hooper.currentSlide === 0;
    },
    isNextDisabled: function isNextDisabled() {
      if (this.$hooper.config.infiniteScroll) {
        return false;
      }

      return this.$hooper.currentSlide === this.$hooper.slidesCount - 1;
    },
    isRTL: function isRTL() {
      return this.$hooper.config.rtl;
    },
    isVertical: function isVertical() {
      return this.$hooper.config.vertical;
    }
  },
  methods: {
    slideNext: function slideNext() {
      this.$hooper.slideNext();
      this.$hooper.restartTimer();
    },
    slidePrev: function slidePrev() {
      this.$hooper.slidePrev();
      this.$hooper.restartTimer();
    }
  }
};

/* script */
var __vue_script__$4 = script$4;
/* template */

var __vue_render__$4 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "hooper-navigation",
    class: {
      'is-vertical': _vm.$hooper.config.vertical,
      'is-rtl': _vm.$hooper.config.rtl
    }
  }, [_c('button', {
    staticClass: "hooper-prev",
    class: {
      'is-disabled': _vm.isPrevDisabled
    },
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.slidePrev
    }
  }, [_vm._t("hooper-prev", [_c('icons', {
    attrs: {
      "name": _vm.isVertical ? 'arrowUp' : _vm.isRTL ? 'arrowRight' : 'arrowLeft'
    }
  })])], 2), _vm._v(" "), _c('button', {
    staticClass: "hooper-next",
    class: {
      'is-disabled': _vm.isNextDisabled
    },
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.slideNext
    }
  }, [_vm._t("hooper-next", [_c('icons', {
    attrs: {
      "name": _vm.isVertical ? 'arrowDown' : _vm.isRTL ? 'arrowLeft' : 'arrowRight'
    }
  })])], 2)]);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$4 = undefined;
/* scoped */

var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = undefined;
/* functional template */

var __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

var Navigation = normalizeComponent_1({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, undefined, undefined);

export default Hooper;
export { Hooper, Slide, Progress, Pagination, Navigation, Icons, Mixin as addonMixin };
