/**
 * @module MakeTitle
 */

import { ArticleEvent } from './Article.js';
import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class MakeTitleError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 13/02/2023
 * @constructor
 * @extends {ElementEvent<MakeTitle,"editTitle">}
 *
 * @description Used to trigger maketitle element specific events.
 */
export class MakeTitleEvent extends ElementEvent {}

/**
 * @author Joseph Abbey
 * @date 13/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX MakeTitle.
 */
export default class MakeTitle extends Element {
  static type = 'MakeTitle';

  /**
   * @author Joseph Abbey
   * @date 13/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  /**
   * @inheritdoc
   */
  get article() {
    return super.article;
  }
  set article(a) {
    const index =
      this.article?.maketitles.findIndex((e) => e.id == this.id) ?? -1;
    if (index > -1) this.article?.maketitles.splice(index, 1);
    super.article = a;
    this.article?.maketitles?.push(this);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.innerText = this.article?.title ?? 'Unknown';
    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
      this._dom.spellcheck = this.article?.spellcheck ?? false;
      this._dom.autocapitalize = 'words';
    } else {
      this._dom.contentEditable = 'false';
      this._dom.spellcheck = false;
      this._dom.autocapitalize = 'off';
    }
  }
  createDom() {
    this._dom = document.createElement('h1');
    this.updateDom();
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    switch (e.inputType) {
      case 'insertParagraph':
        this.dom.innerText = this.dom.innerText.replace('\n', '');
        break;
      case 'historyUndo':
      case 'historyRedo':
      case 'deleteContentBackward':
      case 'deleteContentForward':
      case 'insertText':
        if (this.article) {
          this.article.title = this.dom.innerText;
          this.dispatchEvent(
            new MakeTitleEvent('editTitle', this, {
              content: this.dom.innerText,
            })
          );
        } else {
          this.dom.innerText = 'Unknown';
        }
        break;
      default:
        console.log(e);
        break;
    }
  }

  get tex() {
    return `\n\\maketitle\n`;
  }
}

MakeTitle.register();
