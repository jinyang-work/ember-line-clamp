import Ember from 'ember';
import layout from '../templates/components/line-clamp';

const LINE_CLAMP_CLASS = 'lt-line-clamp';
const SINGLE_LINE_CLAMP_CLASS = `${LINE_CLAMP_CLASS} ${LINE_CLAMP_CLASS}--single-line`;
const MULTI_LINE_CLAMP_CLASS = `${LINE_CLAMP_CLASS} ${LINE_CLAMP_CLASS}--multi-line`;
const ELLIPSIS_CLASS = `${LINE_CLAMP_CLASS}__ellipsis`;
const ELLIPSIS_DUMMY_CLASS = `${ELLIPSIS_CLASS}--dummy`;
const MORE_CLASS = `${LINE_CLAMP_CLASS}__more`;

/**
 * Generic component used to truncate/clamp text to a specified number of lines
 * @param {String}  text @required Text to be clamped
 * @param {Number}  lines @default 3 Number of lines to clamp
 * @param {Boolean} stripText @default false Enable stripping <br> tags when using native css line-clamp
 * @param {String}  ellipsis @default '...' Characters to be used as ellipsis
 * @param {Boolean} interactive @default true Enable see more/see less functionality
 * @param {Boolean} useJsOnly @default false Disable native CSS solution
 * @param {Boolean} truncate @default true Allow managing truncation from outside component
 * @param {Boolean} showMoreButton @default true
 * @param {Boolean} showLessButton @default true
 * @param {String}  seeMoreText @default 'See More'
 * @param {String}  seeLessText @default 'See Less'
 * @param {Action}  onExpand Action triggered when text is expanded
 * @param {Action}  onCollapse Action triggered when text is collapsed
 * @param {Action}  handleTruncate Action triggered every time text does get truncated/clamped
 *
 * @example
 * ```
 * {{line-clamp text="Some long text"}}
 * ```
 *
 * @class LineClampComponent
 */
export default Ember.Component.extend({
  layout,

  unifiedEventHandler: Ember.inject.service(),

  componentName: 'LineClamp',

  tagName: 'div',

  /**
   * Attribute binding for class - sets specific CSS classes when CSS solution is available
   */
  classNameBindings: ['_lineClampClass'],

  /**
   * Attribute binding for style - sets specific CSS styles when CSS solution is available
   */
  attributeBindings: ['_lineClampStyle:style'],

  /**
   * Text to truncate/clamp
   * @type {String}
   */
  text: '',

  /**
   * Characters/text to be used as the overflow/ellipsis when text is truncated
   * @type {String}
   * @default '...'
   */
  ellipsis: '...',

  /**
   * The number of lines at which to clamp text
   * @type {Number}
   * @default 3
   */
  lines: 3,

  /**
   * An override to the default behavior when clamping text and removing `<br>` tags and `\n` characters.
   * @type {Boolean}
   * @default true
   */
  stripText: true,

  /**
   * An override that can be used to hide both seeMore and seeLess interactive elements
   * @type {Boolean}
   * @default true
   */
  interactive: true,

  /**
   * An override that can be used to skip native CSS solution when available and instead use JS solution
   * @type {Boolean}
   * @default false
   */
  useJsOnly: false,

  /**
   * Attribute that can be used to control truncation from outside of the component
   * @type {Boolean}
   * @default true
   */
  truncate: true,

  /**
   * An override that can be used to hide "see more" interactive element
   * @type {Boolean}
   * @default true
   */
  showMoreButton: true,

  /**
   * An override that can be used to hide "see less" interactive element
   * @type {Boolean}
   * @default true
   */
  showLessButton: true,

  /**
   * Text to display in "see more" interactive element
   * @type {String}
   * @default 'See More'
   */
  seeMoreText: 'See More',

  /**
   * Text to display in "see less" interactive element
   * @type {String}
   * @default 'See Less'
   */
  seeLessText: 'See Less',

  /**
   * Based on showMoreButton and interactive flags
   * @type {Boolean}
   * @private
   */
  _isInteractive: true,

  /**
   * Used to track state of text as expanded or not expanded/collapsed
   * @type {Boolean}
   * @private
   */
  _expanded: false,

  /**
   * Used to track state of text as truncated or not truncated
   * @type {Boolean}
   * @private
   */
  _truncated: true,

  /**
   * Used to track changes in the `truncate` attribute
   */
  _oldTruncate: true,

  /**
   * Used to track state and know if text should be stripped
   * @type {Boolean}
   * @private
   */
  _stripText: false,

  /**
   * Property that returns a stripped version of the text with no <br> tags
   * @type {String}
   * @private
   */
  _strippedText: Ember.computed('text', '_stripText', function getStrippedText() {
    if (typeof FastBoot === 'undefined') {
      if (typeof window !== 'undefined' && !!this.element && this.get('_stripText')) {
        if ((this._shouldUseNativeLineClampCSS() || this._shouldUseNativeTextOverflowCSS())) {
          return this._stripBrTags(this._unescapeText(this.get('text')));
        }

        return '';
      }
    }

    return '';
  }),

  /**
   * Property that returns array of lines to render
   * @type {Array}
   * @private
   */
  _textLines: Ember.computed('lines', 'text', 'targetWidth', '_expanded', function getTextLines() {
    if (typeof FastBoot === 'undefined') {
      const mounted = !!(this.element && this.get('targetWidth'));
      if (typeof window !== 'undefined' && mounted) {
        if (!this.get('_expanded')) {
          return this._getLines();
        } else {
          this.onTruncate(false);
          return [];
        }
      }

      return [];
    }

    return [];
  }),

  init() {
    this._super(...arguments);

    this.set('_oldTruncate', this.get('truncate'));

    // interative prop overpowers showMoreButton and showLessButton when false
    this.showMoreButton = this.interactive && this.showMoreButton;
    this.showLessButton = this.interactive && this.showLessButton;

    // Interativity of the component is driven by showMoreButton value
    this._isInteractive = this.showMoreButton;

    // No point in showLessButton true if showMoreButton is false
    this.showLessButton = this.showMoreButton ? this.showLessButton : false;

    this._getLines = this._getLines.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onTruncate = this.onTruncate.bind(this);
    this._measureWidth = this._measureWidth.bind(this);
    this._calculateTargetWidth = this._calculateTargetWidth.bind(this);
  },

  didReceiveAttrs() {
    if (this.get('truncate') !== this.get('_oldTruncate')) {
      this._handleNewTruncateAttr(this.get('truncate'));
      this.set('_oldTruncate', this.get('truncate'));
    }
  },

  didInsertElement() {
    if (this._shouldUseNativeLineClampCSS()) {
      this.set('_lineClampClass', MULTI_LINE_CLAMP_CLASS);
      this.set('_lineClampStyle', Ember.String.htmlSafe(`-webkit-line-clamp: ${this.get('lines')}`));
      this.set('_stripText', this.stripText);
    } else if (this._shouldUseNativeTextOverflowCSS()) {
      this.set('_lineClampClass', SINGLE_LINE_CLAMP_CLASS);
      this.set('_stripText', this.stripText);
    } else {
      const canvas = document.createElement('canvas');
      this.canvasContext = canvas.getContext('2d');

      this._createDummyEllipsisElement();
      this.element.appendChild(this.dummyEllipsisElement);

      this._calculateTargetWidth();
      this._bindResize();
    }
  },

  willDestroyElement() {
    if (this.dummyEllipsisElement) {
      this.element.removeChild(this.dummyEllipsisElement);
    }

    this._unbindResize();
    window.cancelAnimationFrame(this._scheduledResizeAnimationFrame);

    this._super(...arguments);
  },

  onResize() {
    // if (this._scheduledResizeAnimationFrame) {
    //   window.cancelAnimationFrame(this._scheduledResizeAnimationFrame);
    // }

    // this._scheduledResizeAnimationFrame = window.requestAnimationFrame(this._calculateTargetWidth);

    if (!this.working) {
      this._scheduledResizeAnimationFrame = window.requestAnimationFrame(this._calculateTargetWidth);
      this.working = true;
    }
  },

  onTruncate(didTruncate) {
    this._handleTruncate(didTruncate);

    const handleTruncate = this.attrs.handleTruncate;
    if (handleTruncate) {
      if (typeof handleTruncate === 'function') {
        handleTruncate(didTruncate);
      } else {
        this.sendAction('handleTruncate', didTruncate);
      }
    }
  },

  _handleNewTruncateAttr(truncate) {
    if (this._shouldUseNativeLineClampCSS()) {
      this.set('_lineClampClass', truncate ? MULTI_LINE_CLAMP_CLASS : '');
      this.set('_lineClampStyle', truncate ? Ember.String.htmlSafe(`-webkit-line-clamp: ${this.get('lines')}`) : Ember.String.htmlSafe(''));
      this.set('_stripText', this.stripText && truncate);
    } else if (this._shouldUseNativeTextOverflowCSS()) {
      this.set('_lineClampClass', truncate ? SINGLE_LINE_CLAMP_CLASS : '');
      this.set('_stripText', this.stripText && truncate);
    }

    this._onToggleTruncate();
  },

  /**
   * Calculates target width for the text (i.e. parent elment width)
   * @method _calculateTargetWidth
   * @return {Void}
   * @private
   */
  _calculateTargetWidth() {
    const targetWidth = this.element.getBoundingClientRect().width;

    if (!targetWidth) {
      return window.requestAnimationFrame(this._calculateTargetWidth);
    }

    const style = window.getComputedStyle(this.element);
    const font = [
      style['font-weight'],
      style['font-style'],
      style['font-size'],
      style['font-family']
    ].join(' ');

    this.canvasContext.font = font;
    this.set('targetWidth', targetWidth);
  },

  /**
   * Calculates text width using canvas
   * @method _measureWidth
   * @param {String} text
   * @return {Number}
   * @private
   */
  _measureWidth(text) {
    return this.canvasContext && this.canvasContext.measureText(text).width;
  },

  /**
   * Gets an element offsetWidth
   * @method _getElementWidth
   * @param {HTMLElement} node
   * @return {Number}
   * @private
   */
  _getElementWidth(node) {
    return node.offsetWidth;
  },

  // TODO: Remove this method - if consuming app has responsive styles that affect ellipsis element
  // this will give wrong width
  /**
   * Gets dummyEllipsisElement's offsetWidth
   * @method _getEllipsisWidth
   * @return {Number}
   * @private
   */
  _getEllipsisWidth() {
    if (!this._ellipsisWidth) {
      this._ellipsisWidth = this._getElementWidth(this.dummyEllipsisElement);
    }

    return this._ellipsisWidth;
  },

  /**
   * Utility method to create a DOM element mimicking the elment to be used for textoverflow/clamping
   * This element's purpose is for measuring only
   * @method _createDummyEllipsisElement
   * @return {Void}
   * @private
   */
  _createDummyEllipsisElement() {
    this.dummyEllipsisElement = document.createElement('span');
    this.dummyEllipsisElement.className = `${ELLIPSIS_CLASS} ${ELLIPSIS_DUMMY_CLASS}`;
    this.dummyEllipsisElement.innerHTML = this._isInteractive ? `${this.ellipsis} <a class="${MORE_CLASS}" href="#">${this.seeMoreText}</a>` : this.ellipsis;
  },

  /**
   * Checks for -webkit-line-clamp support, _isInteractive and lines > 1
   * @method _shouldUseNativeLineClampCSS
   * @return {Boolean}
   * @private
   */
  _shouldUseNativeLineClampCSS() {
    return this.get('useJsOnly') ? false : 'webkitLineClamp' in document.body.style && !this._isInteractive && this.get('lines') > 1;
  },

  /**
   * Checks for _isInteractive and lines === 1
   * @method _shouldUseNativeTextOverflowCSS
   * @return {Boolean}
   * @private
   */
  _shouldUseNativeTextOverflowCSS() {
    return this.get('useJsOnly') ? false : !this._isInteractive && this.get('lines') === 1;
  },

  /**
   * Binds/registers resize listener
   * @method _bindResize
   * @return {Void}
   * @private
   */
  _bindResize() {
    this.get('unifiedEventHandler').register('window', 'resize', this.get('onResize'));
    this._resizeHandlerRegistered = true;
  },

  /**
   * Unbinds/Unregisters resize listener in 'willDestroy'
   * @method _unbindResize
   * @return {Void}
   * @private
   */
  _unbindResize() {
    if (this._resizeHandlerRegistered) {
      this.get('unifiedEventHandler').unregister('window', 'resize', this.get('onResize'));
      this._resizeHandlerRegistered = false;
    }
  },

  /**
   * This method removes `<br>` tags in the text
   * @method _stripBrTags
   * @param {String} text
   * @private
   */
  _stripBrTags(text) {
    return text.toString().replace(/<br.*?[\/]?>/gi, ' ').replace(/\r\n|\n|\r/g, ' ');
  },

  /**
   * This method unescapes the string when escaped
   * @method _unescapeText
   * @param {String} text
   * @private
   */
  _unescapeText(text) {
    const fragment = document.createDocumentFragment();
    const tempElem = document.createElement('div');

    fragment.appendChild(tempElem);
    tempElem.innerHTML = text.toString();

    return fragment.firstChild.innerText;
  },

  /**
   * This method does the truncation by maipulating the text and creating lines
   * TODO: Remove mutation on state with textLines in each loop, getting hard to debug
   * @method _getLines
   * @return {Array}
   * @private
   */
  _getLines() {
    const lines = [];
    const numLines = this.get('lines');
    const text = this._unescapeText(this.get('text'));
    const strippedText = this.stripText ? this._stripBrTags(text) : text;
    const textLines = strippedText.split('\n').map(line => line.trim().split(' '));
    let didTruncate = true;

    const ellipsisWidth = this._getEllipsisWidth();

    for (let line = 1; line <= numLines; line += 1) {
      const textWords = textLines[0];

      // handle new line -- ???
      if (textWords.length === 0) {
        lines.push({
          newLine: true,
        });
        textLines.shift();
        line -= 1;
        continue;
      }

      const resultLine = {
        text: textWords.join(' '),
      };

      if (this._measureWidth(resultLine.text) <= this.targetWidth) {
        if (textLines.length === 1) {
          // Line is end of text and fits without truncating
          didTruncate = false;

          lines.push(Object.assign({}, resultLine, {
            lastLine: true,
            needsEllipsis: false,
          }));
          break;
        }
      }

      if (line === numLines) {
        // Binary search determining the longest possible line including truncate string
        const textRest = textWords.join(' ');

        let lower = 0;
        let upper = textRest.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = textRest.slice(0, middle + 1);

          if (this._measureWidth(testLine) + ellipsisWidth <= this.targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        // Object.assign and lines.push
        lines.push(Object.assign({}, resultLine, {
          text: textRest.slice(0, lower),
          lastLine: true,
          needsEllipsis: true,
        }));
      } else {
        // Binary search determining when the line breaks
        let lower = 0;
        let upper = textWords.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = textWords.slice(0, middle + 1).join(' ');

          if (this._measureWidth(testLine) <= this.targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        // The first word of thid line is too long to fit it
        if (lower === 0) {
          // Jump to processing of last line
          line = numLines - 1;
          continue;
        }

        // Object.assign and lines.push
        lines.push(Object.assign({}, resultLine, {
          text: textWords.slice(0, lower).join(' '),
        }));
        textLines[0].splice(0, lower);
      }
    }

    this.onTruncate(didTruncate);

    this.working = false;

    return lines;
  },

  /**
   * Handles state for _truncated
   * @method _handleTruncate
   * @param {Boolean} truncated
   * @return {Void}
   * @private
   */
  _handleTruncate(truncated) {
    if (this.get('_truncated') !== truncated) {
      this.set('_truncated', truncated);
    }
  },

  _onToggleTruncate() {
    this.toggleProperty('_expanded');

    const justExpanded = this.get('_expanded');

    if (justExpanded) {
      const onExpand = this.attrs.onExpand;

      if (onExpand) {
        if (typeof onExpand === 'function') {
          onExpand();
        } else {
          this.sendAction('onExpand');
        }
      }
    } else {
      const onCollapse = this.attrs.onCollapse;

      if (onCollapse) {
        if (typeof onCollapse === 'function') {
          onCollapse();
        } else {
          this.sendAction('onCollapse');
        }
      }
    }
  },

  actions: {
    toggleTruncate() {
      this._onToggleTruncate();
    },
  },
});
