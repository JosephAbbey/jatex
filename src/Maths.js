/**
 * @module Maths
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class MathsError extends ElementError {}

/** @extends {ElementEvent<Maths | InlineMaths | import("./Maths.js").Number | Variable | Vector | Brackets | import("./Maths.js").Function | Comma | CDot | Equals | Approx | Minus | Fraction | Power , "edit" | "editNumber">} */
export class MathsEvent extends ElementEvent {}

/**
 * @typedef MathsOptions
 * @prop {string} environment
 * @prop {boolean} numbered
 */

/**
 * @typedef MathsSerialised
 * @prop {string} environment
 * @prop {boolean} numbered
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX maths environment.
 */
export default class Maths extends Element {
  static type = 'Maths';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & MathsSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      environment: this.environment,
      numbered: this.numbered,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions & MathsOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.environment)
      throw new MathsError('An environment must be provided.');
    this.environment = options.environment;

    this.numbered = options.numbered ?? false;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.style.overflowWrap = 'none';
    var s = document.createElement('style');
    s.innerHTML = `
    #${this.id}, #${this.id} :not(sup, sub) {
      text-align: center;
      vertical-align: middle;
    }`;
    this._dom.append(s, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return (
      `\\begin{${this.environment}${this.numbered ? '' : '*'}}\n\n` +
      this.ctex +
      `\n\n\\end{${this.environment}${this.numbered ? '' : '*'}}`
    );
  }
}

Maths.register();

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX inline maths environment.
 */
export class InlineMaths extends Element {
  static type = 'InlineMaths';

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.style.whiteSpace = 'nowrap';
    var s = document.createElement('style');
    s.innerHTML = `
    #${this.id}, #${this.id} :not(sup, sub) {
      text-align: center;
      vertical-align: middle;
    }`;
    this._dom.append(s, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('click', (e) => {
      if (e.altKey) {
        if (e.shiftKey) this.desmos();
        else this.wolfram_alpha();
      }
    });
    return this._dom;
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   * @param l - The link to open
   *
   * @description Opens a popup window.
   */
  open(l) {
    window.open(l, '_blank', 'popup');
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   *
   * @description Opens this expression in desmos in a popup window.
   */
  desmos() {
    this.open('https://www.desmos.com/calculator?latex=' + this.ctex);
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   *
   * @description Opens this expression in WolframAlpha in a popup window.
   */
  wolfram_alpha() {
    this.open('https://www.wolframalpha.com/input?i=' + this.ctex);
  }

  get tex() {
    return '$' + this.ctex + '$';
  }
}

InlineMaths.register();

/**
 * @typedef NumberOptions
 * @prop {number} num
 */

/**
 * @typedef NumberSerialised
 * @prop {number} num
 */

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a number in a LaTeX maths environment.
 */
export class Number extends Element {
  static type = 'Number';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @type {ElementSerialised & NumberSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      num: this.num,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions & NumberOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.num) throw new MathsError('A number must be provided.');
    this._num = options.num;
    this._text = options.num.toString();
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = this.text;

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.previousSibling?.focus(-1);
      } else if (e.key == 'ArrowRight') {
        if (this._position == this._text.length) this.nextSibling?.focus();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @private
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        if (e.data == '=') {
          let v = new Equals({
            id: Element.uuid(),
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data == '-') {
          let v = new Minus({
            id: Element.uuid(),
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data) {
          if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            !(e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
          ) {
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
      case 'historyUndo':
      case 'historyRedo':
      case 'insertLineBreak':
      case 'insertOrderedList':
      case 'insertUnorderedList':
      case 'insertHorizontalRule':
      case 'insertFromYank':
      case 'insertFromDrop':
      case 'insertFromPasteAsQuotation':
      case 'insertLink':
      case 'deleteSoftLineBackward':
      case 'deleteSoftLineForward':
      case 'deleteEntireSoftLine':
      case 'deleteHardLineBackward':
      case 'deleteHardLineForward':
      case 'deleteByDrag':
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'formatStrikeThrough':
      case 'formatSuperscript':
      case 'formatSubscript':
      case 'formatJustifyFull':
      case 'formatJustifyCenter':
      case 'formatJustifyRight':
      case 'formatJustifyLeft':
      case 'formatIndent':
      case 'formatOutdent':
      case 'formatRemove':
      case 'formatSetBlockTextDirection':
      case 'formatSetInlineTextDirection':
      case 'formatBackColor':
      case 'formatFontColor':
      case 'formatFontName':
        e.preventDefault();
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            var ps = this.previousSibling;
            if (ps) {
              ps.delete();
            }
          } else {
            var ns = this.nextSibling;
            if (ns) {
              ns.delete();
            }
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          this.delete();
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          ) {
            this.nextSibling?.focus();
          } else {
            this.previousSibling?.focus(-1);
          }
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
        // don't need to update the dom
        this._num = parseFloat(this.dom.innerText);
        this._text = this.dom.innerText;
        break;
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      case 'insertText':
        // don't need to update the dom
        this._num = parseFloat(this.dom.innerText);
        this._text = this.dom.innerText;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {string}
   */
  _text;
  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {string}
   */
  get text() {
    return this._text;
  }
  set text(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this._num = parseFloat(s);
    this._text = s;

    this.updateDom();

    this.dispatchEvent(
      new MathsEvent('editNumber', this, {
        content: this.num,
      })
    );
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @type {number}
   */
  _num;
  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {number}
   */
  get num() {
    return this._num;
  }
  set num(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this._num = s;
    this._text = s.toString();

    this.updateDom();

    this.dispatchEvent(
      new MathsEvent('editNumber', this, {
        content: this.num,
      })
    );
  }

  get tex() {
    return this.num.toString();
  }
}

Number.register();

/**
 * @typedef VariableOptions
 * @prop {string} var
 */

/**
 * @typedef VariableSerialised
 * @prop {string} var
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a variable in a LaTeX maths environment.
 */
export class Variable extends Element {
  static type = 'Variable';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & VariableSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      var: this.var,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & VariableOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.var) throw new MathsError('A variable name must be provided.');
    this._var = options.var;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = this.var;

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.previousSibling?.focus(-1);
      } else if (e.key == 'ArrowRight') {
        if (this._position == 1) this.nextSibling?.focus();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @private
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            !(e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
          ) {
            if (this._position == 0 && this.previousSibling instanceof Number) {
              console.log(this.previousSibling);
              this.previousSibling.text += e.data;
              this.previousSibling.focus(-1);
            } else if (
              this._position == 1 &&
              this.nextSibling instanceof Number
            ) {
              this.nextSibling.text = e.data + this.nextSibling.text;
              this.nextSibling.focus(1);
            } else {
              let v = new Number({
                id: Element.uuid(),
                num: parseFloat(e.data),
              });
              if (this._position == 0) this.parent?.insertChildBefore(v, this);
              else this.parent?.insertChildAfter(v, this);
              v.focus(-1);
            }
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
      case 'historyUndo':
      case 'historyRedo':
      case 'insertLineBreak':
      case 'insertOrderedList':
      case 'insertUnorderedList':
      case 'insertHorizontalRule':
      case 'insertFromYank':
      case 'insertFromDrop':
      case 'insertFromPasteAsQuotation':
      case 'insertLink':
      case 'deleteSoftLineBackward':
      case 'deleteSoftLineForward':
      case 'deleteEntireSoftLine':
      case 'deleteHardLineBackward':
      case 'deleteHardLineForward':
      case 'deleteByDrag':
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'formatStrikeThrough':
      case 'formatSuperscript':
      case 'formatSubscript':
      case 'formatJustifyFull':
      case 'formatJustifyCenter':
      case 'formatJustifyRight':
      case 'formatJustifyLeft':
      case 'formatIndent':
      case 'formatOutdent':
      case 'formatRemove':
      case 'formatSetBlockTextDirection':
      case 'formatSetInlineTextDirection':
      case 'formatBackColor':
      case 'formatFontColor':
      case 'formatFontName':
        e.preventDefault();
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            var ps = this.previousSibling;
            if (ps) {
              ps.delete();
            }
          } else {
            var ns = this.nextSibling;
            if (ns) {
              ns.delete();
            }
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          this.delete();
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          ) {
            this.nextSibling?.focus();
          } else {
            this.previousSibling?.focus(-1);
          }
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @type {string}
   */
  _var;
  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @type {string}
   */
  get var() {
    return this._var;
  }
  set var(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this.updateDom();
    if (this.var == '') this.delete();
    else
      this.dispatchEvent(
        new MathsEvent('edit', this, {
          content: s,
        })
      );
  }

  get tex() {
    switch (this.var) {
      case 'α':
        return '\\alpha';
      case 'β':
        return '\\beta';
      case 'γ':
        return '\\gamma';
      case 'δ':
        return '\\delta';
      case 'ε':
        return '\\epsilon';
      case 'ζ':
        return '\\zeta';
      case 'η':
        return '\\eta';
      case 'θ':
        return '\\theta';
      case 'ι':
        return '\\iota';
      case 'κ':
        return '\\kappa';
      case 'λ':
        return '\\lamda';
      case 'μ':
        return '\\mu';
      case 'ν':
        return '\\nu';
      case 'ξ':
        return '\\xi';
      case 'π':
        return '\\pi';
      case 'ρ':
        return '\\rho';
      case 'σ':
        return '\\sigma';
      case 'τ':
        return '\\tau';
      case 'υ':
        return '\\upsilon';
      case 'φ':
        return '\\phi';
      case 'χ':
        return '\\chi';
      case 'ψ':
        return '\\psi';
      case 'ω':
        return '\\omega';
      default:
        return this.var;
    }
  }
}

Variable.register();

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Variable}
 *
 * @description An element representing a vector in a LaTeX maths environment.
 */
export class Vector extends Variable {
  static type = 'Vector';

  updateDom() {
    super.updateDom();
    var style = document.createElement('style');
    style.innerHTML = `
    #${this.id}:before {
      content: '\u2192';
      position: absolute;
      font-size: .65em;
      transform: translate(-2.85em, -0.5em);
    }`;
    this._dom?.appendChild(style);
  }

  get tex() {
    return '\\vec{' + super.tex + '}';
  }
}

Vector.register();

/**
 * @typedef BracketsOptions
 * @prop {boolean?} [square]
 */

/**
 * @typedef BracketsSerialised
 * @prop {boolean?} [square]
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing brackets in a LaTeX maths environment.
 */
export class Brackets extends Element {
  static type = 'Brackets';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & BracketsSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      square: this.square,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & BracketsOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.square = options.square ?? false;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.append(
      document.createTextNode(this.square ? '[' : '('),
      ...this.cdom,
      document.createTextNode(this.square ? ']' : ')')
    );
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return (this.square ? '[' : '(') + this.ctex + (this.square ? ']' : ')');
  }
}

Brackets.register();

/**
 * @typedef FunctionOptions
 * @prop {string} func
 */

/**
 * @typedef FunctionSerialised
 * @prop {string} func
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a function in a LaTeX maths environment.
 */
export class Function extends Element {
  static type = 'Function';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & FunctionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      func: this.func,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & FunctionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.func)
      throw new MathsError('A function name must be provided.');
    this.func = options.func;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.style.marginLeft = '0.2em';
    this._dom.append(
      document.createTextNode(this.func + '['),
      ...this.cdom,
      document.createTextNode(']')
    );
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return '\\' + this.func + '[' + this.ctex + ']';
  }
}

Function.register();

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a comma in a LaTeX maths environment.
 */
export class Comma extends Element {
  static type = 'Comma';

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = ', ';
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return ', ';
  }
}

Comma.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a c-dot in a LaTeX maths environment.
 */
export class CDot extends Element {
  static type = 'CDot';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = ' ● ';
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return '\\cdot';
  }
}

CDot.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a equals in a LaTeX maths environment.
 */
export class Equals extends Element {
  static type = 'Equals';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '=';
    // can't use spaces due to text editing
    this._dom.style.marginInline = '0.25em';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.previousSibling?.focus(-1);
      } else if (e.key == 'ArrowRight') {
        if (this._position == 1) this.nextSibling?.focus();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @private
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            !(e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
          ) {
            if (this._position == 0 && this.previousSibling instanceof Number) {
              console.log(this.previousSibling);
              this.previousSibling.text += e.data;
              this.previousSibling.focus(-1);
            } else if (
              this._position == 1 &&
              this.nextSibling instanceof Number
            ) {
              this.nextSibling.text = e.data + this.nextSibling.text;
              this.nextSibling.focus(1);
            } else {
              let v = new Number({
                id: Element.uuid(),
                num: parseFloat(e.data),
              });
              if (this._position == 0) this.parent?.insertChildBefore(v, this);
              else this.parent?.insertChildAfter(v, this);
              v.focus(-1);
            }
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
      case 'historyUndo':
      case 'historyRedo':
      case 'insertLineBreak':
      case 'insertOrderedList':
      case 'insertUnorderedList':
      case 'insertHorizontalRule':
      case 'insertFromYank':
      case 'insertFromDrop':
      case 'insertFromPasteAsQuotation':
      case 'insertLink':
      case 'deleteSoftLineBackward':
      case 'deleteSoftLineForward':
      case 'deleteEntireSoftLine':
      case 'deleteHardLineBackward':
      case 'deleteHardLineForward':
      case 'deleteByDrag':
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'formatStrikeThrough':
      case 'formatSuperscript':
      case 'formatSubscript':
      case 'formatJustifyFull':
      case 'formatJustifyCenter':
      case 'formatJustifyRight':
      case 'formatJustifyLeft':
      case 'formatIndent':
      case 'formatOutdent':
      case 'formatRemove':
      case 'formatSetBlockTextDirection':
      case 'formatSetInlineTextDirection':
      case 'formatBackColor':
      case 'formatFontColor':
      case 'formatFontName':
        e.preventDefault();
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            var ps = this.previousSibling;
            if (ps) {
              ps.delete();
            }
          } else {
            var ns = this.nextSibling;
            if (ns) {
              ns.delete();
            }
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          this.delete();
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          ) {
            this.nextSibling?.focus();
          } else {
            this.previousSibling?.focus(-1);
          }
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  get tex() {
    return ' &= ';
  }
}

Equals.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Equals}
 *
 * @description An element representing a approx equals in a LaTeX maths environment.
 */
export class Approx extends Equals {
  static type = 'Approx';

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '≈';
    // can't use spaces due to text editing
    this._dom.style.marginInline = '0.25em';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return ' \\approx ';
  }
}

Approx.register();

/**
 * @author Joseph Abbey
 * @date 07/05/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a minus in a LaTeX maths environment.
 */
export class Minus extends Element {
  static type = 'Minus';

  /**
   * @author Joseph Abbey
   * @date 07/05/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '-';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.previousSibling?.focus(-1);
      } else if (e.key == 'ArrowRight') {
        if (this._position == 1) this.nextSibling?.focus();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @private
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            !(e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
          ) {
            if (this._position == 0 && this.previousSibling instanceof Number) {
              console.log(this.previousSibling);
              this.previousSibling.text += e.data;
              this.previousSibling.focus(-1);
            } else if (
              this._position == 1 &&
              this.nextSibling instanceof Number
            ) {
              this.nextSibling.text = e.data + this.nextSibling.text;
              this.nextSibling.focus(1);
            } else {
              let v = new Number({
                id: Element.uuid(),
                num: parseFloat(e.data),
              });
              if (this._position == 0) this.parent?.insertChildBefore(v, this);
              else this.parent?.insertChildAfter(v, this);
              v.focus(-1);
            }
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
      case 'historyUndo':
      case 'historyRedo':
      case 'insertLineBreak':
      case 'insertOrderedList':
      case 'insertUnorderedList':
      case 'insertHorizontalRule':
      case 'insertFromYank':
      case 'insertFromDrop':
      case 'insertFromPasteAsQuotation':
      case 'insertLink':
      case 'deleteSoftLineBackward':
      case 'deleteSoftLineForward':
      case 'deleteEntireSoftLine':
      case 'deleteHardLineBackward':
      case 'deleteHardLineForward':
      case 'deleteByDrag':
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'formatStrikeThrough':
      case 'formatSuperscript':
      case 'formatSubscript':
      case 'formatJustifyFull':
      case 'formatJustifyCenter':
      case 'formatJustifyRight':
      case 'formatJustifyLeft':
      case 'formatIndent':
      case 'formatOutdent':
      case 'formatRemove':
      case 'formatSetBlockTextDirection':
      case 'formatSetInlineTextDirection':
      case 'formatBackColor':
      case 'formatFontColor':
      case 'formatFontName':
        e.preventDefault();
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            var ps = this.previousSibling;
            if (ps) {
              ps.delete();
            }
          } else {
            var ns = this.nextSibling;
            if (ns) {
              ns.delete();
            }
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          this.delete();
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          ) {
            this.nextSibling?.focus();
          } else {
            this.previousSibling?.focus(-1);
          }
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  get tex() {
    return ' - ';
  }
}

Minus.register();

/**
 * @typedef FractionOptions
 * @prop {Element[]} numerator
 * @prop {Element[]} denominator
 */

/**
 * @typedef FractionSerialised
 * @prop {ElementSerialised[]} numerator
 * @prop {ElementSerialised[]} denominator
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a fraction in a LaTeX maths environment.
 */
export class Fraction extends Element {
  static type = 'Fraction';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & FractionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      numerator: this.numerator.map((child) => child.serialised),
      denominator: this.denominator.map((child) => child.serialised),
    };
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {ElementSerialised & FractionSerialised} s
   * @returns {Fraction}
   *
   * @description This deserialises an element.
   *
   * @see {@link Fraction~serialised}
   */
  static deserialise(s) {
    // @ts-expect-error
    return super.deserialise({
      ...s,
      numerator: Element.deserialiseMany(s.numerator),
      denominator: Element.deserialiseMany(s.denominator),
    });
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & FractionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.numerator = options.numerator ?? [];
    this.denominator = options.denominator ?? [];
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {Element[]}
   *
   * @description The numerator of the fraction.
   */
  numerator;
  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @type {HTMLElement[]}
   *
   * @description Gets or creates the HTMLElements linked with this instance's numerator.
   */
  get ndom() {
    return this.numerator.map((c) => c.dom);
  }
  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {String}
   *
   * @description The LaTeX code that generates this instance's numerator.
   */
  get ntex() {
    return this.numerator.map((c) => c.tex).join('');
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {Element[]}
   *
   * @description The denominator of the fraction.
   */
  denominator;
  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @type {HTMLElement[]}
   *
   * @description Gets or creates the HTMLElements linked with this instance's denominator.
   */
  get ddom() {
    return this.denominator.map((c) => c.dom);
  }
  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {String}
   *
   * @description The LaTeX code that generates this instance's denominator.
   */
  get dtex() {
    return this.denominator.map((c) => c.tex).join('');
  }

  update() {
    super.update();
    this.updateNDom();
    this.updateDDom();
  }

  /**
   * @author Joseph Abbey
   * @date 14/02/2023
   * @type {HTMLDivElement}
   * @see {@link NDom} instead.
   *
   * @description Internal dom cache, use `this.NDom` instead.
   */
  _NDom;
  /**
   * @protected
   */
  updateNDom() {
    if (!this._NDom)
      throw new ElementError(
        'Please create a DOM node before you call `updateNDom`.'
      );
    this._NDom.append(...this.ndom);
  }
  /**
   * @author Joseph Abbey
   * @date 14/02/2023
   * @type {HTMLDivElement}
   *
   * @description Gets or creates the HTMLDivElement linked with this instance's N.
   */
  get NDom() {
    if (!this._NDom) {
      this._NDom = document.createElement('div');
      this.updateNDom();
    }
    return this._NDom;
  }

  /**
   * @author Joseph Abbey
   * @date 14/02/2023
   * @type {HTMLDivElement}
   * @see {@link DDom} instead.
   *
   * @description Internal dom cache, use `this.DDom` instead.
   */
  _DDom;
  /**
   * @protected
   */
  updateDDom() {
    if (!this._DDom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDDom`.'
      );
    this._DDom.append(...this.ddom);
  }
  /**
   * @author Joseph Abbey
   * @date 14/02/2023
   * @type {HTMLDivElement}
   *
   * @description Gets or creates the HTMLDivElement linked with this instance's N.
   */
  get DDom() {
    if (!this._DDom) {
      this._DDom = document.createElement('div');
      this.updateDDom();
    }
    return this._DDom;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.style.display = 'inline-block';
    var hr = document.createElement('hr');
    hr.style.margin = 'auto';
    hr.style.marginInline = '4px';
    hr.style.border = '1px solid #5e5e5e';
    hr.style.paddingInline = '6px';
    hr.style.paddingBlock = '0';
    this._dom.append(this.NDom, hr, this.DDom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return `\\frac{${this.ntex}}${this.dtex}}`;
  }
}

Fraction.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX power.
 */
export class Power extends Element {
  static type = 'Power';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  createDom() {
    this._dom = document.createElement('sup');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return `^{${this.ctex}}`;
  }
}

Power.register();
