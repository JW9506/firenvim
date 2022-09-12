/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/editor-adapter/index.js":
/*!**********************************************!*\
  !*** ./node_modules/editor-adapter/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GenericAbstractEditor": () => (/* binding */ GenericAbstractEditor),
/* harmony export */   "AceEditor": () => (/* binding */ AceEditor),
/* harmony export */   "CodeMirrorEditor": () => (/* binding */ CodeMirrorEditor),
/* harmony export */   "MonacoEditor": () => (/* binding */ MonacoEditor),
/* harmony export */   "TextareaEditor": () => (/* binding */ TextareaEditor),
/* harmony export */   "computeSelector": () => (/* binding */ computeSelector),
/* harmony export */   "executeInPage": () => (/* binding */ executeInPage),
/* harmony export */   "unwrap": () => (/* binding */ unwrap),
/* harmony export */   "wrap": () => (/* binding */ wrap),
/* harmony export */   "getEditor": () => (/* binding */ getEditor)
/* harmony export */ });
class GenericAbstractEditor {
    constructor(_e, _options) { }
    ;
    static matches(_) {
        throw new Error("Matches function not overriden");
    }
    ;
}
/* istanbul ignore next */
class AceEditor extends GenericAbstractEditor {
    constructor(e, _options) {
        super(e, _options);
        // This function will be stringified and inserted in page context so we
        // can't instrument it.
        /* istanbul ignore next */
        this.getAce = (selec) => {
        };
        this.getContent = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            const ace = elem.aceEditor || unwrap(window).ace.edit(elem);
            return wrap(ace.getValue());
        };
        this.getCursor = async (selector, wrap, unwrap) => {
            let position;
            const elem = document.querySelector(selector);
            const ace = elem.aceEditor || unwrap(window).ace.edit(elem);
            if (ace.getCursorPosition !== undefined) {
                position = ace.getCursorPosition();
            }
            else {
                position = ace.selection.cursor;
            }
            return [wrap(position.row) + 1, wrap(position.column)];
        };
        this.getElement = () => {
            return this.elem;
        };
        this.getLanguage = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            const ace = elem.aceEditor || unwrap(window).ace.edit(elem);
            return wrap(ace.session.$modeId).split("/").slice(-1)[0];
        };
        this.setContent = async (selector, wrap, unwrap, text) => {
            const elem = document.querySelector(selector);
            const ace = elem.aceEditor || unwrap(window).ace.edit(elem);
            return wrap(ace.setValue(text, 1));
        };
        this.setCursor = async (selector, wrap, unwrap, line, column) => {
            const elem = document.querySelector(selector);
            const ace = elem.aceEditor || unwrap(window).ace.edit(elem);
            const selection = ace.getSelection();
            return wrap(selection.moveCursorTo(line - 1, column, false));
        };
        this.elem = e;
        // Get the topmost ace element
        let parent = this.elem.parentElement;
        while (AceEditor.matches(parent)) {
            this.elem = parent;
            parent = parent.parentElement;
        }
    }
    static matches(e) {
        let parent = e;
        for (let i = 0; i < 3; ++i) {
            if (parent !== undefined && parent !== null) {
                if ((/ace_editor/gi).test(parent.className)) {
                    return true;
                }
                parent = parent.parentElement;
            }
        }
        return false;
    }
}
/* istanbul ignore next */
class CodeMirrorEditor extends GenericAbstractEditor {
    constructor(e, options) {
        super(e, options);
        this.getContent = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            return wrap(unwrap(elem).CodeMirror.getValue());
        };
        this.getCursor = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            const position = unwrap(elem).CodeMirror.getCursor();
            return [wrap(position.line) + 1, wrap(position.ch)];
        };
        this.getElement = () => {
            return this.elem;
        };
        this.getLanguage = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            return wrap(unwrap(elem).CodeMirror.getMode().name);
        };
        this.setContent = async (selector, wrap, unwrap, text) => {
            const elem = document.querySelector(selector);
            return wrap(unwrap(elem).CodeMirror.setValue(text));
        };
        this.setCursor = async (selector, wrap, unwrap, line, column) => {
            const elem = document.querySelector(selector);
            return wrap(unwrap(elem).CodeMirror.setCursor({ line: line - 1, ch: column }));
        };
        this.elem = e;
        // Get the topmost CodeMirror element
        let parent = this.elem.parentElement;
        while (CodeMirrorEditor.matches(parent)) {
            this.elem = parent;
            parent = parent.parentElement;
        }
    }
    static matches(e) {
        let parent = e;
        for (let i = 0; i < 3; ++i) {
            if (parent !== undefined && parent !== null) {
                if ((/^(.* )?CodeMirror/gi).test(parent.className)) {
                    return true;
                }
                parent = parent.parentElement;
            }
        }
        return false;
    }
}
/* istanbul ignore next */
class MonacoEditor extends GenericAbstractEditor {
    constructor(e, options) {
        super(e, options);
        this.getContent = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            const uri = elem.getAttribute("data-uri");
            const model = unwrap(window).monaco.editor.getModel(uri);
            return wrap(model.getValue());
        };
        // It's impossible to get Monaco's cursor position:
        // https://github.com/Microsoft/monaco-editor/issues/258
        this.getCursor = async (selector, wrap, unwrap) => {
            return [1, 0];
        };
        this.getElement = () => {
            return this.elem;
        };
        this.getLanguage = async (selector, wrap, unwrap) => {
            const elem = document.querySelector(selector);
            const uri = elem.getAttribute("data-uri");
            const model = unwrap(window).monaco.editor.getModel(uri);
            return wrap(model.getModeId());
        };
        this.setContent = async (selector, wrap, unwrap, text) => {
            const elem = document.querySelector(selector);
            const uri = elem.getAttribute("data-uri");
            const model = unwrap(window).monaco.editor.getModel(uri);
            return wrap(model.setValue(text));
        };
        // It's impossible to set Monaco's cursor position:
        // https://github.com/Microsoft/monaco-editor/issues/258
        this.setCursor = async (_selector, _wrap, _unwrap, _line, _column) => {
            return undefined;
        };
        this.elem = e;
        // Find the monaco element that holds the data
        let parent = this.elem.parentElement;
        while (!(this.elem.className.match(/monaco-editor/gi)
            && this.elem.getAttribute("data-uri").match("file://|inmemory://|gitlab:"))) {
            this.elem = parent;
            parent = parent.parentElement;
        }
    }
    static matches(e) {
        let parent = e;
        for (let i = 0; i < 4; ++i) {
            if (parent !== undefined && parent !== null) {
                if ((/monaco-editor/gi).test(parent.className)) {
                    return true;
                }
                parent = parent.parentElement;
            }
        }
        return false;
    }
}
// TextareaEditor sort of works for contentEditable elements but there should
// really be a contenteditable-specific editor.
/* istanbul ignore next */
class TextareaEditor {
    constructor(e, options) {
        this.getContent = async () => {
            if (this.elem.value !== undefined) {
                return Promise.resolve(this.elem.value);
            }
            if (this.options.preferHTML) {
                return Promise.resolve(this.elem.innerHTML);
            }
            else {
                return Promise.resolve(this.elem.innerText);
            }
        };
        this.getCursor = async () => {
            return this.getContent().then(text => {
                let line = 1;
                let column = 0;
                const selectionStart = this.elem.selectionStart !== undefined
                    ? this.elem.selectionStart
                    : 0;
                // Sift through the text, counting columns and new lines
                for (let cursor = 0; cursor < selectionStart; ++cursor) {
                    column += text.charCodeAt(cursor) < 0x7F ? 1 : 2;
                    if (text[cursor] === "\n") {
                        line += 1;
                        column = 0;
                    }
                }
                return [line, column];
            });
        };
        this.getElement = () => {
            return this.elem;
        };
        this.getLanguage = async () => {
            if (this.options.preferHTML) {
                return Promise.resolve('html');
            }
            return Promise.resolve(undefined);
        };
        this.setContent = async (text) => {
            if (this.elem.value !== undefined) {
                this.elem.value = text;
            }
            else {
                if (this.options.preferHTML) {
                    this.elem.innerHTML = text;
                }
                else {
                    this.elem.innerText = text;
                }
            }
            return Promise.resolve();
        };
        this.setCursor = async (line, column) => {
            return this.getContent().then(text => {
                let character = 0;
                // Try to find the line the cursor should be put on
                while (line > 1 && character < text.length) {
                    if (text[character] === "\n") {
                        line -= 1;
                    }
                    character += 1;
                }
                // Try to find the character after which the cursor should be moved
                // Note: we don't do column = columnn + character because column
                // might be larger than actual line length and it's better to be on
                // the right line but on the wrong column than on the wrong line
                // and wrong column.
                // Moreover, column is a number of UTF-8 bytes from the beginning
                // of the line to the cursor. However, javascript uses UTF-16,
                // which is 2 bytes per non-ascii character. So when we find a
                // character that is more than 1 byte long, we have to remove that
                // amount from column, but only two characters from CHARACTER!
                while (column > 0 && character < text.length) {
                    // Can't happen, but better be safe than sorry
                    /* istanbul ignore next */
                    if (text[character] === "\n") {
                        break;
                    }
                    const code = text.charCodeAt(character);
                    if (code <= 0x7f) {
                        column -= 1;
                    }
                    else if (code <= 0x7ff) {
                        column -= 2;
                    }
                    else if (code >= 0xd800 && code <= 0xdfff) {
                        column -= 4;
                        character++;
                    }
                    else if (code < 0xffff) {
                        column -= 3;
                    }
                    else {
                        column -= 4;
                    }
                    character += 1;
                }
                if (this.elem.setSelectionRange !== undefined) {
                    this.elem.setSelectionRange(character, character);
                }
                return undefined;
            });
        };
        this.options = options;
        this.elem = e;
    }
    static matches(_) {
        return true;
    }
}
// Computes a unique selector for its argument.
function computeSelector(element) {
    function uniqueSelector(e) {
        // Only matching alphanumeric selectors because others chars might have special meaning in CSS
        if (e.id && e.id.match("^[a-zA-Z0-9_-]+$")) {
            const id = e.tagName + `[id="${e.id}"]`;
            if (document.querySelectorAll(id).length === 1) {
                return id;
            }
        }
        // If we reached the top of the document
        if (!e.parentElement) {
            return "HTML";
        }
        // Compute the position of the element
        const index = Array.from(e.parentElement.children)
            .filter(child => child.tagName === e.tagName)
            .indexOf(e) + 1;
        return `${uniqueSelector(e.parentElement)} > ${e.tagName}:nth-of-type(${index})`;
    }
    return uniqueSelector(element);
}
// Runs CODE in the page's context by setting up a custom event listener,
// embedding a script element that runs the piece of code and emits its result
// as an event.
/* istanbul ignore next */
function executeInPage(code) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const eventId = `${Math.random()}`;
        script.innerHTML = `(async (evId) => {
            try {
                let unwrap = x => x;
                let wrap = x => x;
                let result;
                result = await ${code};
                window.dispatchEvent(new CustomEvent(evId, {
                    detail: {
                        success: true,
                        result,
                    }
                }));
            } catch (e) {
                window.dispatchEvent(new CustomEvent(evId, {
                    detail: { success: false, reason: e },
                }));
            }
        })(${JSON.stringify(eventId)})`;
        window.addEventListener(eventId, ({ detail }) => {
            script.parentNode.removeChild(script);
            if (detail.success) {
                return resolve(detail.result);
            }
            return reject(detail.reason);
        }, { once: true });
        document.head.appendChild(script);
    });
}
function unwrap(x) {
    if (window.wrappedJSObject) {
        return x.wrappedJSObject;
    }
    return x;
}
function wrap(x) {
    if (window.XPCNativeWrapper) {
        return window.XPCNativeWrapper(x);
    }
    return x;
}
;
function getEditor(elem, options) {
    let editor;
    for (let clazz of [AceEditor, CodeMirrorEditor, MonacoEditor]) {
        if (clazz.matches(elem)) {
            editor = clazz;
            break;
        }
    }
    if (editor === undefined) {
        return new TextareaEditor(elem, options);
    }
    let ed = new editor(elem, options);
    let result;
    if (window.wrappedJSObject) {
        result = new Proxy(ed, {
            get: (target, prop) => (...args) => {
                return target[prop](computeSelector(target.getElement()), wrap, unwrap, ...args);
            }
        });
    }
    else {
        result = new Proxy(ed, {
            get: (target, prop) => {
                if (prop === "getElement") {
                    return target[prop];
                }
                return (...args) => {
                    /* istanbul ignore next */
                    return executeInPage(`(${target[prop]})(${JSON.stringify(computeSelector(target.getElement()))}, x => x, x => x, ...${JSON.stringify(args)})`);
                };
            }
        });
    }
    return result;
}


/***/ }),

/***/ "./src/EventEmitter.ts":
/*!*****************************!*\
  !*** ./src/EventEmitter.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    on(event, handler) {
        let handlers = this.listeners.get(event);
        if (handlers === undefined) {
            handlers = [];
            this.listeners.set(event, handlers);
        }
        handlers.push(handler);
    }
    emit(event, ...data) {
        const handlers = this.listeners.get(event);
        if (handlers !== undefined) {
            const errors = [];
            handlers.forEach((handler) => {
                try {
                    handler(...data);
                }
                catch (e) {
                    /* istanbul ignore next */
                    errors.push(e);
                }
            });
            /* Error conditions here are impossible to test for from selenium
             * because it would arise from the wrong use of the API, which we
             * can't ship in the extension, so don't try to instrument. */
            /* istanbul ignore next */
            if (errors.length > 0) {
                throw new Error(JSON.stringify(errors));
            }
        }
    }
}


/***/ }),

/***/ "./src/FirenvimElement.ts":
/*!********************************!*\
  !*** ./src/FirenvimElement.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FirenvimElement": () => (/* binding */ FirenvimElement)
/* harmony export */ });
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var editor_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! editor-adapter */ "./node_modules/editor-adapter/index.js");



class FirenvimElement {
    // elem is the element that received the focusEvent.
    // Nvimify is the function that listens for focus events. We need to know
    // about it in order to remove it before focusing elem (otherwise we'll
    // just grab focus again).
    constructor(elem, listener, onDetach) {
        // focusInfo is used to keep track of focus listeners and timeouts created
        // by FirenvimElement.focus(). FirenvimElement.focus() creates these
        // listeners and timeouts in order to work around pages that try to grab
        // the focus again after the FirenvimElement has been created or after the
        // underlying element's content has changed.
        this.focusInfo = {
            finalRefocusTimeouts: [],
            refocusRefs: [],
            refocusTimeouts: [],
        };
        // resizeReqId keeps track of the number of resizing requests that are sent
        // to the iframe. We send and increment it for every resize requests, this
        // lets the iframe know what the most recently sent resize request is and
        // thus avoids reacting to an older resize request if a more recent has
        // already been processed.
        this.resizeReqId = 0;
        // relativeX/Y is the position the iframe should have relative to the input
        // element in order to be both as close as possible to the input element
        // and fit in the window without overflowing out of the viewport.
        this.relativeX = 0;
        this.relativeY = 0;
        // firstPutEditorCloseToInputOrigin keeps track of whether this is the
        // first time the putEditorCloseToInputOrigin function is called from the
        // iframe. See putEditorCloseToInputOriginAfterResizeFromFrame() for more
        // information.
        this.firstPutEditorCloseToInputOrigin = true;
        // bufferInfo: a [url, selector, cursor, lang] tuple indicating the page
        // the last iframe was created on, the selector of the corresponding
        // textarea and the column/line number of the cursor.
        // Note that these are __default__ values. Real values must be created with
        // prepareBufferInfo(). The reason we're not doing this from the
        // constructor is that it's expensive and disruptive - getting this
        // information requires evaluating code in the page's context.
        this.bufferInfo = Promise.resolve(["", "", [1, 1], undefined]);
        // cursor: last known cursor position. Updated on getPageElementCursor and
        // setPageElementCursor
        this.cursor = [1, 1];
        this.originalElement = elem;
        this.nvimify = listener;
        this.onDetach = onDetach;
        this.editor = (0,editor_adapter__WEBPACK_IMPORTED_MODULE_2__.getEditor)(elem, {
            preferHTML: (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.getConf)().content == "html"
        });
        this.span = elem
            .ownerDocument
            .createElementNS("http://www.w3.org/1999/xhtml", "span");
        this.iframe = elem
            .ownerDocument
            .createElementNS("http://www.w3.org/1999/xhtml", "iframe");
        // Make sure there isn't any extra width/height
        this.iframe.style.padding = "0px";
        this.iframe.style.margin = "0px";
        this.iframe.style.border = "0px";
        // We still need a border, use a shadow for that
        this.iframe.style.boxShadow = "0px 0px 1px 1px black";
    }
    attachToPage(fip) {
        this.frameIdPromise = fip.then((f) => {
            this.frameId = f;
            // Once a frameId has been acquired, the FirenvimElement would die
            // if its span was removed from the page. Thus there is no use in
            // keeping its spanObserver around. It'd even cause issues as the
            // spanObserver would attempt to re-insert a dead frame in the
            // page.
            this.spanObserver.disconnect();
            return this.frameId;
        });
        // We don't need the iframe to be appended to the page in order to
        // resize it because we're just using the corresponding
        // input/textarea's size
        let rect = this.getElement().getBoundingClientRect();
        this.resizeTo(rect.width, rect.height, false);
        this.relativeX = 0;
        this.relativeY = 0;
        this.putEditorCloseToInputOrigin();
        // Use a ResizeObserver to detect when the underlying input element's
        // size changes and change the size of the FirenvimElement
        // accordingly
        this.resizeObserver = new (window.ResizeObserver)(((self) => async (entries) => {
            const entry = entries.find((ent) => ent.target === self.getElement());
            if (self.frameId === undefined) {
                await this.frameIdPromise;
            }
            if (entry) {
                const newRect = this.getElement().getBoundingClientRect();
                if (rect.width === newRect.width && rect.height === newRect.height) {
                    return;
                }
                rect = newRect;
                self.resizeTo(rect.width, rect.height, false);
                self.putEditorCloseToInputOrigin();
                self.resizeReqId += 1;
                browser.runtime.sendMessage({
                    args: {
                        frameId: self.frameId,
                        message: {
                            args: [self.resizeReqId, rect.width, rect.height],
                            funcName: ["resize"],
                        }
                    },
                    funcName: ["messageFrame"],
                });
            }
        })(this));
        this.resizeObserver.observe(this.getElement(), { box: "border-box" });
        this.iframe.src = browser.extension.getURL("/index.html");
        this.span.attachShadow({ mode: "closed" }).appendChild(this.iframe);
        // So pages (e.g. Jira, Confluence) remove spans from the page as soon
        // as they're inserted. We don't want that, so for the 5 seconds
        // following the insertion, detect if the span is removed from the page
        // by checking visibility changes and re-insert if needed.
        let reinserts = 0;
        this.spanObserver = new MutationObserver((self => (mutations, observer) => {
            const span = self.getSpan();
            for (const mutation of mutations) {
                for (const node of mutation.removedNodes) {
                    if (node === span) {
                        reinserts += 1;
                        if (reinserts >= 10) {
                            console.error("Firenvim is trying to create an iframe on this site but the page is constantly removing it. Consider disabling Firenvim on this website.");
                            observer.disconnect();
                        }
                        else {
                            setTimeout(() => self.getElement().ownerDocument.body.appendChild(span), reinserts * 100);
                        }
                        return;
                    }
                }
            }
        })(this));
        this.spanObserver.observe(this.getElement().ownerDocument.body, { childList: true });
        let parentElement = this.getElement().ownerDocument.body;
        // We can't insert the frame in the body if the element we're going to
        // replace the content of is the body, as replacing the content would
        // destroy the frame.
        if (parentElement === this.getElement()) {
            parentElement = parentElement.parentElement;
        }
        parentElement.appendChild(this.span);
        this.focus();
        // It is pretty hard to tell when an element disappears from the page
        // (either by being removed or by being hidden by other elements), so
        // we use an intersection observer, which is triggered every time the
        // element becomes more or less visible.
        this.intersectionObserver = new IntersectionObserver((self => () => {
            const elem = self.getElement();
            // If elem doesn't have a rect anymore, it's hidden
            if (elem.getClientRects().length === 0) {
                self.hide();
            }
            else {
                self.show();
            }
        })(this), { root: null, threshold: 0.1 });
        this.intersectionObserver.observe(this.getElement());
        // We want to remove the FirenvimElement from the page when the
        // corresponding element is removed. We do this by adding a
        // mutationObserver to its parent.
        this.pageObserver = new MutationObserver((self => (mutations) => {
            const elem = self.getElement();
            mutations.forEach(mutation => mutation.removedNodes.forEach(node => {
                const walker = document.createTreeWalker(node, NodeFilter.SHOW_ALL);
                while (walker.nextNode()) {
                    if (walker.currentNode === elem) {
                        setTimeout(() => self.detachFromPage());
                    }
                }
            }));
        })(this));
        this.pageObserver.observe(document.documentElement, {
            subtree: true,
            childList: true
        });
    }
    clearFocusListeners() {
        // When the user tries to `:w | call firenvim#focus_page()` in Neovim,
        // we have a problem. `:w` results in a call to setPageElementContent,
        // which calls FirenvimElement.focus(), because some pages try to grab
        // focus when the content of the underlying element changes.
        // FirenvimElement.focus() creates event listeners and timeouts to
        // detect when the page tries to grab focus and bring it back to the
        // FirenvimElement. But since `call firenvim#focus_page()` happens
        // right after the `:w`, focus_page() triggers the event
        // listeners/timeouts created by FirenvimElement.focus()!
        // So we need a way to clear the timeouts and event listeners before
        // performing focus_page, and that's what this function does.
        this.focusInfo.finalRefocusTimeouts.forEach(t => clearTimeout(t));
        this.focusInfo.refocusTimeouts.forEach(t => clearTimeout(t));
        this.focusInfo.refocusRefs.forEach(f => {
            this.iframe.removeEventListener("blur", f);
            this.getElement().removeEventListener("focus", f);
        });
        this.focusInfo.finalRefocusTimeouts.length = 0;
        this.focusInfo.refocusTimeouts.length = 0;
        this.focusInfo.refocusRefs.length = 0;
    }
    detachFromPage() {
        this.clearFocusListeners();
        const elem = this.getElement();
        this.resizeObserver.unobserve(elem);
        this.intersectionObserver.unobserve(elem);
        this.pageObserver.disconnect();
        this.spanObserver.disconnect();
        this.span.remove();
        this.onDetach(this.frameId);
    }
    focus() {
        // Some inputs try to grab the focus again after we appended the iframe
        // to the page, so we need to refocus it each time it loses focus. But
        // the user might want to stop focusing the iframe at some point, so we
        // actually stop refocusing the iframe a second after it is created.
        const refocus = ((self) => () => {
            self.focusInfo.refocusTimeouts.push(setTimeout(() => {
                // First, destroy current selection. Some websites use the
                // selection to force-focus an element.
                const sel = document.getSelection();
                sel.removeAllRanges();
                const range = document.createRange();
                // There's a race condition in the testsuite on chrome that
                // results in self.span not being in the document and errors
                // being logged, so we check if self.span really is in its
                // ownerDocument.
                if (self.span.ownerDocument.contains(self.span)) {
                    range.setStart(self.span, 0);
                }
                range.collapse(true);
                sel.addRange(range);
                self.iframe.focus();
            }, 0));
        })(this);
        this.focusInfo.refocusRefs.push(refocus);
        this.iframe.addEventListener("blur", refocus);
        this.getElement().addEventListener("focus", refocus);
        this.focusInfo.finalRefocusTimeouts.push(setTimeout(() => {
            refocus();
            this.iframe.removeEventListener("blur", refocus);
            this.getElement().removeEventListener("focus", refocus);
        }, 100));
        refocus();
    }
    focusOriginalElement(addListener) {
        document.activeElement.blur();
        this.originalElement.removeEventListener("focus", this.nvimify);
        const sel = document.getSelection();
        sel.removeAllRanges();
        const range = document.createRange();
        if (this.originalElement.ownerDocument.contains(this.originalElement)) {
            range.setStart(this.originalElement, 0);
        }
        range.collapse(true);
        this.originalElement.focus();
        sel.addRange(range);
        if (addListener) {
            this.originalElement.addEventListener("focus", this.nvimify);
        }
    }
    getBufferInfo() {
        return this.bufferInfo;
    }
    getEditor() {
        return this.editor;
    }
    getElement() {
        return this.editor.getElement();
    }
    getPageElementContent() {
        return this.getEditor().getContent();
    }
    getPageElementCursor() {
        const p = this.editor.getCursor().catch(() => [1, 1]);
        p.then(c => this.cursor = c);
        return p;
    }
    getSelector() {
        return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.computeSelector)(this.getElement());
    }
    getSpan() {
        return this.span;
    }
    hide() {
        this.iframe.style.display = "none";
    }
    isFocused() {
        return document.activeElement === this.span
            || document.activeElement === this.iframe;
    }
    prepareBufferInfo() {
        this.bufferInfo = (async () => [
            document.location.href,
            this.getSelector(),
            await this.getPageElementCursor(),
            await (this.editor.getLanguage().catch(() => undefined))
        ])();
    }
    pressKeys(keys) {
        const focused = this.isFocused();
        keys.forEach(ev => this.originalElement.dispatchEvent(ev));
        if (focused) {
            this.focus();
        }
    }
    putEditorCloseToInputOrigin() {
        const rect = this.editor.getElement().getBoundingClientRect();
        // Save attributes
        const posAttrs = ["left", "position", "top", "zIndex"];
        const oldPosAttrs = posAttrs.map((attr) => this.iframe.style[attr]);
        // Assign new values
        this.iframe.style.left = `${rect.left + window.scrollX + this.relativeX}px`;
        this.iframe.style.position = "absolute";
        this.iframe.style.top = `${rect.top + window.scrollY + this.relativeY}px`;
        // 2139999995 is hopefully higher than everything else on the page but
        // lower than Vimium's elements
        // this.iframe.style.zIndex = "2139999995";
        // Compare, to know whether the element moved or not
        const posChanged = !!posAttrs.find((attr, index) => this.iframe.style[attr] !== oldPosAttrs[index]);
        return { posChanged, newRect: rect };
    }
    putEditorCloseToInputOriginAfterResizeFromFrame() {
        // This is a very weird, complicated and bad piece of code. All calls
        // to `resizeEditor()` have to result in a call to `resizeTo()` and
        // then `putEditorCloseToInputOrigin()` in order to make sure the
        // iframe doesn't overflow from the viewport.
        // However, when we create the iframe, we don't want it to fit in the
        // viewport at all cost. Instead, we want it to cover the underlying
        // input as much as possible. The problem is that when it is created,
        // the iframe will ask for a resize (because Neovim asks for one) and
        // will thus also accidentally call putEditorCloseToInputOrigin, which
        // we don't want to call.
        // So we have to track the calls to putEditorCloseToInputOrigin that
        // are made from the iframe (i.e. from `resizeEditor()`) and ignore the
        // first one.
        if (this.firstPutEditorCloseToInputOrigin) {
            this.relativeX = 0;
            this.relativeY = 0;
            this.firstPutEditorCloseToInputOrigin = false;
            return;
        }
        return this.putEditorCloseToInputOrigin();
    }
    // Resize the iframe, making sure it doesn't get larger than the window
    resizeTo(width, height, warnIframe) {
        // If the dimensions that are asked for are too big, make them as big
        // as the window
        let cantFullyResize = false;
        let availableWidth = window.innerWidth;
        if (availableWidth > document.documentElement.clientWidth) {
            availableWidth = document.documentElement.clientWidth;
        }
        if (width >= availableWidth) {
            width = availableWidth - 1;
            cantFullyResize = true;
        }
        let availableHeight = window.innerHeight;
        if (availableHeight > document.documentElement.clientHeight) {
            availableHeight = document.documentElement.clientHeight;
        }
        if (height >= availableHeight) {
            height = availableHeight - 1;
            cantFullyResize = true;
        }
        // The dimensions that were asked for might make the iframe overflow.
        // In this case, we need to compute how much we need to move the iframe
        // to the left/top in order to have it bottom-right corner sit right in
        // the window's bottom-right corner.
        const rect = this.editor.getElement().getBoundingClientRect();
        const rightOverflow = availableWidth - (rect.left + width);
        this.relativeX = rightOverflow < 0 ? rightOverflow : 0;
        const bottomOverflow = availableHeight - (rect.top + height);
        this.relativeY = bottomOverflow < 0 ? bottomOverflow : 0;
        // Now actually set the width/height, move the editor where it is
        // supposed to be and if the new iframe can't be as big as requested,
        // warn the iframe script.
        this.iframe.style.width = `${width}px`;
        this.iframe.style.height = `${height}px`;
        if (cantFullyResize && warnIframe) {
            this.resizeReqId += 1;
            browser.runtime.sendMessage({
                args: {
                    frameId: this.frameId,
                    message: {
                        args: [this.resizeReqId, width, height],
                        funcName: ["resize"],
                    }
                },
                funcName: ["messageFrame"],
            });
        }
    }
    sendKey(key) {
        return browser.runtime.sendMessage({
            args: {
                frameId: this.frameId,
                message: {
                    args: [key],
                    funcName: ["frame_sendKey"],
                }
            },
            funcName: ["messageFrame"],
        });
    }
    setPageElementContent(text) {
        const focused = this.isFocused();
        this.editor.setContent(text);
        [
            new Event("keydown", { bubbles: true }),
            new Event("keyup", { bubbles: true }),
            new Event("keypress", { bubbles: true }),
            new Event("beforeinput", { bubbles: true }),
            new Event("input", { bubbles: true }),
            new Event("change", { bubbles: true })
        ].forEach(ev => this.originalElement.dispatchEvent(ev));
        if (focused) {
            this.focus();
        }
    }
    setPageElementCursor(line, column) {
        let p = Promise.resolve();
        this.cursor[0] = line;
        this.cursor[1] = column;
        if (this.isFocused()) {
            p = this.editor.setCursor(line, column);
        }
        return p;
    }
    show() {
        this.iframe.style.display = "initial";
    }
}


/***/ }),

/***/ "./src/autofill.ts":
/*!*************************!*\
  !*** ./src/autofill.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autofill": () => (/* binding */ autofill)
/* harmony export */ });
async function autofill() {
    const platInfoPromise = browser.runtime.sendMessage({
        args: {
            args: [],
            funcName: ["browser", "runtime", "getPlatformInfo"],
        },
        funcName: ["exec"],
    });
    const manifestPromise = browser.runtime.sendMessage({
        args: {
            args: [],
            funcName: ["browser", "runtime", "getManifest"],
        },
        funcName: ["exec"],
    });
    const nvimPluginPromise = browser.runtime.sendMessage({
        args: {},
        funcName: ["getNvimPluginVersion"],
    });
    const issueTemplatePromise = fetch(browser.runtime.getURL("ISSUE_TEMPLATE.md")).then(p => p.text());
    const browserString = navigator.userAgent.match(/(firefox|chrom)[^ ]+/gi);
    let name;
    let version;
    // Can't be tested, as coverage is only recorded on firefox
    /* istanbul ignore else */
    if (browserString) {
        [name, version] = browserString[0].split("/");
    }
    else {
        name = "unknown";
        version = "unknown";
    }
    const vendor = navigator.vendor || "";
    const textarea = document.getElementById("issue_body");
    const [platInfo, manifest, nvimPluginVersion, issueTemplate,] = await Promise.all([platInfoPromise, manifestPromise, nvimPluginPromise, issueTemplatePromise]);
    // Can't happen, but doesn't cost much to handle!
    /* istanbul ignore next */
    if (!textarea || textarea.value.replace(/\r/g, "") !== issueTemplate.replace(/\r/g, "")) {
        return;
    }
    textarea.value = issueTemplate
        .replace("OS Version:", `OS Version: ${platInfo.os} ${platInfo.arch}`)
        .replace("Browser Version:", `Browser Version: ${vendor} ${name} ${version}`)
        .replace("Browser Addon Version:", `Browser Addon Version: ${manifest.version}`)
        .replace("Neovim Plugin Version:", `Neovim Plugin Version: ${nvimPluginVersion}`);
}


/***/ }),

/***/ "./src/page.ts":
/*!*********************!*\
  !*** ./src/page.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTabFunctions": () => (/* binding */ getTabFunctions),
/* harmony export */   "getActiveContentFunctions": () => (/* binding */ getActiveContentFunctions),
/* harmony export */   "getNeovimFrameFunctions": () => (/* binding */ getNeovimFrameFunctions),
/* harmony export */   "PageEventEmitter": () => (/* binding */ PageEventEmitter),
/* harmony export */   "getPageProxy": () => (/* binding */ getPageProxy)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _utils_keys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/keys */ "./src/utils/keys.ts");




/////////////////////////////////////////////
// Functions running in the content script //
/////////////////////////////////////////////
function _focusInput(global, firenvim, addListener) {
    if (addListener) {
        // Only re-add event listener if input's selector matches the ones
        // that should be autonvimified
        const conf = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)();
        if (conf.selector && conf.selector !== "") {
            const elems = Array.from(document.querySelectorAll(conf.selector));
            addListener = elems.includes(firenvim.getElement());
        }
    }
    firenvim.focusOriginalElement(addListener);
}
function getFocusedElement(firenvimElems) {
    return Array
        .from(firenvimElems.values())
        .find(instance => instance.isFocused());
}
// Tab functions are functions all content scripts should react to
function getTabFunctions(global) {
    return {
        getActiveInstanceCount: () => global.firenvimElems.size,
        registerNewFrameId: (frameId) => {
            global.frameIdResolve(frameId);
        },
        setDisabled: (disabled) => {
            global.disabled = disabled;
        },
        setLastFocusedContentScript: (frameId) => {
            global.lastFocusedContentScript = frameId;
        }
    };
}
function isVisible(e) {
    const rect = e.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
// ActiveContent functions are functions only the active content script should react to
function getActiveContentFunctions(global) {
    return {
        forceNvimify: () => {
            let elem = document.activeElement;
            const isNull = elem === null || elem === undefined;
            const pageNotEditable = document.documentElement.contentEditable !== "true";
            const bodyNotEditable = (document.body.contentEditable === "false"
                || (document.body.contentEditable === "inherit"
                    && document.documentElement.contentEditable !== "true"));
            if (isNull
                || (elem === document.documentElement && pageNotEditable)
                || (elem === document.body && bodyNotEditable)) {
                elem = Array.from(document.getElementsByTagName("textarea"))
                    .find(isVisible);
                if (!elem) {
                    elem = Array.from(document.getElementsByTagName("input"))
                        .find(e => e.type === "text" && isVisible(e));
                }
                if (!elem) {
                    return;
                }
            }
            global.nvimify({ target: elem });
        },
        sendKey: (key) => {
            const firenvim = getFocusedElement(global.firenvimElems);
            if (firenvim !== undefined) {
                firenvim.sendKey(key);
            }
            else {
                // It's important to throw this error as the background script
                // will execute a fallback
                throw new Error("No firenvim frame selected");
            }
        },
    };
}
function getNeovimFrameFunctions(global) {
    return {
        evalInPage: (_, js) => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.executeInPage)(js),
        focusInput: (frameId) => {
            let firenvimElement;
            if (frameId === undefined) {
                firenvimElement = getFocusedElement(global.firenvimElems);
            }
            else {
                firenvimElement = global.firenvimElems.get(frameId);
            }
            _focusInput(global, firenvimElement, true);
        },
        focusPage: (frameId) => {
            const firenvimElement = global.firenvimElems.get(frameId);
            firenvimElement.clearFocusListeners();
            document.activeElement.blur();
            document.documentElement.focus();
        },
        getEditorInfo: (frameId) => global
            .firenvimElems
            .get(frameId)
            .getBufferInfo(),
        getElementContent: (frameId) => global
            .firenvimElems
            .get(frameId)
            .getPageElementContent(),
        hideEditor: (frameId) => {
            window.__firenvim_mnt_elm.style.visibility = 'unset';
            const firenvim = global.firenvimElems.get(frameId);
            firenvim.hide();
            _focusInput(global, firenvim, true);
        },
        killEditor: (frameId) => {
            window.__firenvim_mnt_elm.style.visibility = 'unset';
            const firenvim = global.firenvimElems.get(frameId);
            const isFocused = firenvim.isFocused();
            firenvim.detachFromPage();
            const conf = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)();
            if (isFocused) {
                _focusInput(global, firenvim, conf.takeover !== "once");
            }
            global.firenvimElems.delete(frameId);
        },
        pressKeys: (frameId, keys) => {
            global.firenvimElems.get(frameId).pressKeys((0,_utils_keys__WEBPACK_IMPORTED_MODULE_3__.keysToEvents)(keys));
        },
        resizeEditor: (frameId, width, height) => {
            const elem = global.firenvimElems.get(frameId);
            elem.resizeTo(width, height, true);
            elem.putEditorCloseToInputOriginAfterResizeFromFrame();
        },
        setElementContent: (frameId, text) => {
            return global.firenvimElems.get(frameId).setPageElementContent(text);
        },
        setElementCursor: (frameId, line, column) => {
            return global.firenvimElems.get(frameId).setPageElementCursor(line, column);
        },
    };
}
//////////////////////////////////////////////////////////////////////////////
// Definition of a proxy type that lets the frame script transparently call //
// the content script's functions                                           //
//////////////////////////////////////////////////////////////////////////////
;
class PageEventEmitter extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor() {
        super();
        browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
            switch (request.funcName[0]) {
                case "pause_keyhandler":
                case "frame_sendKey":
                case "resize":
                    this.emit(request.funcName[0], request.args);
                    break;
                case "get_buf_content":
                    return new Promise(resolve => this.emit(request.funcName[0], resolve));
                // default:
                //     console.error("Unhandled page request:", request);
            }
        });
    }
}
function getPageProxy(frameId) {
    const page = new PageEventEmitter();
    let funcName;
    for (funcName in getNeovimFrameFunctions({})) {
        // We need to declare func here because funcName is a global and would not
        // be captured in the closure otherwise
        const func = funcName;
        page[func] = ((...arr) => {
            return browser.runtime.sendMessage({
                args: {
                    args: [frameId].concat(arr),
                    funcName: [func],
                },
                funcName: ["messagePage"],
            });
        });
    }
    return page;
}
;


/***/ }),

/***/ "./src/utils/configuration.ts":
/*!************************************!*\
  !*** ./src/utils/configuration.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeWithDefaults": () => (/* binding */ mergeWithDefaults),
/* harmony export */   "confReady": () => (/* binding */ confReady),
/* harmony export */   "getGlobalConf": () => (/* binding */ getGlobalConf),
/* harmony export */   "getConf": () => (/* binding */ getConf),
/* harmony export */   "getConfForUrl": () => (/* binding */ getConfForUrl)
/* harmony export */ });
let conf = undefined;
function mergeWithDefaults(os, settings) {
    function makeDefaults(obj, name, value) {
        if (obj[name] === undefined) {
            obj[name] = value;
        }
    }
    function makeDefaultLocalSetting(sett, site, obj) {
        makeDefaults(sett.localSettings, site, {});
        for (const key of Object.keys(obj)) {
            makeDefaults(sett.localSettings[site], key, obj[key]);
        }
    }
    if (settings === undefined) {
        settings = {};
    }
    makeDefaults(settings, "globalSettings", {});
    // "<KEY>": "default" | "noop"
    // #103: When using the browser's command API to allow sending `<C-w>` to
    // firenvim, whether the default action should be performed if no neovim
    // frame is focused.
    makeDefaults(settings.globalSettings, "<C-n>", "default");
    makeDefaults(settings.globalSettings, "<C-t>", "default");
    makeDefaults(settings.globalSettings, "<C-w>", "default");
    // Note: <CS-*> are currently disabled because of
    // https://github.com/neovim/neovim/issues/12037
    // Note: <CS-n> doesn't match the default behavior on firefox because this
    // would require the sessions API. Instead, Firefox's behavior matches
    // Chrome's.
    makeDefaults(settings.globalSettings, "<CS-n>", "default");
    // Note: <CS-t> is there for completeness sake's but can't be emulated in
    // Chrome and Firefox because this would require the sessions API.
    makeDefaults(settings.globalSettings, "<CS-t>", "default");
    makeDefaults(settings.globalSettings, "<CS-w>", "default");
    // #717: allow passing keys to the browser
    makeDefaults(settings.globalSettings, "ignoreKeys", {});
    // #1050: cursor sometimes covered by command line
    makeDefaults(settings.globalSettings, "cmdlineTimeout", 3000);
    // "alt": "all" | "alphanum"
    // #202: Only register alt key on alphanums to let swedish osx users type
    //       special chars
    // Only tested on OSX, where we don't pull coverage reports, so don't
    // instrument function.
    /* istanbul ignore next */
    if (os === "mac") {
        makeDefaults(settings.globalSettings, "alt", "alphanum");
    }
    else {
        makeDefaults(settings.globalSettings, "alt", "all");
    }
    makeDefaults(settings, "localSettings", {});
    makeDefaultLocalSetting(settings, ".*", {
        // "cmdline": "neovim" | "firenvim"
        // #168: Use an external commandline to preserve space
        cmdline: "firenvim",
        content: "text",
        priority: 0,
        renderer: "canvas",
        selector: 'textarea:not([readonly]), div[role="textbox"]',
        // "takeover": "always" | "once" | "empty" | "nonempty" | "never"
        // #265: On "once", don't automatically bring back after :q'ing it
        takeover: "always",
        filename: "{hostname%32}_{pathname%32}_{selector%32}_{timestamp%32}.{extension}",
    });
    makeDefaultLocalSetting(settings, "about:blank\\?compose", {
        cmdline: "firenvim",
        content: "text",
        priority: 1,
        renderer: "canvas",
        selector: 'body',
        takeover: "always",
        filename: "mail_{timestamp%32}.eml",
    });
    return settings;
}
const confReady = new Promise(resolve => {
    browser.storage.local.get().then((obj) => {
        conf = obj;
        resolve(true);
    });
});
browser.storage.onChanged.addListener((changes) => {
    Object
        .entries(changes)
        .forEach(([key, value]) => confReady.then(() => {
        conf[key] = value.newValue;
    }));
});
function getGlobalConf() {
    // Can't be tested for
    /* istanbul ignore next */
    if (conf === undefined) {
        throw new Error("getGlobalConf called before config was ready");
    }
    return conf.globalSettings;
}
function getConf() {
    return getConfForUrl(document.location.href);
}
function getConfForUrl(url) {
    const localSettings = conf.localSettings;
    function or1(val) {
        if (val === undefined) {
            return 1;
        }
        return val;
    }
    // Can't be tested for
    /* istanbul ignore next */
    if (localSettings === undefined) {
        throw new Error("Error: your settings are undefined. Try reloading the page. If this error persists, try the troubleshooting guide: https://github.com/glacambre/firenvim/blob/master/TROUBLESHOOTING.md");
    }
    return Array.from(Object.entries(localSettings))
        .filter(([pat, _]) => (new RegExp(pat)).test(url))
        .sort((e1, e2) => (or1(e1[1].priority) - or1(e2[1].priority)))
        .reduce((acc, [_, cur]) => Object.assign(acc, cur), {});
}


/***/ }),

/***/ "./src/utils/keys.ts":
/*!***************************!*\
  !*** ./src/utils/keys.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nonLiteralKeys": () => (/* binding */ nonLiteralKeys),
/* harmony export */   "keysToEvents": () => (/* binding */ keysToEvents),
/* harmony export */   "translateKey": () => (/* binding */ translateKey),
/* harmony export */   "addModifier": () => (/* binding */ addModifier)
/* harmony export */ });
const nonLiteralKeys = {
    " ": "<Space>",
    "<": "<lt>",
    "ArrowDown": "<Down>",
    "ArrowLeft": "<Left>",
    "ArrowRight": "<Right>",
    "ArrowUp": "<Up>",
    "Backspace": "<BS>",
    "Delete": "<Del>",
    "End": "<End>",
    "Enter": "<CR>",
    "Escape": "<Esc>",
    "F1": "<F1>",
    "F10": "<F10>",
    "F11": "<F11>",
    "F12": "<F12>",
    "F13": "<F13>",
    "F14": "<F14>",
    "F15": "<F15>",
    "F16": "<F16>",
    "F17": "<F17>",
    "F18": "<F18>",
    "F19": "<F19>",
    "F2": "<F2>",
    "F20": "<F20>",
    "F21": "<F21>",
    "F22": "<F22>",
    "F23": "<F23>",
    "F24": "<F24>",
    "F3": "<F3>",
    "F4": "<F4>",
    "F5": "<F5>",
    "F6": "<F6>",
    "F7": "<F7>",
    "F8": "<F8>",
    "F9": "<F9>",
    "Home": "<Home>",
    "PageDown": "<PageDown>",
    "PageUp": "<PageUp>",
    "Tab": "<Tab>",
    "\\": "<Bslash>",
    "|": "<Bar>",
};
const nonLiteralVimKeys = Object.fromEntries(Object
    .entries(nonLiteralKeys)
    .map(([x, y]) => [y, x]));
const nonLiteralKeyCodes = {
    "Enter": 13,
    "Space": 32,
    "Tab": 9,
    "Delete": 46,
    "End": 35,
    "Home": 36,
    "Insert": 45,
    "PageDown": 34,
    "PageUp": 33,
    "ArrowDown": 40,
    "ArrowLeft": 37,
    "ArrowRight": 39,
    "ArrowUp": 38,
    "Escape": 27,
};
// Given a "special" key representation (e.g. <Enter> or <M-l>), returns an
// array of three javascript keyevents, the first one representing the
// corresponding keydown, the second one a keypress and the third one a keyup
// event.
function modKeyToEvents(k) {
    let mods = "";
    let key = nonLiteralVimKeys[k];
    let ctrlKey = false;
    let altKey = false;
    let shiftKey = false;
    if (key === undefined) {
        const arr = k.slice(1, -1).split("-");
        mods = arr[0];
        key = arr[1];
        ctrlKey = /c/i.test(mods);
        altKey = /a/i.test(mods);
        const specialChar = "<" + key + ">";
        if (nonLiteralVimKeys[specialChar] !== undefined) {
            key = nonLiteralVimKeys[specialChar];
            shiftKey = false;
        }
        else {
            shiftKey = key !== key.toLocaleLowerCase();
        }
    }
    // Some pages rely on keyCodes to figure out what key was pressed. This is
    // awful because keycodes aren't guaranteed to be the same acrross
    // browsers/OS/keyboard layouts but try to do the right thing anyway.
    // https://github.com/glacambre/firenvim/issues/723
    let keyCode = 0;
    if (/^[a-zA-Z0-9]$/.test(key)) {
        keyCode = key.charCodeAt(0);
    }
    else if (nonLiteralKeyCodes[key] !== undefined) {
        keyCode = nonLiteralKeyCodes[key];
    }
    const init = { key, keyCode, ctrlKey, altKey, shiftKey, bubbles: true };
    return [
        new KeyboardEvent("keydown", init),
        new KeyboardEvent("keypress", init),
        new KeyboardEvent("keyup", init),
    ];
}
// Given a "simple" key (e.g. `a`, `1`…), returns an array of three javascript
// events representing the action of pressing the key.
function keyToEvents(key) {
    const shiftKey = key !== key.toLocaleLowerCase();
    return [
        new KeyboardEvent("keydown", { key, shiftKey, bubbles: true }),
        new KeyboardEvent("keypress", { key, shiftKey, bubbles: true }),
        new KeyboardEvent("keyup", { key, shiftKey, bubbles: true }),
    ];
}
// Given an array of string representation of keys (e.g. ["a", "<Enter>", …]),
// returns an array of javascript keyboard events that simulate these keys
// being pressed.
function keysToEvents(keys) {
    // Code to split mod keys and non-mod keys:
    // const keys = str.match(/([<>][^<>]+[<>])|([^<>]+)/g)
    // if (keys === null) {
    //     return [];
    // }
    return keys.map((key) => {
        if (key[0] === "<") {
            return modKeyToEvents(key);
        }
        return keyToEvents(key);
    }).flat();
}
// Turns a non-literal key (e.g. "Enter") into a vim-equivalent "<Enter>"
function translateKey(key) {
    if (nonLiteralKeys[key] !== undefined) {
        return nonLiteralKeys[key];
    }
    return key;
}
// Add modifier `mod` (`A`, `C`, `S`…) to `text` (a vim key `b`, `<Enter>`,
// `<CS-x>`…)
function addModifier(mod, text) {
    let match;
    let modifiers = "";
    let key = "";
    if ((match = text.match(/^<([A-Z]{1,5})-(.+)>$/))) {
        modifiers = match[1];
        key = match[2];
    }
    else if ((match = text.match(/^<(.+)>$/))) {
        key = match[1];
    }
    else {
        key = text;
    }
    return "<" + mod + modifiers + "-" + key + ">";
}


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isChrome": () => (/* binding */ isChrome),
/* harmony export */   "isThunderbird": () => (/* binding */ isThunderbird),
/* harmony export */   "executeInPage": () => (/* binding */ executeInPage),
/* harmony export */   "getIconImageData": () => (/* binding */ getIconImageData),
/* harmony export */   "toFileName": () => (/* binding */ toFileName),
/* harmony export */   "languageToExtensions": () => (/* binding */ languageToExtensions),
/* harmony export */   "parseSingleGuifont": () => (/* binding */ parseSingleGuifont),
/* harmony export */   "parseGuifont": () => (/* binding */ parseGuifont),
/* harmony export */   "computeSelector": () => (/* binding */ computeSelector),
/* harmony export */   "toHexCss": () => (/* binding */ toHexCss)
/* harmony export */ });
let curHost;
// Can't get coverage for thunderbird.
/* istanbul ignore next */
if (browser.composeScripts !== undefined || document.location.href === "about:blank?compose") {
    curHost = "thunderbird";
    // Chrome doesn't have a "browser" object, instead it uses "chrome".
}
else if (window.location.protocol === "moz-extension:") {
    curHost = "firefox";
}
else if (window.location.protocol === "chrome-extension:") {
    curHost = "chrome";
}
// Only usable in background script!
function isChrome() {
    // Can't cover error condition
    /* istanbul ignore next */
    if (curHost === undefined) {
        throw Error("Used isChrome in content script!");
    }
    return curHost === "chrome";
}
function isThunderbird() {
    // Can't cover error condition
    /* istanbul ignore next */
    if (curHost === undefined) {
        throw Error("Used isThunderbird in content script!");
    }
    return curHost === "thunderbird";
}
// Runs CODE in the page's context by setting up a custom event listener,
// embedding a script element that runs the piece of code and emits its result
// as an event.
function executeInPage(code) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const eventId = (new URL(browser.runtime.getURL(""))).hostname + Math.random();
        script.innerHTML = `(async (evId) => {
            try {
                let result;
                result = await ${code};
                window.dispatchEvent(new CustomEvent(evId, {
                    detail: {
                        success: true,
                        result,
                    }
                }));
            } catch (e) {
                window.dispatchEvent(new CustomEvent(evId, {
                    detail: { success: false, reason: e },
                }));
            }
        })(${JSON.stringify(eventId)})`;
        window.addEventListener(eventId, ({ detail }) => {
            script.parentNode.removeChild(script);
            if (detail.success) {
                return resolve(detail.result);
            }
            return reject(detail.reason);
        }, { once: true });
        document.head.appendChild(script);
    });
}
// Various filters that are used to change the appearance of the BrowserAction
// icon.
const svgpath = "firenvim.svg";
const transformations = {
    disabled: (img) => {
        for (let i = 0; i < img.length; i += 4) {
            // Skip transparent pixels
            if (img[i + 3] === 0) {
                continue;
            }
            const mean = Math.floor((img[i] + img[i + 1] + img[i + 2]) / 3);
            img[i] = mean;
            img[i + 1] = mean;
            img[i + 2] = mean;
        }
    },
    error: (img) => {
        for (let i = 0; i < img.length; i += 4) {
            // Turn transparent pixels red
            if (img[i + 3] === 0) {
                img[i] = 255;
                img[i + 3] = 255;
            }
        }
    },
    normal: ((_img) => undefined),
    notification: (img) => {
        for (let i = 0; i < img.length; i += 4) {
            // Turn transparent pixels yellow
            if (img[i + 3] === 0) {
                img[i] = 255;
                img[i + 1] = 255;
                img[i + 3] = 255;
            }
        }
    },
};
// Takes an icon kind and dimensions as parameter, draws that to a canvas and
// returns a promise that will be resolved with the canvas' image data.
function getIconImageData(kind, width = 32, height = 32) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image(width, height);
    const result = new Promise((resolve) => img.addEventListener("load", () => {
        ctx.drawImage(img, 0, 0, width, height);
        const id = ctx.getImageData(0, 0, width, height);
        transformations[kind](id.data);
        resolve(id);
    }));
    img.src = svgpath;
    return result;
}
// Given a url and a selector, tries to compute a name that will be unique,
// short and readable for the user.
function toFileName(formatString, url, id, language) {
    let parsedURL;
    try {
        parsedURL = new URL(url);
    }
    catch (e) {
        // Only happens with thunderbird, where we can't get coverage
        /* istanbul ignore next */
        parsedURL = { hostname: 'thunderbird', pathname: 'mail' };
    }
    const sanitize = (s) => (s.match(/[a-zA-Z0-9]+/g) || []).join("-");
    const expand = (pattern) => {
        const noBrackets = pattern.slice(1, -1);
        const [symbol, length] = noBrackets.split("%");
        let value = "";
        switch (symbol) {
            case "hostname":
                value = parsedURL.hostname;
                break;
            case "pathname":
                value = sanitize(parsedURL.pathname);
                break;
            case "selector":
                value = sanitize(id.replace(/:nth-of-type/g, ""));
                break;
            case "timestamp":
                value = sanitize((new Date()).toISOString());
                break;
            case "extension":
                value = languageToExtensions(language);
                break;
            default: console.error(`Unrecognized filename pattern: ${pattern}`);
        }
        return value.slice(-length);
    };
    let result = formatString;
    const matches = formatString.match(/{[^}]*}/g);
    if (matches !== null) {
        for (const match of matches.filter(s => s !== undefined)) {
            result = result.replace(match, expand(match));
        }
    }
    return result;
}
// Given a language name, returns a filename extension. Can return undefined.
function languageToExtensions(language) {
    // if (language === undefined || language === null) {
    //     language = "";
    // }
    // const lang = language.toLowerCase();
    // /* istanbul ignore next */
    // switch (lang) {
    //     case "apl":              return "apl";
    //     case "brainfuck":        return "bf";
    //     case "c":                return "c";
    //     case "c#":               return "cs";
    //     case "c++":              return "cpp";
    //     case "ceylon":           return "ceylon";
    //     case "clike":            return "c";
    //     case "clojure":          return "clj";
    //     case "cmake":            return ".cmake";
    //     case "cobol":            return "cbl";
    //     case "coffeescript":     return "coffee";
    //     case "commonlisp":      return "lisp";
    //     case "crystal":          return "cr";
    //     case "css":              return "css";
    //     case "cython":           return "py";
    //     case "d":                return "d";
    //     case "dart":             return "dart";
    //     case "diff":             return "diff";
    //     case "dockerfile":       return "dockerfile";
    //     case "dtd":              return "dtd";
    //     case "dylan":            return "dylan";
    //     // Eiffel was there first but elixir seems more likely
    //     // case "eiffel":           return "e";
    //     case "elixir":           return "e";
    //     case "elm":              return "elm";
    //     case "erlang":           return "erl";
    //     case "f#":               return "fs";
    //     case "factor":           return "factor";
    //     case "forth":            return "fth";
    //     case "fortran":          return "f90";
    //     case "gas":              return "asm";
    //     case "go":               return "go";
    //     // GFM: CodeMirror's github-flavored markdown
    //     case "gfm":              return "md";
    //     case "groovy":           return "groovy";
    //     case "haml":             return "haml";
    //     case "handlebars":       return "hbs";
    //     case "haskell":          return "hs";
    //     case "haxe":             return "hx";
    //     case "html":             return "html";
    //     case "htmlembedded":     return "html";
    //     case "htmlmixed":        return "html";
    //     case "ipython":          return "py";
    //     case "ipythonfm":        return "md";
    //     case "java":             return "java";
    //     case "javascript":       return "js";
    //     case "jinja2":           return "jinja";
    //     case "julia":            return "jl";
    //     case "jsx":              return "jsx";
    //     case "kotlin":           return "kt";
    //     case "latex":            return "latex";
    //     case "less":             return "less";
    //     case "lua":              return "lua";
    //     case "markdown":         return "md";
    //     case "mllike":            return "ml";
    //     case "ocaml":            return "ml";
    //     case "octave":           return "m";
    //     case "pascal":           return "pas";
    //     case "perl":             return "pl";
    //     case "php":              return "php";
    //     case "powershell":       return "ps1";
    //     case "python":           return "py";
    //     case "r":                return "r";
    //     case "rst":              return "rst";
    //     case "ruby":             return "ruby";
    //     case "rust":             return "rs";
    //     case "sas":              return "sas";
    //     case "sass":             return "sass";
    //     case "scala":            return "scala";
    //     case "scheme":           return "scm";
    //     case "scss":             return "scss";
    //     case "smalltalk":        return "st";
    //     case "shell":            return "sh";
    //     case "sql":              return "sql";
    //     case "stex":             return "latex";
    //     case "swift":            return "swift";
    //     case "tcl":              return "tcl";
    //     case "toml":             return "toml";
    //     case "twig":             return "twig";
    //     case "typescript":       return "ts";
    //     case "vb":               return "vb";
    //     case "vbscript":         return "vbs";
    //     case "verilog":          return "sv";
    //     case "vhdl":             return "vhdl";
    //     case "xml":              return "xml";
    //     case "yaml":             return "yaml";
    //     case "z80":              return "z8a";
    // }
    return "txt";
}
// Make tslint happy
const fontFamily = "font-family";
// Can't be tested e2e :/
/* istanbul ignore next */
function parseSingleGuifont(guifont, defaults) {
    const options = guifont.split(":");
    const result = Object.assign({}, defaults);
    if (/^[a-zA-Z0-9]+$/.test(options[0])) {
        result[fontFamily] = options[0];
    }
    else {
        result[fontFamily] = JSON.stringify(options[0]);
    }
    if (defaults[fontFamily]) {
        result[fontFamily] += `, ${defaults[fontFamily]}`;
    }
    return options.slice(1).reduce((acc, option) => {
        switch (option[0]) {
            case "h":
                acc["font-size"] = `${option.slice(1)}pt`;
                break;
            case "b":
                acc["font-weight"] = "bold";
                break;
            case "i":
                acc["font-style"] = "italic";
                break;
            case "u":
                acc["text-decoration"] = "underline";
                break;
            case "s":
                acc["text-decoration"] = "line-through";
                break;
            case "w": // Can't set font width. Would have to adjust cell width.
            case "c": // Can't set character set
                break;
        }
        return acc;
    }, result);
}
;
// Parses a guifont declaration as described in `:h E244`
// defaults: default value for each of.
// Can't be tested e2e :/
/* istanbul ignore next */
function parseGuifont(guifont, defaults) {
    const fonts = guifont.split(",").reverse();
    return fonts.reduce((acc, cur) => parseSingleGuifont(cur, acc), defaults);
}
// Computes a unique selector for its argument.
function computeSelector(element) {
    function uniqueSelector(e) {
        // Only matching alphanumeric selectors because others chars might have special meaning in CSS
        if (e.id && e.id.match("^[a-zA-Z0-9_-]+$")) {
            const id = e.tagName + `[id="${e.id}"]`;
            if (document.querySelectorAll(id).length === 1) {
                return id;
            }
        }
        // If we reached the top of the document
        if (!e.parentElement) {
            return "HTML";
        }
        // Compute the position of the element
        const index = Array.from(e.parentElement.children)
            .filter(child => child.tagName === e.tagName)
            .indexOf(e) + 1;
        return `${uniqueSelector(e.parentElement)} > ${e.tagName}:nth-of-type(${index})`;
    }
    return uniqueSelector(element);
}
// Turns a number into its hash+6 number hexadecimal representation.
function toHexCss(n) {
    if (n === undefined)
        return undefined;
    const str = n.toString(16);
    // Pad with leading zeros
    return "#" + (new Array(6 - str.length)).fill("0").join("") + str;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "firenvimGlobal": () => (/* binding */ firenvimGlobal),
/* harmony export */   "frameFunctions": () => (/* binding */ frameFunctions),
/* harmony export */   "activeFunctions": () => (/* binding */ activeFunctions),
/* harmony export */   "tabFunctions": () => (/* binding */ tabFunctions),
/* harmony export */   "listenersSetup": () => (/* binding */ listenersSetup)
/* harmony export */ });
/* harmony import */ var _FirenvimElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FirenvimElement */ "./src/FirenvimElement.ts");
/* harmony import */ var _autofill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./autofill */ "./src/autofill.ts");
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page */ "./src/page.ts");




if (document.location.href === "https://github.com/glacambre/firenvim/issues/new"
    || document.location.protocol === "file:" && document.location.href.endsWith("github.html")) {
    addEventListener("load", _autofill__WEBPACK_IMPORTED_MODULE_1__.autofill);
}
// Promise used to implement a locking mechanism preventing concurrent creation
// of neovim frames
let frameIdLock = Promise.resolve();
const firenvimGlobal = {
    // Whether Firenvim is disabled in this tab
    disabled: browser.runtime.sendMessage({
        args: ["disabled"],
        funcName: ["getTabValue"],
    })
        // Note: this relies on setDisabled existing in the object returned by
        // getFunctions and attached to the window object
        .then((disabled) => window.setDisabled(disabled)),
    // Promise-resolution function called when a frameId is received from the
    // background script
    frameIdResolve: (_) => undefined,
    // lastFocusedContentScript keeps track of the last content frame that has
    // been focused. This is necessary in pages that contain multiple frames
    // (and thus multiple content scripts): for example, if users press the
    // global keyboard shortcut <C-n>, the background script sends a "global"
    // message to all of the active tab's content scripts. For a content script
    // to know if it should react to a global message, it just needs to check
    // if it is the last active content script.
    lastFocusedContentScript: 0,
    // nvimify: triggered when an element is focused, takes care of creating
    // the editor iframe, appending it to the page and focusing it.
    nvimify: async (evt) => {
        if (firenvimGlobal.disabled instanceof Promise) {
            await firenvimGlobal.disabled;
        }
        // When creating new frames, we need to know their frameId in order to
        // communicate with them. This can't be retrieved through a
        // synchronous, in-page call so the new frame has to tell the
        // background script to send its frame id to the page. Problem is, if
        // multiple frames are created in a very short amount of time, we
        // aren't guaranteed to receive these frameIds in the order in which
        // the frames were created. So we have to implement a locking mechanism
        // to make sure that we don't create new frames until we received the
        // frameId of the previously created frame.
        let lock;
        while (lock !== frameIdLock) {
            lock = frameIdLock;
            await frameIdLock;
        }
        frameIdLock = new Promise(async (unlock) => {
            // auto is true when nvimify() is called as an event listener, false
            // when called from forceNvimify()
            const auto = (evt instanceof FocusEvent);
            const takeover = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)().takeover;
            if (firenvimGlobal.disabled || (auto && takeover === "never")) {
                unlock();
                return;
            }
            let elm = evt.target;
            if (window.location.hostname === 'leetcode.cn') {
                elm = elm.parentElement.parentElement.parentElement;
            }
            window.__firenvim_mnt_elm = elm;
            window.__firenvim_mnt_elm.style.visibility = 'hidden';
            const firenvim = new _FirenvimElement__WEBPACK_IMPORTED_MODULE_0__.FirenvimElement(evt.target, firenvimGlobal.nvimify, (id) => firenvimGlobal.firenvimElems.delete(id));
            const editor = firenvim.getEditor();
            // If this element already has a neovim frame, stop
            const alreadyRunning = Array.from(firenvimGlobal.firenvimElems.values())
                .find((instance) => instance.getElement() === editor.getElement());
            if (alreadyRunning !== undefined) {
                // The span might have been removed from the page by the page
                // (this happens on Jira/Confluence for example) so we check
                // for that.
                const span = alreadyRunning.getSpan();
                if (span.ownerDocument.contains(span)) {
                    alreadyRunning.show();
                    alreadyRunning.focus();
                    unlock();
                    return;
                }
                else {
                    // If the span has been removed from the page, the editor
                    // is dead because removing an iframe from the page kills
                    // the websocket connection inside of it.
                    // We just tell the editor to clean itself up and go on as
                    // if it didn't exist.
                    alreadyRunning.detachFromPage();
                }
            }
            if (auto && (takeover === "empty" || takeover === "nonempty")) {
                const content = (await editor.getContent()).trim();
                if ((content !== "" && takeover === "empty")
                    || (content === "" && takeover === "nonempty")) {
                    unlock();
                    return;
                }
            }
            firenvim.prepareBufferInfo();
            const frameIdPromise = new Promise((resolve, reject) => {
                firenvimGlobal.frameIdResolve = resolve;
                // TODO: make this timeout the same as the one in background.ts
                setTimeout(reject, 10000);
            });
            frameIdPromise.then((frameId) => {
                firenvimGlobal.firenvimElems.set(frameId, firenvim);
                firenvimGlobal.frameIdResolve = () => undefined;
                unlock();
            });
            frameIdPromise.catch(unlock);
            firenvim.attachToPage(frameIdPromise);
        });
    },
    // fienvimElems maps frame ids to firenvim elements.
    firenvimElems: new Map(),
};
const ownFrameId = browser.runtime.sendMessage({ args: [], funcName: ["getOwnFrameId"] });
async function announceFocus() {
    const frameId = await ownFrameId;
    firenvimGlobal.lastFocusedContentScript = frameId;
    browser.runtime.sendMessage({
        args: {
            args: [frameId],
            funcName: ["setLastFocusedContentScript"]
        },
        funcName: ["messagePage"]
    });
}
// When the frame is created, we might receive focus, check for that
ownFrameId.then(_ => {
    if (document.hasFocus()) {
        announceFocus();
    }
});
async function addFocusListener() {
    window.removeEventListener("focus", announceFocus);
    window.addEventListener("focus", announceFocus);
}
addFocusListener();
// We need to use setInterval to periodically re-add the focus listeners as in
// frames the document could get deleted and re-created without our knowledge.
const intervalId = setInterval(addFocusListener, 100);
// But we don't want to syphon the user's battery so we stop checking after a second
setTimeout(() => clearInterval(intervalId), 1000);
const frameFunctions = (0,_page__WEBPACK_IMPORTED_MODULE_3__.getNeovimFrameFunctions)(firenvimGlobal);
const activeFunctions = (0,_page__WEBPACK_IMPORTED_MODULE_3__.getActiveContentFunctions)(firenvimGlobal);
const tabFunctions = (0,_page__WEBPACK_IMPORTED_MODULE_3__.getTabFunctions)(firenvimGlobal);
Object.assign(window, frameFunctions, activeFunctions, tabFunctions);
browser.runtime.onMessage.addListener(async (request) => {
    // All content scripts must react to tab functions
    let fn = request.funcName.reduce((acc, cur) => acc[cur], tabFunctions);
    if (fn !== undefined) {
        return fn(...request.args);
    }
    // The only content script that should react to activeFunctions is the active one
    fn = request.funcName.reduce((acc, cur) => acc[cur], activeFunctions);
    if (fn !== undefined) {
        if (firenvimGlobal.lastFocusedContentScript === await ownFrameId) {
            return fn(...request.args);
        }
        return new Promise(() => undefined);
    }
    // The only content script that should react to frameFunctions is the one
    // that owns the frame that sent the request
    fn = request.funcName.reduce((acc, cur) => acc[cur], frameFunctions);
    if (fn !== undefined) {
        if (firenvimGlobal.firenvimElems.get(request.args[0]) !== undefined) {
            return fn(...request.args);
        }
        return new Promise(() => undefined);
    }
    throw new Error(`Error: unhandled content request: ${JSON.stringify(request)}.`);
});
function setupListeners(selector) {
    function onScroll(cont) {
        window.requestAnimationFrame(() => {
            const posChanged = Array.from(firenvimGlobal.firenvimElems.entries())
                .map(([_, elem]) => elem.putEditorCloseToInputOrigin())
                .find(changed => changed.posChanged);
            if (posChanged) {
                // As long as one editor changes position, try to resize
                onScroll(true);
            }
            else if (cont) {
                // No editor has moved, but this might be because the website
                // implements some kind of smooth scrolling that doesn't make
                // the textarea move immediately. In order to deal with these
                // cases, schedule a last redraw in a few milliseconds
                setTimeout(() => onScroll(false), 100);
            }
        });
    }
    function doScroll() {
        return onScroll(true);
    }
    window.addEventListener("scroll", doScroll);
    window.addEventListener("wheel", doScroll);
    (new (window.ResizeObserver)((_) => {
        onScroll(true);
    })).observe(document.documentElement);
    function addNvimListener(elem) {
        elem.removeEventListener("focus", firenvimGlobal.nvimify);
        elem.addEventListener("focus", firenvimGlobal.nvimify);
        let parent = elem.parentElement;
        while (parent) {
            parent.removeEventListener("scroll", doScroll);
            parent.addEventListener("scroll", doScroll);
            parent = parent.parentElement;
        }
    }
    (new MutationObserver((changes, _) => {
        if (changes.filter(change => change.addedNodes.length > 0).length <= 0) {
            return;
        }
        // This mutation observer is triggered every time an element is
        // added/removed from the page. When this happens, try to apply
        // listeners again, in case a new textarea/input field has been added.
        const toPossiblyNvimify = Array.from(document.querySelectorAll(selector));
        toPossiblyNvimify.forEach(elem => addNvimListener(elem));
        const takeover = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)().takeover;
        function shouldNvimify(node) {
            // Ideally, the takeover !== "never" check shouldn't be performed
            // here: it should live in nvimify(). However, nvimify() only
            // checks for takeover === "never" if it is called from an event
            // handler (this is necessary in order to allow manually nvimifying
            // elements). Thus, we need to check if takeover !== "never" here
            // too.
            return takeover !== "never"
                && document.activeElement === node
                && toPossiblyNvimify.includes(node);
        }
        // We also need to check if the currently focused element is among the
        // newly created elements and if it is, nvimify it.
        // Note that we can't do this unconditionally: we would turn the active
        // element into a neovim frame even for unrelated dom changes.
        for (const mr of changes) {
            for (const node of mr.addedNodes) {
                if (shouldNvimify(node)) {
                    activeFunctions.forceNvimify();
                    return;
                }
                const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
                while (walker.nextNode()) {
                    if (shouldNvimify(walker.currentNode)) {
                        activeFunctions.forceNvimify();
                        return;
                    }
                }
            }
        }
    })).observe(window.document, { subtree: true, childList: true });
    let elements;
    try {
        elements = Array.from(document.querySelectorAll(selector));
    }
    catch {
        alert(`Firenvim error: invalid CSS selector (${selector}) in your g:firenvim_config.`);
        elements = [];
    }
    elements.forEach(elem => addNvimListener(elem));
}
const listenersSetup = new Promise(resolve => {
    _utils_configuration__WEBPACK_IMPORTED_MODULE_2__.confReady.then(() => {
        const conf = (0,_utils_configuration__WEBPACK_IMPORTED_MODULE_2__.getConf)();
        if (conf.selector !== undefined && conf.selector !== "") {
            setupListeners(conf.selector);
        }
        resolve(undefined);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsWUFBWSxFQUFFLENBQUM7d0JBQy9CLE9BQU87cUJBQ1Y7aUJBQ0o7YUFDSjtTQUNKO0lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFakUsSUFBSSxRQUF1QixDQUFDO0lBQzVCLElBQUk7UUFDQSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUM5RDtJQUFDLE1BQU07UUFDSixLQUFLLENBQUMseUNBQXlDLFFBQVEsOEJBQThCLENBQUMsQ0FBQztRQUN2RixRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ2pCO0lBQ0QsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFTSxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUNoRCxnRUFBYyxDQUFDLEdBQUcsRUFBRTtRQUNoQixNQUFNLElBQUksR0FBeUIsNkRBQU8sRUFBRSxDQUFDO1FBQzdDLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUU7WUFDckQsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqQztRQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9ub2RlX21vZHVsZXMvZWRpdG9yLWFkYXB0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9zcmMvRXZlbnRFbWl0dGVyLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL0ZpcmVudmltRWxlbWVudC50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy9hdXRvZmlsbC50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy9wYWdlLnRzIiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL3V0aWxzL2NvbmZpZ3VyYXRpb24udHMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9zcmMvdXRpbHMva2V5cy50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy91dGlscy91dGlscy50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL2NvbnRlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEdlbmVyaWNBYnN0cmFjdEVkaXRvciB7XG4gICAgY29uc3RydWN0b3IoX2UsIF9vcHRpb25zKSB7IH1cbiAgICA7XG4gICAgc3RhdGljIG1hdGNoZXMoXykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYXRjaGVzIGZ1bmN0aW9uIG5vdCBvdmVycmlkZW5cIik7XG4gICAgfVxuICAgIDtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgY2xhc3MgQWNlRWRpdG9yIGV4dGVuZHMgR2VuZXJpY0Fic3RyYWN0RWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihlLCBfb3B0aW9ucykge1xuICAgICAgICBzdXBlcihlLCBfb3B0aW9ucyk7XG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBzdHJpbmdpZmllZCBhbmQgaW5zZXJ0ZWQgaW4gcGFnZSBjb250ZXh0IHNvIHdlXG4gICAgICAgIC8vIGNhbid0IGluc3RydW1lbnQgaXQuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIHRoaXMuZ2V0QWNlID0gKHNlbGVjKSA9PiB7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q29udGVudCA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBjb25zdCBhY2UgPSBlbGVtLmFjZUVkaXRvciB8fCB1bndyYXAod2luZG93KS5hY2UuZWRpdChlbGVtKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKGFjZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDdXJzb3IgPSBhc3luYyAoc2VsZWN0b3IsIHdyYXAsIHVud3JhcCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uO1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgYWNlID0gZWxlbS5hY2VFZGl0b3IgfHwgdW53cmFwKHdpbmRvdykuYWNlLmVkaXQoZWxlbSk7XG4gICAgICAgICAgICBpZiAoYWNlLmdldEN1cnNvclBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGFjZS5nZXRDdXJzb3JQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBhY2Uuc2VsZWN0aW9uLmN1cnNvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbd3JhcChwb3NpdGlvbi5yb3cpICsgMSwgd3JhcChwb3NpdGlvbi5jb2x1bW4pXTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50ID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRMYW5ndWFnZSA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBjb25zdCBhY2UgPSBlbGVtLmFjZUVkaXRvciB8fCB1bndyYXAod2luZG93KS5hY2UuZWRpdChlbGVtKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKGFjZS5zZXNzaW9uLiRtb2RlSWQpLnNwbGl0KFwiL1wiKS5zbGljZSgtMSlbMF07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q29udGVudCA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwLCB0ZXh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBjb25zdCBhY2UgPSBlbGVtLmFjZUVkaXRvciB8fCB1bndyYXAod2luZG93KS5hY2UuZWRpdChlbGVtKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKGFjZS5zZXRWYWx1ZSh0ZXh0LCAxKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yID0gYXN5bmMgKHNlbGVjdG9yLCB3cmFwLCB1bndyYXAsIGxpbmUsIGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgYWNlID0gZWxlbS5hY2VFZGl0b3IgfHwgdW53cmFwKHdpbmRvdykuYWNlLmVkaXQoZWxlbSk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBhY2UuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChzZWxlY3Rpb24ubW92ZUN1cnNvclRvKGxpbmUgLSAxLCBjb2x1bW4sIGZhbHNlKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZWxlbSA9IGU7XG4gICAgICAgIC8vIEdldCB0aGUgdG9wbW9zdCBhY2UgZWxlbWVudFxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5lbGVtLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChBY2VFZGl0b3IubWF0Y2hlcyhwYXJlbnQpKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW0gPSBwYXJlbnQ7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgbWF0Y2hlcyhlKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7ICsraSkge1xuICAgICAgICAgICAgaWYgKHBhcmVudCAhPT0gdW5kZWZpbmVkICYmIHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICgoL2FjZV9lZGl0b3IvZ2kpLnRlc3QocGFyZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGNsYXNzIENvZGVNaXJyb3JFZGl0b3IgZXh0ZW5kcyBHZW5lcmljQWJzdHJhY3RFZGl0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGUsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoZSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZ2V0Q29udGVudCA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh1bndyYXAoZWxlbSkuQ29kZU1pcnJvci5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDdXJzb3IgPSBhc3luYyAoc2VsZWN0b3IsIHdyYXAsIHVud3JhcCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB1bndyYXAoZWxlbSkuQ29kZU1pcnJvci5nZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIHJldHVybiBbd3JhcChwb3NpdGlvbi5saW5lKSArIDEsIHdyYXAocG9zaXRpb24uY2gpXTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50ID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRMYW5ndWFnZSA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh1bndyYXAoZWxlbSkuQ29kZU1pcnJvci5nZXRNb2RlKCkubmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q29udGVudCA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwLCB0ZXh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh1bndyYXAoZWxlbSkuQ29kZU1pcnJvci5zZXRWYWx1ZSh0ZXh0KSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yID0gYXN5bmMgKHNlbGVjdG9yLCB3cmFwLCB1bndyYXAsIGxpbmUsIGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAodW53cmFwKGVsZW0pLkNvZGVNaXJyb3Iuc2V0Q3Vyc29yKHsgbGluZTogbGluZSAtIDEsIGNoOiBjb2x1bW4gfSkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVsZW0gPSBlO1xuICAgICAgICAvLyBHZXQgdGhlIHRvcG1vc3QgQ29kZU1pcnJvciBlbGVtZW50XG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLmVsZW0ucGFyZW50RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKENvZGVNaXJyb3JFZGl0b3IubWF0Y2hlcyhwYXJlbnQpKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW0gPSBwYXJlbnQ7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgbWF0Y2hlcyhlKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7ICsraSkge1xuICAgICAgICAgICAgaWYgKHBhcmVudCAhPT0gdW5kZWZpbmVkICYmIHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICgoL14oLiogKT9Db2RlTWlycm9yL2dpKS50ZXN0KHBhcmVudC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjbGFzcyBNb25hY29FZGl0b3IgZXh0ZW5kcyBHZW5lcmljQWJzdHJhY3RFZGl0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGUsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoZSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZ2V0Q29udGVudCA9IGFzeW5jIChzZWxlY3Rvciwgd3JhcCwgdW53cmFwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBjb25zdCB1cmkgPSBlbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtdXJpXCIpO1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSB1bndyYXAod2luZG93KS5tb25hY28uZWRpdG9yLmdldE1vZGVsKHVyaSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChtb2RlbC5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gSXQncyBpbXBvc3NpYmxlIHRvIGdldCBNb25hY28ncyBjdXJzb3IgcG9zaXRpb246XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbW9uYWNvLWVkaXRvci9pc3N1ZXMvMjU4XG4gICAgICAgIHRoaXMuZ2V0Q3Vyc29yID0gYXN5bmMgKHNlbGVjdG9yLCB3cmFwLCB1bndyYXApID0+IHtcbiAgICAgICAgICAgIHJldHVybiBbMSwgMF07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TGFuZ3VhZ2UgPSBhc3luYyAoc2VsZWN0b3IsIHdyYXAsIHVud3JhcCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgdXJpID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVyaVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gdW53cmFwKHdpbmRvdykubW9uYWNvLmVkaXRvci5nZXRNb2RlbCh1cmkpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAobW9kZWwuZ2V0TW9kZUlkKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldENvbnRlbnQgPSBhc3luYyAoc2VsZWN0b3IsIHdyYXAsIHVud3JhcCwgdGV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgdXJpID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVyaVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gdW53cmFwKHdpbmRvdykubW9uYWNvLmVkaXRvci5nZXRNb2RlbCh1cmkpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAobW9kZWwuc2V0VmFsdWUodGV4dCkpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBJdCdzIGltcG9zc2libGUgdG8gc2V0IE1vbmFjbydzIGN1cnNvciBwb3NpdGlvbjpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9tb25hY28tZWRpdG9yL2lzc3Vlcy8yNThcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IgPSBhc3luYyAoX3NlbGVjdG9yLCBfd3JhcCwgX3Vud3JhcCwgX2xpbmUsIF9jb2x1bW4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZWxlbSA9IGU7XG4gICAgICAgIC8vIEZpbmQgdGhlIG1vbmFjbyBlbGVtZW50IHRoYXQgaG9sZHMgdGhlIGRhdGFcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuZWxlbS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB3aGlsZSAoISh0aGlzLmVsZW0uY2xhc3NOYW1lLm1hdGNoKC9tb25hY28tZWRpdG9yL2dpKVxuICAgICAgICAgICAgJiYgdGhpcy5lbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtdXJpXCIpLm1hdGNoKFwiZmlsZTovL3xpbm1lbW9yeTovL3xnaXRsYWI6XCIpKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtID0gcGFyZW50O1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIG1hdGNoZXMoZSkge1xuICAgICAgICBsZXQgcGFyZW50ID0gZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQgIT09IHVuZGVmaW5lZCAmJiBwYXJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoKC9tb25hY28tZWRpdG9yL2dpKS50ZXN0KHBhcmVudC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLy8gVGV4dGFyZWFFZGl0b3Igc29ydCBvZiB3b3JrcyBmb3IgY29udGVudEVkaXRhYmxlIGVsZW1lbnRzIGJ1dCB0aGVyZSBzaG91bGRcbi8vIHJlYWxseSBiZSBhIGNvbnRlbnRlZGl0YWJsZS1zcGVjaWZpYyBlZGl0b3IuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGNsYXNzIFRleHRhcmVhRWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZ2V0Q29udGVudCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW0udmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5lbGVtLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucHJlZmVySFRNTCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5lbGVtLmlubmVySFRNTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZWxlbS5pbm5lclRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEN1cnNvciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENvbnRlbnQoKS50aGVuKHRleHQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBsaW5lID0gMTtcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25TdGFydCA9IHRoaXMuZWxlbS5zZWxlY3Rpb25TdGFydCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5lbGVtLnNlbGVjdGlvblN0YXJ0XG4gICAgICAgICAgICAgICAgICAgIDogMDtcbiAgICAgICAgICAgICAgICAvLyBTaWZ0IHRocm91Z2ggdGhlIHRleHQsIGNvdW50aW5nIGNvbHVtbnMgYW5kIG5ldyBsaW5lc1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGN1cnNvciA9IDA7IGN1cnNvciA8IHNlbGVjdGlvblN0YXJ0OyArK2N1cnNvcikge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW4gKz0gdGV4dC5jaGFyQ29kZUF0KGN1cnNvcikgPCAweDdGID8gMSA6IDI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0W2N1cnNvcl0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsaW5lLCBjb2x1bW5dO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TGFuZ3VhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByZWZlckhUTUwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCdodG1sJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q29udGVudCA9IGFzeW5jICh0ZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW0udmFsdWUgPSB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmVmZXJIVE1MKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldEN1cnNvciA9IGFzeW5jIChsaW5lLCBjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENvbnRlbnQoKS50aGVuKHRleHQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjaGFyYWN0ZXIgPSAwO1xuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIHRoZSBsaW5lIHRoZSBjdXJzb3Igc2hvdWxkIGJlIHB1dCBvblxuICAgICAgICAgICAgICAgIHdoaWxlIChsaW5lID4gMSAmJiBjaGFyYWN0ZXIgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dFtjaGFyYWN0ZXJdID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIHRoZSBjaGFyYWN0ZXIgYWZ0ZXIgd2hpY2ggdGhlIGN1cnNvciBzaG91bGQgYmUgbW92ZWRcbiAgICAgICAgICAgICAgICAvLyBOb3RlOiB3ZSBkb24ndCBkbyBjb2x1bW4gPSBjb2x1bW5uICsgY2hhcmFjdGVyIGJlY2F1c2UgY29sdW1uXG4gICAgICAgICAgICAgICAgLy8gbWlnaHQgYmUgbGFyZ2VyIHRoYW4gYWN0dWFsIGxpbmUgbGVuZ3RoIGFuZCBpdCdzIGJldHRlciB0byBiZSBvblxuICAgICAgICAgICAgICAgIC8vIHRoZSByaWdodCBsaW5lIGJ1dCBvbiB0aGUgd3JvbmcgY29sdW1uIHRoYW4gb24gdGhlIHdyb25nIGxpbmVcbiAgICAgICAgICAgICAgICAvLyBhbmQgd3JvbmcgY29sdW1uLlxuICAgICAgICAgICAgICAgIC8vIE1vcmVvdmVyLCBjb2x1bW4gaXMgYSBudW1iZXIgb2YgVVRGLTggYnl0ZXMgZnJvbSB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIGxpbmUgdG8gdGhlIGN1cnNvci4gSG93ZXZlciwgamF2YXNjcmlwdCB1c2VzIFVURi0xNixcbiAgICAgICAgICAgICAgICAvLyB3aGljaCBpcyAyIGJ5dGVzIHBlciBub24tYXNjaWkgY2hhcmFjdGVyLiBTbyB3aGVuIHdlIGZpbmQgYVxuICAgICAgICAgICAgICAgIC8vIGNoYXJhY3RlciB0aGF0IGlzIG1vcmUgdGhhbiAxIGJ5dGUgbG9uZywgd2UgaGF2ZSB0byByZW1vdmUgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGFtb3VudCBmcm9tIGNvbHVtbiwgYnV0IG9ubHkgdHdvIGNoYXJhY3RlcnMgZnJvbSBDSEFSQUNURVIhXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA+IDAgJiYgY2hhcmFjdGVyIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FuJ3QgaGFwcGVuLCBidXQgYmV0dGVyIGJlIHNhZmUgdGhhbiBzb3JyeVxuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dFtjaGFyYWN0ZXJdID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2RlID0gdGV4dC5jaGFyQ29kZUF0KGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2RlIDw9IDB4N2YpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiAtPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPD0gMHg3ZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiAtPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPj0gMHhkODAwICYmIGNvZGUgPD0gMHhkZmZmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4gLT0gNDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcisrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPCAweGZmZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiAtPSAzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uIC09IDQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UoY2hhcmFjdGVyLCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuZWxlbSA9IGU7XG4gICAgfVxuICAgIHN0YXRpYyBtYXRjaGVzKF8pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuLy8gQ29tcHV0ZXMgYSB1bmlxdWUgc2VsZWN0b3IgZm9yIGl0cyBhcmd1bWVudC5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlU2VsZWN0b3IoZWxlbWVudCkge1xuICAgIGZ1bmN0aW9uIHVuaXF1ZVNlbGVjdG9yKGUpIHtcbiAgICAgICAgLy8gT25seSBtYXRjaGluZyBhbHBoYW51bWVyaWMgc2VsZWN0b3JzIGJlY2F1c2Ugb3RoZXJzIGNoYXJzIG1pZ2h0IGhhdmUgc3BlY2lhbCBtZWFuaW5nIGluIENTU1xuICAgICAgICBpZiAoZS5pZCAmJiBlLmlkLm1hdGNoKFwiXlthLXpBLVowLTlfLV0rJFwiKSkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBlLnRhZ05hbWUgKyBgW2lkPVwiJHtlLmlkfVwiXWA7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpZCkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgdGhlIHRvcCBvZiB0aGUgZG9jdW1lbnRcbiAgICAgICAgaWYgKCFlLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBcIkhUTUxcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb21wdXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICBjb25zdCBpbmRleCA9IEFycmF5LmZyb20oZS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgICAgICAgICAgLmZpbHRlcihjaGlsZCA9PiBjaGlsZC50YWdOYW1lID09PSBlLnRhZ05hbWUpXG4gICAgICAgICAgICAuaW5kZXhPZihlKSArIDE7XG4gICAgICAgIHJldHVybiBgJHt1bmlxdWVTZWxlY3RvcihlLnBhcmVudEVsZW1lbnQpfSA+ICR7ZS50YWdOYW1lfTpudGgtb2YtdHlwZSgke2luZGV4fSlgO1xuICAgIH1cbiAgICByZXR1cm4gdW5pcXVlU2VsZWN0b3IoZWxlbWVudCk7XG59XG4vLyBSdW5zIENPREUgaW4gdGhlIHBhZ2UncyBjb250ZXh0IGJ5IHNldHRpbmcgdXAgYSBjdXN0b20gZXZlbnQgbGlzdGVuZXIsXG4vLyBlbWJlZGRpbmcgYSBzY3JpcHQgZWxlbWVudCB0aGF0IHJ1bnMgdGhlIHBpZWNlIG9mIGNvZGUgYW5kIGVtaXRzIGl0cyByZXN1bHRcbi8vIGFzIGFuIGV2ZW50LlxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlSW5QYWdlKGNvZGUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBjb25zdCBldmVudElkID0gYCR7TWF0aC5yYW5kb20oKX1gO1xuICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gYChhc3luYyAoZXZJZCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgdW53cmFwID0geCA9PiB4O1xuICAgICAgICAgICAgICAgIGxldCB3cmFwID0geCA9PiB4O1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgJHtjb2RlfTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZJZCwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2SWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IHN1Y2Nlc3M6IGZhbHNlLCByZWFzb246IGUgfSxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCR7SlNPTi5zdHJpbmdpZnkoZXZlbnRJZCl9KWA7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50SWQsICh7IGRldGFpbCB9KSA9PiB7XG4gICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgaWYgKGRldGFpbC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGV0YWlsLnJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGRldGFpbC5yZWFzb24pO1xuICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXAoeCkge1xuICAgIGlmICh3aW5kb3cud3JhcHBlZEpTT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB4LndyYXBwZWRKU09iamVjdDtcbiAgICB9XG4gICAgcmV0dXJuIHg7XG59XG5leHBvcnQgZnVuY3Rpb24gd3JhcCh4KSB7XG4gICAgaWYgKHdpbmRvdy5YUENOYXRpdmVXcmFwcGVyKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuWFBDTmF0aXZlV3JhcHBlcih4KTtcbiAgICB9XG4gICAgcmV0dXJuIHg7XG59XG47XG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yKGVsZW0sIG9wdGlvbnMpIHtcbiAgICBsZXQgZWRpdG9yO1xuICAgIGZvciAobGV0IGNsYXp6IG9mIFtBY2VFZGl0b3IsIENvZGVNaXJyb3JFZGl0b3IsIE1vbmFjb0VkaXRvcl0pIHtcbiAgICAgICAgaWYgKGNsYXp6Lm1hdGNoZXMoZWxlbSkpIHtcbiAgICAgICAgICAgIGVkaXRvciA9IGNsYXp6O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGV4dGFyZWFFZGl0b3IoZWxlbSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGxldCBlZCA9IG5ldyBlZGl0b3IoZWxlbSwgb3B0aW9ucyk7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAod2luZG93LndyYXBwZWRKU09iamVjdCkge1xuICAgICAgICByZXN1bHQgPSBuZXcgUHJveHkoZWQsIHtcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdKGNvbXB1dGVTZWxlY3Rvcih0YXJnZXQuZ2V0RWxlbWVudCgpKSwgd3JhcCwgdW53cmFwLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBuZXcgUHJveHkoZWQsIHtcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSBcImdldEVsZW1lbnRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dGVJblBhZ2UoYCgke3RhcmdldFtwcm9wXX0pKCR7SlNPTi5zdHJpbmdpZnkoY29tcHV0ZVNlbGVjdG9yKHRhcmdldC5nZXRFbGVtZW50KCkpKX0sIHggPT4geCwgeCA9PiB4LCAuLi4ke0pTT04uc3RyaW5naWZ5KGFyZ3MpfSlgKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIlxuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlcjxUIGV4dGVuZHMgc3RyaW5nLCBVIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkPiB7XG4gICAgcHJpdmF0ZSBsaXN0ZW5lcnMgPSBuZXcgTWFwPFQsIFVbXT4oKTtcblxuICAgIG9uKGV2ZW50OiBULCBoYW5kbGVyOiBVKSB7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHRoaXMubGlzdGVuZXJzLmdldChldmVudCk7XG4gICAgICAgIGlmIChoYW5kbGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBoYW5kbGVycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KGV2ZW50LCBoYW5kbGVycyk7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBlbWl0KGV2ZW50OiBULCAuLi5kYXRhOiBhbnkpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQoZXZlbnQpO1xuICAgICAgICBpZiAoaGFuZGxlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JzIDogRXJyb3JbXSA9IFtdO1xuICAgICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoLi4uZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIEVycm9yIGNvbmRpdGlvbnMgaGVyZSBhcmUgaW1wb3NzaWJsZSB0byB0ZXN0IGZvciBmcm9tIHNlbGVuaXVtXG4gICAgICAgICAgICAgKiBiZWNhdXNlIGl0IHdvdWxkIGFyaXNlIGZyb20gdGhlIHdyb25nIHVzZSBvZiB0aGUgQVBJLCB3aGljaCB3ZVxuICAgICAgICAgICAgICogY2FuJ3Qgc2hpcCBpbiB0aGUgZXh0ZW5zaW9uLCBzbyBkb24ndCB0cnkgdG8gaW5zdHJ1bWVudC4gKi9cbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyb3JzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBnZXRDb25mIH0gZnJvbSBcIi4vdXRpbHMvY29uZmlndXJhdGlvblwiXG5pbXBvcnQgeyBjb21wdXRlU2VsZWN0b3IgfSBmcm9tIFwiLi91dGlscy91dGlsc1wiO1xuaW1wb3J0IHsgQWJzdHJhY3RFZGl0b3IgfSBmcm9tIFwiZWRpdG9yLWFkYXB0ZXIvQWJzdHJhY3RFZGl0b3JcIjtcbmltcG9ydCB7IGdldEVkaXRvciB9IGZyb20gXCJlZGl0b3ItYWRhcHRlclwiO1xuXG5leHBvcnQgY2xhc3MgRmlyZW52aW1FbGVtZW50IHtcblxuICAgIC8vIGVkaXRvciBpcyBhbiBvYmplY3QgdGhhdCBwcm92aWRlcyBhbiBpbnRlcmZhY2UgdG8gaW50ZXJhY3QgKGUuZy5cbiAgICAvLyByZXRyaWV2ZS9zZXQgY29udGVudCwgcmV0cmlldmUvc2V0IGN1cnNvciBwb3NpdGlvbikgY29uc2lzdGVudGx5IHdpdGhcbiAgICAvLyB1bmRlcmx5aW5nIGVsZW1lbnRzIChiZSB0aGV5IHNpbXBsZSB0ZXh0YXJlYXMsIENvZGVNaXJyb3IgZWxlbWVudHMgb3JcbiAgICAvLyBvdGhlcikuXG4gICAgcHJpdmF0ZSBlZGl0b3I6IEFic3RyYWN0RWRpdG9yO1xuICAgIC8vIGZvY3VzSW5mbyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgZm9jdXMgbGlzdGVuZXJzIGFuZCB0aW1lb3V0cyBjcmVhdGVkXG4gICAgLy8gYnkgRmlyZW52aW1FbGVtZW50LmZvY3VzKCkuIEZpcmVudmltRWxlbWVudC5mb2N1cygpIGNyZWF0ZXMgdGhlc2VcbiAgICAvLyBsaXN0ZW5lcnMgYW5kIHRpbWVvdXRzIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kIHBhZ2VzIHRoYXQgdHJ5IHRvIGdyYWJcbiAgICAvLyB0aGUgZm9jdXMgYWdhaW4gYWZ0ZXIgdGhlIEZpcmVudmltRWxlbWVudCBoYXMgYmVlbiBjcmVhdGVkIG9yIGFmdGVyIHRoZVxuICAgIC8vIHVuZGVybHlpbmcgZWxlbWVudCdzIGNvbnRlbnQgaGFzIGNoYW5nZWQuXG4gICAgcHJpdmF0ZSBmb2N1c0luZm8gPSB7XG4gICAgICAgIGZpbmFsUmVmb2N1c1RpbWVvdXRzOiBbXSBhcyBhbnlbXSxcbiAgICAgICAgcmVmb2N1c1JlZnM6IFtdIGFzIGFueVtdLFxuICAgICAgICByZWZvY3VzVGltZW91dHM6IFtdIGFzIGFueVtdLFxuICAgIH07XG4gICAgLy8gZnJhbWVJZCBpcyB0aGUgd2ViZXh0ZW5zaW9uIGlkIG9mIHRoZSBuZW92aW0gZnJhbWUuIFdlIHVzZSBpdCB0byBzZW5kXG4gICAgLy8gY29tbWFuZHMgdG8gdGhlIGZyYW1lLlxuICAgIHByaXZhdGUgZnJhbWVJZDogbnVtYmVyO1xuICAgIC8vIGZyYW1lSWRQcm9taXNlIGlzIGEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSB0byB0aGUgZnJhbWVJZC4gVGhlXG4gICAgLy8gZnJhbWVJZCBjYW4ndCBiZSByZXRyaWV2ZWQgc3luY2hyb25vdXNseSBhcyBpdCBuZWVkcyB0byBiZSBzZW50IGJ5IHRoZVxuICAgIC8vIGJhY2tncm91bmQgc2NyaXB0LlxuICAgIHByaXZhdGUgZnJhbWVJZFByb21pc2U6IFByb21pc2U8bnVtYmVyPjtcbiAgICAvLyBpZnJhbWUgaXMgdGhlIE5lb3ZpbSBmcmFtZS4gVGhpcyBpcyB0aGUgZWxlbWVudCB0aGF0IHJlY2VpdmVzIGFsbCBpbnB1dHNcbiAgICAvLyBhbmQgZGlzcGxheXMgdGhlIGVkaXRvci5cbiAgICBwdWJsaWMgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudDtcbiAgICAvLyBXZSB1c2UgYW4gaW50ZXJzZWN0aW9uT2JzZXJ2ZXIgdG8gZGV0ZWN0IHdoZW4gdGhlIGVsZW1lbnQgdGhlXG4gICAgLy8gRmlyZW52aW1FbGVtZW50IGlzIHRpZWQgYmVjb21lcyBpbnZpc2libGUuIFdoZW4gdGhpcyBoYXBwZW5zLFxuICAgIC8vIHdlIGhpZGUgdGhlIEZpcmVudmltRWxlbWVudCBmcm9tIHRoZSBwYWdlLlxuICAgIHByaXZhdGUgaW50ZXJzZWN0aW9uT2JzZXJ2ZXI6IEludGVyc2VjdGlvbk9ic2VydmVyO1xuICAgIC8vIFdlIHVzZSBhIG11dGF0aW9uIG9ic2VydmVyIHRvIGRldGVjdCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIHJlbW92ZWQgZnJvbVxuICAgIC8vIHRoZSBwYWdlLiBXaGVuIHRoaXMgaGFwcGVucywgdGhlIEZpcmVudmltRWxlbWVudCBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAgLy8gcGFnZS5cbiAgICBwcml2YXRlIHBhZ2VPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcbiAgICAvLyBXZSB1c2UgYSBtdXRhdGlvbiBvYnNlcnZlciB0byBkZXRlY3QgaWYgdGhlIHNwYW4gaXMgcmVtb3ZlZCBmcm9tIHRoZVxuICAgIC8vIHBhZ2UgYnkgdGhlIHBhZ2UuIFdoZW4gdGhpcyBoYXBwZW5zLCB0aGUgc3BhbiBpcyByZS1pbnNlcnRlZCBpbiB0aGVcbiAgICAvLyBwYWdlLlxuICAgIHByaXZhdGUgc3Bhbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xuICAgIC8vIG52aW1pZnkgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgbGlzdGVucyBmb3IgZm9jdXMgZXZlbnRzIGFuZCBjcmVhdGVzXG4gICAgLy8gZmlyZW52aW0gZWxlbWVudHMuIFdlIG5lZWQgaXQgaW4gb3JkZXIgdG8gYmUgYWJsZSB0byByZW1vdmUgaXQgYXMgYW5cbiAgICAvLyBldmVudCBsaXN0ZW5lciBmcm9tIHRoZSBlbGVtZW50IHRoZSB1c2VyIHNlbGVjdGVkIHdoZW4gdGhlIHVzZXIgd2FudHMgdG9cbiAgICAvLyBzZWxlY3QgdGhhdCBlbGVtZW50IGFnYWluLlxuICAgIHByaXZhdGUgbnZpbWlmeTogKGV2dDogeyB0YXJnZXQ6IEV2ZW50VGFyZ2V0IH0pID0+IFByb21pc2U8dm9pZD47XG4gICAgLy8gb3JpZ2luYWxFbGVtZW50IGlzIHRoZSBlbGVtZW50IGEgZm9jdXMgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIG9uLiBXZVxuICAgIC8vIHVzZSBpdCB0byByZXRyaWV2ZSB0aGUgZWxlbWVudCB0aGUgZWRpdG9yIHNob3VsZCBhcHBlYXIgb3ZlciAoZS5nLiwgaWZcbiAgICAvLyBlbGVtIGlzIGFuIGVsZW1lbnQgaW5zaWRlIGEgQ29kZU1pcnJvciBlZGl0b3IsIGVsZW0gd2lsbCBiZSBhIHNtYWxsXG4gICAgLy8gaW52aXNpYmxlIHRleHRhcmVhIGFuZCB3aGF0IHdlIHJlYWxseSB3YW50IHRvIHB1dCB0aGUgRmlyZW52aW0gZWxlbWVudFxuICAgIC8vIG92ZXIgaXMgdGhlIHBhcmVudCBkaXYgdGhhdCBjb250YWlucyBpdCkgYW5kIHRvIGdpdmUgZm9jdXMgYmFjayB0byB0aGVcbiAgICAvLyBwYWdlIHdoZW4gdGhlIHVzZXIgYXNrcyBmb3IgdGhhdC5cbiAgICBwcml2YXRlIG9yaWdpbmFsRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgLy8gcmVzaXplT2JzZXJ2ZXIgaXMgdXNlZCBpbiBvcmRlciB0byBkZXRlY3Qgd2hlbiB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudFxuICAgIC8vIGJlaW5nIGVkaXRlZCBjaGFuZ2VkLiBXaGVuIHRoaXMgaGFwcGVucywgd2UgcmVzaXplIHRoZSBuZW92aW0gZnJhbWUuXG4gICAgLy8gVE9ETzogcGVyaW9kaWNhbGx5IGNoZWNrIGlmIE1TIGltcGxlbWVudGVkIGEgUmVzaXplT2JzZXJ2ZXIgdHlwZVxuICAgIHByaXZhdGUgcmVzaXplT2JzZXJ2ZXI6IGFueTtcbiAgICAvLyBzcGFuIGlzIHRoZSBzcGFuIGVsZW1lbnQgd2UgdXNlIGluIG9yZGVyIHRvIGluc2VydCB0aGUgbmVvdmltIGZyYW1lIGluXG4gICAgLy8gdGhlIHBhZ2UuIFRoZSBuZW92aW0gZnJhbWUgaXMgYXR0YWNoZWQgdG8gaXRzIHNoYWRvdyBkb20uIFVzaW5nIGEgc3BhblxuICAgIC8vIGlzIG11Y2ggbGVzcyBkaXNydXB0aXZlIHRvIHRoZSBwYWdlIGFuZCBlbmFibGVzIGEgbW9kaWN1bSBvZiBwcml2YWN5XG4gICAgLy8gKHRoZSBwYWdlIHdvbid0IGJlIGFibGUgdG8gY2hlY2sgd2hhdCdzIGluIGl0KS4gSW4gZmlyZWZveCwgcGFnZXMgd2lsbFxuICAgIC8vIHN0aWxsIGJlIGFibGUgdG8gZGV0ZWN0IHRoZSBuZW92aW0gZnJhbWUgYnkgdXNpbmcgd2luZG93LmZyYW1lcyB0aG91Z2guXG4gICAgcHJpdmF0ZSBzcGFuOiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgLy8gcmVzaXplUmVxSWQga2VlcHMgdHJhY2sgb2YgdGhlIG51bWJlciBvZiByZXNpemluZyByZXF1ZXN0cyB0aGF0IGFyZSBzZW50XG4gICAgLy8gdG8gdGhlIGlmcmFtZS4gV2Ugc2VuZCBhbmQgaW5jcmVtZW50IGl0IGZvciBldmVyeSByZXNpemUgcmVxdWVzdHMsIHRoaXNcbiAgICAvLyBsZXRzIHRoZSBpZnJhbWUga25vdyB3aGF0IHRoZSBtb3N0IHJlY2VudGx5IHNlbnQgcmVzaXplIHJlcXVlc3QgaXMgYW5kXG4gICAgLy8gdGh1cyBhdm9pZHMgcmVhY3RpbmcgdG8gYW4gb2xkZXIgcmVzaXplIHJlcXVlc3QgaWYgYSBtb3JlIHJlY2VudCBoYXNcbiAgICAvLyBhbHJlYWR5IGJlZW4gcHJvY2Vzc2VkLlxuICAgIHByaXZhdGUgcmVzaXplUmVxSWQgPSAwO1xuICAgIC8vIHJlbGF0aXZlWC9ZIGlzIHRoZSBwb3NpdGlvbiB0aGUgaWZyYW1lIHNob3VsZCBoYXZlIHJlbGF0aXZlIHRvIHRoZSBpbnB1dFxuICAgIC8vIGVsZW1lbnQgaW4gb3JkZXIgdG8gYmUgYm90aCBhcyBjbG9zZSBhcyBwb3NzaWJsZSB0byB0aGUgaW5wdXQgZWxlbWVudFxuICAgIC8vIGFuZCBmaXQgaW4gdGhlIHdpbmRvdyB3aXRob3V0IG92ZXJmbG93aW5nIG91dCBvZiB0aGUgdmlld3BvcnQuXG4gICAgcHJpdmF0ZSByZWxhdGl2ZVggPSAwO1xuICAgIHByaXZhdGUgcmVsYXRpdmVZID0gMDtcbiAgICAvLyBmaXJzdFB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbiBrZWVwcyB0cmFjayBvZiB3aGV0aGVyIHRoaXMgaXMgdGhlXG4gICAgLy8gZmlyc3QgdGltZSB0aGUgcHV0RWRpdG9yQ2xvc2VUb0lucHV0T3JpZ2luIGZ1bmN0aW9uIGlzIGNhbGxlZCBmcm9tIHRoZVxuICAgIC8vIGlmcmFtZS4gU2VlIHB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbkFmdGVyUmVzaXplRnJvbUZyYW1lKCkgZm9yIG1vcmVcbiAgICAvLyBpbmZvcm1hdGlvbi5cbiAgICBwcml2YXRlIGZpcnN0UHV0RWRpdG9yQ2xvc2VUb0lucHV0T3JpZ2luID0gdHJ1ZTtcbiAgICAvLyBvbkRldGFjaCBpcyBhIGNhbGxiYWNrIHByb3ZpZGVkIGJ5IHRoZSBjb250ZW50IHNjcmlwdCB3aGVuIGl0IGNyZWF0ZXNcbiAgICAvLyB0aGUgRmlyZW52aW1FbGVtZW50LiBJdCBpcyBjYWxsZWQgd2hlbiB0aGUgZGV0YWNoKCkgZnVuY3Rpb24gaXMgY2FsbGVkLFxuICAgIC8vIGFmdGVyIGFsbCBGaXJlbnZpbSBlbGVtZW50cyBoYXZlIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYWdlLlxuICAgIHByaXZhdGUgb25EZXRhY2g6IChpZDogbnVtYmVyKSA9PiBhbnk7XG4gICAgLy8gYnVmZmVySW5mbzogYSBbdXJsLCBzZWxlY3RvciwgY3Vyc29yLCBsYW5nXSB0dXBsZSBpbmRpY2F0aW5nIHRoZSBwYWdlXG4gICAgLy8gdGhlIGxhc3QgaWZyYW1lIHdhcyBjcmVhdGVkIG9uLCB0aGUgc2VsZWN0b3Igb2YgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAvLyB0ZXh0YXJlYSBhbmQgdGhlIGNvbHVtbi9saW5lIG51bWJlciBvZiB0aGUgY3Vyc29yLlxuICAgIC8vIE5vdGUgdGhhdCB0aGVzZSBhcmUgX19kZWZhdWx0X18gdmFsdWVzLiBSZWFsIHZhbHVlcyBtdXN0IGJlIGNyZWF0ZWQgd2l0aFxuICAgIC8vIHByZXBhcmVCdWZmZXJJbmZvKCkuIFRoZSByZWFzb24gd2UncmUgbm90IGRvaW5nIHRoaXMgZnJvbSB0aGVcbiAgICAvLyBjb25zdHJ1Y3RvciBpcyB0aGF0IGl0J3MgZXhwZW5zaXZlIGFuZCBkaXNydXB0aXZlIC0gZ2V0dGluZyB0aGlzXG4gICAgLy8gaW5mb3JtYXRpb24gcmVxdWlyZXMgZXZhbHVhdGluZyBjb2RlIGluIHRoZSBwYWdlJ3MgY29udGV4dC5cbiAgICBwcml2YXRlIGJ1ZmZlckluZm8gPSAoUHJvbWlzZS5yZXNvbHZlKFtcIlwiLCBcIlwiLCBbMSwgMV0sIHVuZGVmaW5lZF0pIGFzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2U8W3N0cmluZywgc3RyaW5nLCBbbnVtYmVyLCBudW1iZXJdLCBzdHJpbmddPik7XG4gICAgLy8gY3Vyc29yOiBsYXN0IGtub3duIGN1cnNvciBwb3NpdGlvbi4gVXBkYXRlZCBvbiBnZXRQYWdlRWxlbWVudEN1cnNvciBhbmRcbiAgICAvLyBzZXRQYWdlRWxlbWVudEN1cnNvclxuICAgIHByaXZhdGUgY3Vyc29yID0gWzEsIDFdIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblxuICAgIC8vIGVsZW0gaXMgdGhlIGVsZW1lbnQgdGhhdCByZWNlaXZlZCB0aGUgZm9jdXNFdmVudC5cbiAgICAvLyBOdmltaWZ5IGlzIHRoZSBmdW5jdGlvbiB0aGF0IGxpc3RlbnMgZm9yIGZvY3VzIGV2ZW50cy4gV2UgbmVlZCB0byBrbm93XG4gICAgLy8gYWJvdXQgaXQgaW4gb3JkZXIgdG8gcmVtb3ZlIGl0IGJlZm9yZSBmb2N1c2luZyBlbGVtIChvdGhlcndpc2Ugd2UnbGxcbiAgICAvLyBqdXN0IGdyYWIgZm9jdXMgYWdhaW4pLlxuICAgIGNvbnN0cnVjdG9yIChlbGVtOiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IChldnQ6IHsgdGFyZ2V0OiBFdmVudFRhcmdldCB9KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICBvbkRldGFjaDogKGlkOiBudW1iZXIpID0+IGFueSkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsRWxlbWVudCA9IGVsZW07XG4gICAgICAgIHRoaXMubnZpbWlmeSA9IGxpc3RlbmVyO1xuICAgICAgICB0aGlzLm9uRGV0YWNoID0gb25EZXRhY2g7XG4gICAgICAgIHRoaXMuZWRpdG9yID0gZ2V0RWRpdG9yKGVsZW0sIHtcbiAgICAgICAgICAgIHByZWZlckhUTUw6IGdldENvbmYoKS5jb250ZW50ID09IFwiaHRtbFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3BhbiA9IGVsZW1cbiAgICAgICAgICAgIC5vd25lckRvY3VtZW50XG4gICAgICAgICAgICAuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiLCBcInNwYW5cIik7XG4gICAgICAgIHRoaXMuaWZyYW1lID0gZWxlbVxuICAgICAgICAgICAgLm93bmVyRG9jdW1lbnRcbiAgICAgICAgICAgIC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsIFwiaWZyYW1lXCIpIGFzIEhUTUxJRnJhbWVFbGVtZW50O1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlcmUgaXNuJ3QgYW55IGV4dHJhIHdpZHRoL2hlaWdodFxuICAgICAgICB0aGlzLmlmcmFtZS5zdHlsZS5wYWRkaW5nID0gXCIwcHhcIjtcbiAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGUuYm9yZGVyID0gXCIwcHhcIjtcbiAgICAgICAgLy8gV2Ugc3RpbGwgbmVlZCBhIGJvcmRlciwgdXNlIGEgc2hhZG93IGZvciB0aGF0XG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmJveFNoYWRvdyA9IFwiMHB4IDBweCAxcHggMXB4IGJsYWNrXCI7XG4gICAgfVxuXG4gICAgYXR0YWNoVG9QYWdlIChmaXA6IFByb21pc2U8bnVtYmVyPikge1xuICAgICAgICB0aGlzLmZyYW1lSWRQcm9taXNlID0gZmlwLnRoZW4oKGY6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5mcmFtZUlkID0gZjtcbiAgICAgICAgICAgIC8vIE9uY2UgYSBmcmFtZUlkIGhhcyBiZWVuIGFjcXVpcmVkLCB0aGUgRmlyZW52aW1FbGVtZW50IHdvdWxkIGRpZVxuICAgICAgICAgICAgLy8gaWYgaXRzIHNwYW4gd2FzIHJlbW92ZWQgZnJvbSB0aGUgcGFnZS4gVGh1cyB0aGVyZSBpcyBubyB1c2UgaW5cbiAgICAgICAgICAgIC8vIGtlZXBpbmcgaXRzIHNwYW5PYnNlcnZlciBhcm91bmQuIEl0J2QgZXZlbiBjYXVzZSBpc3N1ZXMgYXMgdGhlXG4gICAgICAgICAgICAvLyBzcGFuT2JzZXJ2ZXIgd291bGQgYXR0ZW1wdCB0byByZS1pbnNlcnQgYSBkZWFkIGZyYW1lIGluIHRoZVxuICAgICAgICAgICAgLy8gcGFnZS5cbiAgICAgICAgICAgIHRoaXMuc3Bhbk9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyYW1lSWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IG5lZWQgdGhlIGlmcmFtZSB0byBiZSBhcHBlbmRlZCB0byB0aGUgcGFnZSBpbiBvcmRlciB0b1xuICAgICAgICAvLyByZXNpemUgaXQgYmVjYXVzZSB3ZSdyZSBqdXN0IHVzaW5nIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgICAgIC8vIGlucHV0L3RleHRhcmVhJ3Mgc2l6ZVxuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuZ2V0RWxlbWVudCgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnJlc2l6ZVRvKHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0LCBmYWxzZSk7XG4gICAgICAgIHRoaXMucmVsYXRpdmVYID0gMDtcbiAgICAgICAgdGhpcy5yZWxhdGl2ZVkgPSAwO1xuICAgICAgICB0aGlzLnB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbigpO1xuXG4gICAgICAgIC8vIFVzZSBhIFJlc2l6ZU9ic2VydmVyIHRvIGRldGVjdCB3aGVuIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQnc1xuICAgICAgICAvLyBzaXplIGNoYW5nZXMgYW5kIGNoYW5nZSB0aGUgc2l6ZSBvZiB0aGUgRmlyZW52aW1FbGVtZW50XG4gICAgICAgIC8vIGFjY29yZGluZ2x5XG4gICAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIgPSBuZXcgKCh3aW5kb3cgYXMgYW55KS5SZXNpemVPYnNlcnZlcikoKChzZWxmKSA9PiBhc3luYyAoZW50cmllczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllcy5maW5kKChlbnQ6IGFueSkgPT4gZW50LnRhcmdldCA9PT0gc2VsZi5nZXRFbGVtZW50KCkpO1xuICAgICAgICAgICAgaWYgKHNlbGYuZnJhbWVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5mcmFtZUlkUHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JlY3QgPSB0aGlzLmdldEVsZW1lbnQoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVjdC53aWR0aCA9PT0gbmV3UmVjdC53aWR0aCAmJiByZWN0LmhlaWdodCA9PT0gbmV3UmVjdC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWN0ID0gbmV3UmVjdDtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc2l6ZVRvKHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgc2VsZi5wdXRFZGl0b3JDbG9zZVRvSW5wdXRPcmlnaW4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc2l6ZVJlcUlkICs9IDE7XG4gICAgICAgICAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVJZDogc2VsZi5mcmFtZUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtzZWxmLnJlc2l6ZVJlcUlkLCByZWN0LndpZHRoLCByZWN0LmhlaWdodF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6IFtcInJlc2l6ZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6IFtcIm1lc3NhZ2VGcmFtZVwiXSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkodGhpcykpO1xuICAgICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLm9ic2VydmUodGhpcy5nZXRFbGVtZW50KCksIHsgYm94OiBcImJvcmRlci1ib3hcIiB9KTtcblxuICAgICAgICB0aGlzLmlmcmFtZS5zcmMgPSAoYnJvd3NlciBhcyBhbnkpLmV4dGVuc2lvbi5nZXRVUkwoXCIvaW5kZXguaHRtbFwiKTtcbiAgICAgICAgdGhpcy5zcGFuLmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwiY2xvc2VkXCIgfSkuYXBwZW5kQ2hpbGQodGhpcy5pZnJhbWUpO1xuXG4gICAgICAgIC8vIFNvIHBhZ2VzIChlLmcuIEppcmEsIENvbmZsdWVuY2UpIHJlbW92ZSBzcGFucyBmcm9tIHRoZSBwYWdlIGFzIHNvb25cbiAgICAgICAgLy8gYXMgdGhleSdyZSBpbnNlcnRlZC4gV2UgZG9uJ3Qgd2FudCB0aGF0LCBzbyBmb3IgdGhlIDUgc2Vjb25kc1xuICAgICAgICAvLyBmb2xsb3dpbmcgdGhlIGluc2VydGlvbiwgZGV0ZWN0IGlmIHRoZSBzcGFuIGlzIHJlbW92ZWQgZnJvbSB0aGUgcGFnZVxuICAgICAgICAvLyBieSBjaGVja2luZyB2aXNpYmlsaXR5IGNoYW5nZXMgYW5kIHJlLWluc2VydCBpZiBuZWVkZWQuXG4gICAgICAgIGxldCByZWluc2VydHMgPSAwO1xuICAgICAgICB0aGlzLnNwYW5PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgICAgICAgKHNlbGYgPT4gKG11dGF0aW9ucyA6IE11dGF0aW9uUmVjb3JkW10sIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzcGFuID0gc2VsZi5nZXRTcGFuKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtdXRhdGlvbi5yZW1vdmVkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgPT09IHNwYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlaW5zZXJ0cyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlaW5zZXJ0cyA+PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGaXJlbnZpbSBpcyB0cnlpbmcgdG8gY3JlYXRlIGFuIGlmcmFtZSBvbiB0aGlzIHNpdGUgYnV0IHRoZSBwYWdlIGlzIGNvbnN0YW50bHkgcmVtb3ZpbmcgaXQuIENvbnNpZGVyIGRpc2FibGluZyBGaXJlbnZpbSBvbiB0aGlzIHdlYnNpdGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzZWxmLmdldEVsZW1lbnQoKS5vd25lckRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3BhbiksIHJlaW5zZXJ0cyAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zcGFuT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmdldEVsZW1lbnQoKS5vd25lckRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlIH0pO1xuXG4gICAgICAgIGxldCBwYXJlbnRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50KCkub3duZXJEb2N1bWVudC5ib2R5O1xuICAgICAgICAvLyBXZSBjYW4ndCBpbnNlcnQgdGhlIGZyYW1lIGluIHRoZSBib2R5IGlmIHRoZSBlbGVtZW50IHdlJ3JlIGdvaW5nIHRvXG4gICAgICAgIC8vIHJlcGxhY2UgdGhlIGNvbnRlbnQgb2YgaXMgdGhlIGJvZHksIGFzIHJlcGxhY2luZyB0aGUgY29udGVudCB3b3VsZFxuICAgICAgICAvLyBkZXN0cm95IHRoZSBmcmFtZS5cbiAgICAgICAgaWYgKHBhcmVudEVsZW1lbnQgPT09IHRoaXMuZ2V0RWxlbWVudCgpKSB7XG4gICAgICAgICAgICBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zcGFuKTtcblxuICAgICAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICAgICAgLy8gSXQgaXMgcHJldHR5IGhhcmQgdG8gdGVsbCB3aGVuIGFuIGVsZW1lbnQgZGlzYXBwZWFycyBmcm9tIHRoZSBwYWdlXG4gICAgICAgIC8vIChlaXRoZXIgYnkgYmVpbmcgcmVtb3ZlZCBvciBieSBiZWluZyBoaWRkZW4gYnkgb3RoZXIgZWxlbWVudHMpLCBzb1xuICAgICAgICAvLyB3ZSB1c2UgYW4gaW50ZXJzZWN0aW9uIG9ic2VydmVyLCB3aGljaCBpcyB0cmlnZ2VyZWQgZXZlcnkgdGltZSB0aGVcbiAgICAgICAgLy8gZWxlbWVudCBiZWNvbWVzIG1vcmUgb3IgbGVzcyB2aXNpYmxlLlxuICAgICAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChzZWxmID0+ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLmdldEVsZW1lbnQoKTtcbiAgICAgICAgICAgIC8vIElmIGVsZW0gZG9lc24ndCBoYXZlIGEgcmVjdCBhbnltb3JlLCBpdCdzIGhpZGRlblxuICAgICAgICAgICAgaWYgKGVsZW0uZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKHRoaXMpLCB7IHJvb3Q6IG51bGwsIHRocmVzaG9sZDogMC4xIH0pO1xuICAgICAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyLm9ic2VydmUodGhpcy5nZXRFbGVtZW50KCkpO1xuXG4gICAgICAgIC8vIFdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBGaXJlbnZpbUVsZW1lbnQgZnJvbSB0aGUgcGFnZSB3aGVuIHRoZVxuICAgICAgICAvLyBjb3JyZXNwb25kaW5nIGVsZW1lbnQgaXMgcmVtb3ZlZC4gV2UgZG8gdGhpcyBieSBhZGRpbmcgYVxuICAgICAgICAvLyBtdXRhdGlvbk9ic2VydmVyIHRvIGl0cyBwYXJlbnQuXG4gICAgICAgIHRoaXMucGFnZU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKHNlbGYgPT4gKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHNlbGYuZ2V0RWxlbWVudCgpO1xuICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2gobXV0YXRpb24gPT4gbXV0YXRpb24ucmVtb3ZlZE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihub2RlLCBOb2RlRmlsdGVyLlNIT1dfQUxMKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAod2Fsa2VyLm5leHROb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdhbGtlci5jdXJyZW50Tm9kZSA9PT0gZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzZWxmLmRldGFjaEZyb21QYWdlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KSh0aGlzKSk7XG4gICAgICAgIHRoaXMucGFnZU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNsZWFyRm9jdXNMaXN0ZW5lcnMgKCkge1xuICAgICAgICAvLyBXaGVuIHRoZSB1c2VyIHRyaWVzIHRvIGA6dyB8IGNhbGwgZmlyZW52aW0jZm9jdXNfcGFnZSgpYCBpbiBOZW92aW0sXG4gICAgICAgIC8vIHdlIGhhdmUgYSBwcm9ibGVtLiBgOndgIHJlc3VsdHMgaW4gYSBjYWxsIHRvIHNldFBhZ2VFbGVtZW50Q29udGVudCxcbiAgICAgICAgLy8gd2hpY2ggY2FsbHMgRmlyZW52aW1FbGVtZW50LmZvY3VzKCksIGJlY2F1c2Ugc29tZSBwYWdlcyB0cnkgdG8gZ3JhYlxuICAgICAgICAvLyBmb2N1cyB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSB1bmRlcmx5aW5nIGVsZW1lbnQgY2hhbmdlcy5cbiAgICAgICAgLy8gRmlyZW52aW1FbGVtZW50LmZvY3VzKCkgY3JlYXRlcyBldmVudCBsaXN0ZW5lcnMgYW5kIHRpbWVvdXRzIHRvXG4gICAgICAgIC8vIGRldGVjdCB3aGVuIHRoZSBwYWdlIHRyaWVzIHRvIGdyYWIgZm9jdXMgYW5kIGJyaW5nIGl0IGJhY2sgdG8gdGhlXG4gICAgICAgIC8vIEZpcmVudmltRWxlbWVudC4gQnV0IHNpbmNlIGBjYWxsIGZpcmVudmltI2ZvY3VzX3BhZ2UoKWAgaGFwcGVuc1xuICAgICAgICAvLyByaWdodCBhZnRlciB0aGUgYDp3YCwgZm9jdXNfcGFnZSgpIHRyaWdnZXJzIHRoZSBldmVudFxuICAgICAgICAvLyBsaXN0ZW5lcnMvdGltZW91dHMgY3JlYXRlZCBieSBGaXJlbnZpbUVsZW1lbnQuZm9jdXMoKSFcbiAgICAgICAgLy8gU28gd2UgbmVlZCBhIHdheSB0byBjbGVhciB0aGUgdGltZW91dHMgYW5kIGV2ZW50IGxpc3RlbmVycyBiZWZvcmVcbiAgICAgICAgLy8gcGVyZm9ybWluZyBmb2N1c19wYWdlLCBhbmQgdGhhdCdzIHdoYXQgdGhpcyBmdW5jdGlvbiBkb2VzLlxuICAgICAgICB0aGlzLmZvY3VzSW5mby5maW5hbFJlZm9jdXNUaW1lb3V0cy5mb3JFYWNoKHQgPT4gY2xlYXJUaW1lb3V0KHQpKTtcbiAgICAgICAgdGhpcy5mb2N1c0luZm8ucmVmb2N1c1RpbWVvdXRzLmZvckVhY2godCA9PiBjbGVhclRpbWVvdXQodCkpO1xuICAgICAgICB0aGlzLmZvY3VzSW5mby5yZWZvY3VzUmVmcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZik7XG4gICAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgZik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZvY3VzSW5mby5maW5hbFJlZm9jdXNUaW1lb3V0cy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmZvY3VzSW5mby5yZWZvY3VzVGltZW91dHMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5mb2N1c0luZm8ucmVmb2N1c1JlZnMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBkZXRhY2hGcm9tUGFnZSAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJGb2N1c0xpc3RlbmVycygpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW0pO1xuICAgICAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyLnVub2JzZXJ2ZShlbGVtKTtcbiAgICAgICAgdGhpcy5wYWdlT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLnNwYW5PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMuc3Bhbi5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5vbkRldGFjaCh0aGlzLmZyYW1lSWQpO1xuICAgIH1cblxuICAgIGZvY3VzICgpIHtcbiAgICAgICAgLy8gU29tZSBpbnB1dHMgdHJ5IHRvIGdyYWIgdGhlIGZvY3VzIGFnYWluIGFmdGVyIHdlIGFwcGVuZGVkIHRoZSBpZnJhbWVcbiAgICAgICAgLy8gdG8gdGhlIHBhZ2UsIHNvIHdlIG5lZWQgdG8gcmVmb2N1cyBpdCBlYWNoIHRpbWUgaXQgbG9zZXMgZm9jdXMuIEJ1dFxuICAgICAgICAvLyB0aGUgdXNlciBtaWdodCB3YW50IHRvIHN0b3AgZm9jdXNpbmcgdGhlIGlmcmFtZSBhdCBzb21lIHBvaW50LCBzbyB3ZVxuICAgICAgICAvLyBhY3R1YWxseSBzdG9wIHJlZm9jdXNpbmcgdGhlIGlmcmFtZSBhIHNlY29uZCBhZnRlciBpdCBpcyBjcmVhdGVkLlxuICAgICAgICBjb25zdCByZWZvY3VzID0gKChzZWxmKSA9PiAoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLmZvY3VzSW5mby5yZWZvY3VzVGltZW91dHMucHVzaChzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCwgZGVzdHJveSBjdXJyZW50IHNlbGVjdGlvbi4gU29tZSB3ZWJzaXRlcyB1c2UgdGhlXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0aW9uIHRvIGZvcmNlLWZvY3VzIGFuIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSdzIGEgcmFjZSBjb25kaXRpb24gaW4gdGhlIHRlc3RzdWl0ZSBvbiBjaHJvbWUgdGhhdFxuICAgICAgICAgICAgICAgIC8vIHJlc3VsdHMgaW4gc2VsZi5zcGFuIG5vdCBiZWluZyBpbiB0aGUgZG9jdW1lbnQgYW5kIGVycm9yc1xuICAgICAgICAgICAgICAgIC8vIGJlaW5nIGxvZ2dlZCwgc28gd2UgY2hlY2sgaWYgc2VsZi5zcGFuIHJlYWxseSBpcyBpbiBpdHNcbiAgICAgICAgICAgICAgICAvLyBvd25lckRvY3VtZW50LlxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnNwYW4ub3duZXJEb2N1bWVudC5jb250YWlucyhzZWxmLnNwYW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLnNldFN0YXJ0KHNlbGYuc3BhbiwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xuICAgICAgICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gICAgICAgICAgICAgICAgc2VsZi5pZnJhbWUuZm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDApKTtcbiAgICAgICAgfSkodGhpcyk7XG4gICAgICAgIHRoaXMuZm9jdXNJbmZvLnJlZm9jdXNSZWZzLnB1c2gocmVmb2N1cyk7XG4gICAgICAgIHRoaXMuaWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHJlZm9jdXMpO1xuICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgcmVmb2N1cyk7XG4gICAgICAgIHRoaXMuZm9jdXNJbmZvLmZpbmFsUmVmb2N1c1RpbWVvdXRzLnB1c2goc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICByZWZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCByZWZvY3VzKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCByZWZvY3VzKTtcbiAgICAgICAgfSwgMTAwKSk7XG4gICAgICAgIHJlZm9jdXMoKTtcbiAgICB9XG5cbiAgICBmb2N1c09yaWdpbmFsRWxlbWVudCAoYWRkTGlzdGVuZXI6IGJvb2xlYW4pIHtcbiAgICAgICAgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgYW55KS5ibHVyKCk7XG4gICAgICAgIHRoaXMub3JpZ2luYWxFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLm52aW1pZnkpO1xuICAgICAgICBjb25zdCBzZWwgPSBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRWxlbWVudC5vd25lckRvY3VtZW50LmNvbnRhaW5zKHRoaXMub3JpZ2luYWxFbGVtZW50KSkge1xuICAgICAgICAgICAgcmFuZ2Uuc2V0U3RhcnQodGhpcy5vcmlnaW5hbEVsZW1lbnQsIDApO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xuICAgICAgICB0aGlzLm9yaWdpbmFsRWxlbWVudC5mb2N1cygpO1xuICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgICAgICBpZiAoYWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLm52aW1pZnkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QnVmZmVySW5mbyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlckluZm87XG4gICAgfVxuXG4gICAgZ2V0RWRpdG9yICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yO1xuICAgIH1cblxuICAgIGdldEVsZW1lbnQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0RWxlbWVudCgpO1xuICAgIH1cblxuICAgIGdldFBhZ2VFbGVtZW50Q29udGVudCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVkaXRvcigpLmdldENvbnRlbnQoKTtcbiAgICB9XG5cbiAgICBnZXRQYWdlRWxlbWVudEN1cnNvciAoKSB7XG4gICAgICAgIGNvbnN0IHAgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3IoKS5jYXRjaCgoKSA9PiBbMSwgMV0pIGFzIFByb21pc2U8W251bWJlciwgbnVtYmVyXT47XG4gICAgICAgIHAudGhlbihjID0+IHRoaXMuY3Vyc29yID0gYyk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIGdldFNlbGVjdG9yICgpIHtcbiAgICAgICAgcmV0dXJuIGNvbXB1dGVTZWxlY3Rvcih0aGlzLmdldEVsZW1lbnQoKSk7XG4gICAgfVxuXG4gICAgZ2V0U3BhbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwYW47XG4gICAgfVxuXG4gICAgaGlkZSAoKSB7XG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICBpc0ZvY3VzZWQgKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5zcGFuXG4gICAgICAgICAgICB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmlmcmFtZTtcbiAgICB9XG5cbiAgICBwcmVwYXJlQnVmZmVySW5mbyAoKSB7XG4gICAgICAgIHRoaXMuYnVmZmVySW5mbyA9IChhc3luYyAoKSA9PiBbXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdGhpcy5nZXRTZWxlY3RvcigpLFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5nZXRQYWdlRWxlbWVudEN1cnNvcigpLFxuICAgICAgICAgICAgYXdhaXQgKHRoaXMuZWRpdG9yLmdldExhbmd1YWdlKCkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKSlcbiAgICAgICAgXSkoKSBhcyBQcm9taXNlPFtzdHJpbmcsIHN0cmluZywgW251bWJlciwgbnVtYmVyXSwgc3RyaW5nXT47XG4gICAgfVxuXG4gICAgcHJlc3NLZXlzIChrZXlzOiBLZXlib2FyZEV2ZW50W10pIHtcbiAgICAgICAgY29uc3QgZm9jdXNlZCA9IHRoaXMuaXNGb2N1c2VkKCk7XG4gICAgICAgIGtleXMuZm9yRWFjaChldiA9PiB0aGlzLm9yaWdpbmFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2KSk7XG4gICAgICAgIGlmIChmb2N1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdXRFZGl0b3JDbG9zZVRvSW5wdXRPcmlnaW4gKCkge1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lZGl0b3IuZ2V0RWxlbWVudCgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIC8vIFNhdmUgYXR0cmlidXRlc1xuICAgICAgICBjb25zdCBwb3NBdHRycyA9IFtcImxlZnRcIiwgXCJwb3NpdGlvblwiLCBcInRvcFwiLCBcInpJbmRleFwiXTtcbiAgICAgICAgY29uc3Qgb2xkUG9zQXR0cnMgPSBwb3NBdHRycy5tYXAoKGF0dHI6IGFueSkgPT4gdGhpcy5pZnJhbWUuc3R5bGVbYXR0cl0pO1xuXG4gICAgICAgIC8vIEFzc2lnbiBuZXcgdmFsdWVzXG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmxlZnQgPSBgJHtyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCArIHRoaXMucmVsYXRpdmVYfXB4YDtcbiAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLnRvcCA9IGAke3JlY3QudG9wICsgd2luZG93LnNjcm9sbFkgKyB0aGlzLnJlbGF0aXZlWX1weGA7XG4gICAgICAgIC8vIDIxMzk5OTk5OTUgaXMgaG9wZWZ1bGx5IGhpZ2hlciB0aGFuIGV2ZXJ5dGhpbmcgZWxzZSBvbiB0aGUgcGFnZSBidXRcbiAgICAgICAgLy8gbG93ZXIgdGhhbiBWaW1pdW0ncyBlbGVtZW50c1xuICAgICAgICAvLyB0aGlzLmlmcmFtZS5zdHlsZS56SW5kZXggPSBcIjIxMzk5OTk5OTVcIjtcblxuICAgICAgICAvLyBDb21wYXJlLCB0byBrbm93IHdoZXRoZXIgdGhlIGVsZW1lbnQgbW92ZWQgb3Igbm90XG4gICAgICAgIGNvbnN0IHBvc0NoYW5nZWQgPSAhIXBvc0F0dHJzLmZpbmQoKGF0dHI6IGFueSwgaW5kZXgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGVbYXR0cl0gIT09IG9sZFBvc0F0dHJzW2luZGV4XSk7XG4gICAgICAgIHJldHVybiB7IHBvc0NoYW5nZWQsIG5ld1JlY3Q6IHJlY3QgfTtcbiAgICB9XG5cbiAgICBwdXRFZGl0b3JDbG9zZVRvSW5wdXRPcmlnaW5BZnRlclJlc2l6ZUZyb21GcmFtZSAoKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYSB2ZXJ5IHdlaXJkLCBjb21wbGljYXRlZCBhbmQgYmFkIHBpZWNlIG9mIGNvZGUuIEFsbCBjYWxsc1xuICAgICAgICAvLyB0byBgcmVzaXplRWRpdG9yKClgIGhhdmUgdG8gcmVzdWx0IGluIGEgY2FsbCB0byBgcmVzaXplVG8oKWAgYW5kXG4gICAgICAgIC8vIHRoZW4gYHB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbigpYCBpbiBvcmRlciB0byBtYWtlIHN1cmUgdGhlXG4gICAgICAgIC8vIGlmcmFtZSBkb2Vzbid0IG92ZXJmbG93IGZyb20gdGhlIHZpZXdwb3J0LlxuICAgICAgICAvLyBIb3dldmVyLCB3aGVuIHdlIGNyZWF0ZSB0aGUgaWZyYW1lLCB3ZSBkb24ndCB3YW50IGl0IHRvIGZpdCBpbiB0aGVcbiAgICAgICAgLy8gdmlld3BvcnQgYXQgYWxsIGNvc3QuIEluc3RlYWQsIHdlIHdhbnQgaXQgdG8gY292ZXIgdGhlIHVuZGVybHlpbmdcbiAgICAgICAgLy8gaW5wdXQgYXMgbXVjaCBhcyBwb3NzaWJsZS4gVGhlIHByb2JsZW0gaXMgdGhhdCB3aGVuIGl0IGlzIGNyZWF0ZWQsXG4gICAgICAgIC8vIHRoZSBpZnJhbWUgd2lsbCBhc2sgZm9yIGEgcmVzaXplIChiZWNhdXNlIE5lb3ZpbSBhc2tzIGZvciBvbmUpIGFuZFxuICAgICAgICAvLyB3aWxsIHRodXMgYWxzbyBhY2NpZGVudGFsbHkgY2FsbCBwdXRFZGl0b3JDbG9zZVRvSW5wdXRPcmlnaW4sIHdoaWNoXG4gICAgICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gY2FsbC5cbiAgICAgICAgLy8gU28gd2UgaGF2ZSB0byB0cmFjayB0aGUgY2FsbHMgdG8gcHV0RWRpdG9yQ2xvc2VUb0lucHV0T3JpZ2luIHRoYXRcbiAgICAgICAgLy8gYXJlIG1hZGUgZnJvbSB0aGUgaWZyYW1lIChpLmUuIGZyb20gYHJlc2l6ZUVkaXRvcigpYCkgYW5kIGlnbm9yZSB0aGVcbiAgICAgICAgLy8gZmlyc3Qgb25lLlxuICAgICAgICBpZiAodGhpcy5maXJzdFB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVggPSAwO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVkgPSAwO1xuICAgICAgICAgICAgdGhpcy5maXJzdFB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbiA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbigpO1xuICAgIH1cblxuICAgIC8vIFJlc2l6ZSB0aGUgaWZyYW1lLCBtYWtpbmcgc3VyZSBpdCBkb2Vzbid0IGdldCBsYXJnZXIgdGhhbiB0aGUgd2luZG93XG4gICAgcmVzaXplVG8gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCB3YXJuSWZyYW1lOiBib29sZWFuKSB7XG4gICAgICAgIC8vIElmIHRoZSBkaW1lbnNpb25zIHRoYXQgYXJlIGFza2VkIGZvciBhcmUgdG9vIGJpZywgbWFrZSB0aGVtIGFzIGJpZ1xuICAgICAgICAvLyBhcyB0aGUgd2luZG93XG4gICAgICAgIGxldCBjYW50RnVsbHlSZXNpemUgPSBmYWxzZTtcbiAgICAgICAgbGV0IGF2YWlsYWJsZVdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGlmIChhdmFpbGFibGVXaWR0aCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCkge1xuICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdpZHRoID49IGF2YWlsYWJsZVdpZHRoKSB7XG4gICAgICAgICAgICB3aWR0aCA9IGF2YWlsYWJsZVdpZHRoIC0gMTtcbiAgICAgICAgICAgIGNhbnRGdWxseVJlc2l6ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF2YWlsYWJsZUhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgaWYgKGF2YWlsYWJsZUhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhlaWdodCA+PSBhdmFpbGFibGVIZWlnaHQpIHtcbiAgICAgICAgICAgIGhlaWdodCA9IGF2YWlsYWJsZUhlaWdodCAtIDE7XG4gICAgICAgICAgICBjYW50RnVsbHlSZXNpemUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGRpbWVuc2lvbnMgdGhhdCB3ZXJlIGFza2VkIGZvciBtaWdodCBtYWtlIHRoZSBpZnJhbWUgb3ZlcmZsb3cuXG4gICAgICAgIC8vIEluIHRoaXMgY2FzZSwgd2UgbmVlZCB0byBjb21wdXRlIGhvdyBtdWNoIHdlIG5lZWQgdG8gbW92ZSB0aGUgaWZyYW1lXG4gICAgICAgIC8vIHRvIHRoZSBsZWZ0L3RvcCBpbiBvcmRlciB0byBoYXZlIGl0IGJvdHRvbS1yaWdodCBjb3JuZXIgc2l0IHJpZ2h0IGluXG4gICAgICAgIC8vIHRoZSB3aW5kb3cncyBib3R0b20tcmlnaHQgY29ybmVyLlxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lZGl0b3IuZ2V0RWxlbWVudCgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCByaWdodE92ZXJmbG93ID0gYXZhaWxhYmxlV2lkdGggLSAocmVjdC5sZWZ0ICsgd2lkdGgpO1xuICAgICAgICB0aGlzLnJlbGF0aXZlWCA9IHJpZ2h0T3ZlcmZsb3cgPCAwID8gcmlnaHRPdmVyZmxvdyA6IDA7XG4gICAgICAgIGNvbnN0IGJvdHRvbU92ZXJmbG93ID0gYXZhaWxhYmxlSGVpZ2h0IC0gKHJlY3QudG9wICsgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5yZWxhdGl2ZVkgPSBib3R0b21PdmVyZmxvdyA8IDAgPyBib3R0b21PdmVyZmxvdyA6IDA7XG5cbiAgICAgICAgLy8gTm93IGFjdHVhbGx5IHNldCB0aGUgd2lkdGgvaGVpZ2h0LCBtb3ZlIHRoZSBlZGl0b3Igd2hlcmUgaXQgaXNcbiAgICAgICAgLy8gc3VwcG9zZWQgdG8gYmUgYW5kIGlmIHRoZSBuZXcgaWZyYW1lIGNhbid0IGJlIGFzIGJpZyBhcyByZXF1ZXN0ZWQsXG4gICAgICAgIC8vIHdhcm4gdGhlIGlmcmFtZSBzY3JpcHQuXG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgICB0aGlzLmlmcmFtZS5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICBpZiAoY2FudEZ1bGx5UmVzaXplICYmIHdhcm5JZnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplUmVxSWQgKz0gMTtcbiAgICAgICAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgICAgICBmcmFtZUlkOiB0aGlzLmZyYW1lSWQsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFt0aGlzLnJlc2l6ZVJlcUlkLCB3aWR0aCwgaGVpZ2h0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiBbXCJyZXNpemVcIl0sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiBbXCJtZXNzYWdlRnJhbWVcIl0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIGZyYW1lSWQ6IHRoaXMuZnJhbWVJZCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtrZXldLFxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogW1wiZnJhbWVfc2VuZEtleVwiXSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY05hbWU6IFtcIm1lc3NhZ2VGcmFtZVwiXSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0UGFnZUVsZW1lbnRDb250ZW50ICh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZm9jdXNlZCA9IHRoaXMuaXNGb2N1c2VkKCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldENvbnRlbnQodGV4dCk7XG4gICAgICAgIFtcbiAgICAgICAgICAgIG5ldyBFdmVudChcImtleWRvd25cIiwgICAgIHsgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBFdmVudChcImtleXVwXCIsICAgICAgIHsgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBFdmVudChcImtleXByZXNzXCIsICAgIHsgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBFdmVudChcImJlZm9yZWlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBFdmVudChcImlucHV0XCIsICAgICAgIHsgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBFdmVudChcImNoYW5nZVwiLCAgICAgIHsgYnViYmxlczogdHJ1ZSB9KVxuICAgICAgICBdLmZvckVhY2goZXYgPT4gdGhpcy5vcmlnaW5hbEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldikpO1xuICAgICAgICBpZiAoZm9jdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UGFnZUVsZW1lbnRDdXJzb3IgKGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHAgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgdGhpcy5jdXJzb3JbMF0gPSBsaW5lO1xuICAgICAgICB0aGlzLmN1cnNvclsxXSA9IGNvbHVtbjtcbiAgICAgICAgaWYgKHRoaXMuaXNGb2N1c2VkKCkpIHtcbiAgICAgICAgICAgIHAgPSB0aGlzLmVkaXRvci5zZXRDdXJzb3IobGluZSwgY29sdW1uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBzaG93ICgpIHtcbiAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGUuZGlzcGxheSA9IFwiaW5pdGlhbFwiO1xuICAgIH1cblxufVxuIiwiXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXV0b2ZpbGwoKSB7XG4gICAgY29uc3QgcGxhdEluZm9Qcm9taXNlID0gYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgYXJnczogW10sXG4gICAgICAgICAgICBmdW5jTmFtZTogW1wiYnJvd3NlclwiLCBcInJ1bnRpbWVcIiwgXCJnZXRQbGF0Zm9ybUluZm9cIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmNOYW1lOiBbXCJleGVjXCJdLFxuICAgIH0pO1xuICAgIGNvbnN0IG1hbmlmZXN0UHJvbWlzZSA9IGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIGFyZ3M6IFtdLFxuICAgICAgICAgICAgZnVuY05hbWU6IFtcImJyb3dzZXJcIiwgXCJydW50aW1lXCIsIFwiZ2V0TWFuaWZlc3RcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmNOYW1lOiBbXCJleGVjXCJdLFxuICAgIH0pO1xuICAgIGNvbnN0IG52aW1QbHVnaW5Qcm9taXNlID0gYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgYXJnczoge30sXG4gICAgICAgIGZ1bmNOYW1lOiBbXCJnZXROdmltUGx1Z2luVmVyc2lvblwiXSxcbiAgICB9KTtcbiAgICBjb25zdCBpc3N1ZVRlbXBsYXRlUHJvbWlzZSA9IGZldGNoKGJyb3dzZXIucnVudGltZS5nZXRVUkwoXCJJU1NVRV9URU1QTEFURS5tZFwiKSkudGhlbihwID0+IHAudGV4dCgpKTtcbiAgICBjb25zdCBicm93c2VyU3RyaW5nID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKGZpcmVmb3h8Y2hyb20pW14gXSsvZ2kpO1xuICAgIGxldCBuYW1lO1xuICAgIGxldCB2ZXJzaW9uO1xuICAgIC8vIENhbid0IGJlIHRlc3RlZCwgYXMgY292ZXJhZ2UgaXMgb25seSByZWNvcmRlZCBvbiBmaXJlZm94XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoYnJvd3NlclN0cmluZykge1xuICAgICAgICBbIG5hbWUsIHZlcnNpb24gXSA9IGJyb3dzZXJTdHJpbmdbMF0uc3BsaXQoXCIvXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBcInVua25vd25cIjtcbiAgICAgICAgdmVyc2lvbiA9IFwidW5rbm93blwiO1xuICAgIH1cbiAgICBjb25zdCB2ZW5kb3IgPSBuYXZpZ2F0b3IudmVuZG9yIHx8IFwiXCI7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlX2JvZHlcIikgYXMgYW55O1xuICAgIGNvbnN0IFtcbiAgICAgICAgcGxhdEluZm8sXG4gICAgICAgIG1hbmlmZXN0LFxuICAgICAgICBudmltUGx1Z2luVmVyc2lvbixcbiAgICAgICAgaXNzdWVUZW1wbGF0ZSxcbiAgICBdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3BsYXRJbmZvUHJvbWlzZSwgbWFuaWZlc3RQcm9taXNlLCBudmltUGx1Z2luUHJvbWlzZSwgaXNzdWVUZW1wbGF0ZVByb21pc2VdKTtcbiAgICAvLyBDYW4ndCBoYXBwZW4sIGJ1dCBkb2Vzbid0IGNvc3QgbXVjaCB0byBoYW5kbGUhXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoIXRleHRhcmVhIHx8IHRleHRhcmVhLnZhbHVlLnJlcGxhY2UoL1xcci9nLCBcIlwiKSAhPT0gaXNzdWVUZW1wbGF0ZS5yZXBsYWNlKC9cXHIvZywgXCJcIikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0ZXh0YXJlYS52YWx1ZSA9IGlzc3VlVGVtcGxhdGVcbiAgICAgICAgLnJlcGxhY2UoXCJPUyBWZXJzaW9uOlwiLCBgT1MgVmVyc2lvbjogJHtwbGF0SW5mby5vc30gJHtwbGF0SW5mby5hcmNofWApXG4gICAgICAgIC5yZXBsYWNlKFwiQnJvd3NlciBWZXJzaW9uOlwiLCBgQnJvd3NlciBWZXJzaW9uOiAke3ZlbmRvcn0gJHtuYW1lfSAke3ZlcnNpb259YClcbiAgICAgICAgLnJlcGxhY2UoXCJCcm93c2VyIEFkZG9uIFZlcnNpb246XCIsIGBCcm93c2VyIEFkZG9uIFZlcnNpb246ICR7bWFuaWZlc3QudmVyc2lvbn1gKVxuICAgICAgICAucmVwbGFjZShcIk5lb3ZpbSBQbHVnaW4gVmVyc2lvbjpcIiwgYE5lb3ZpbSBQbHVnaW4gVmVyc2lvbjogJHtudmltUGx1Z2luVmVyc2lvbn1gKTtcbn1cbiIsImltcG9ydCB7IEV2ZW50RW1pdHRlciAgICB9IGZyb20gXCIuL0V2ZW50RW1pdHRlclwiO1xuaW1wb3J0IHsgRmlyZW52aW1FbGVtZW50IH0gZnJvbSBcIi4vRmlyZW52aW1FbGVtZW50XCI7XG5pbXBvcnQgeyBleGVjdXRlSW5QYWdlICAgfSBmcm9tIFwiLi91dGlscy91dGlsc1wiO1xuaW1wb3J0IHsgZ2V0Q29uZiAgICAgICAgIH0gZnJvbSBcIi4vdXRpbHMvY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsga2V5c1RvRXZlbnRzICAgIH0gZnJvbSBcIi4vdXRpbHMva2V5c1wiO1xuXG4vLyBUaGlzIG1vZHVsZSBpcyBsb2FkZWQgaW4gYm90aCB0aGUgYnJvd3NlcidzIGNvbnRlbnQgc2NyaXB0LCB0aGUgYnJvd3NlcidzXG4vLyBmcmFtZSBzY3JpcHQgYW5kIHRodW5kZXJiaXJkJ3MgY29tcG9zZSBzY3JpcHQuXG4vLyBBcyBzdWNoLCBpdCBzaG91bGQgbm90IGhhdmUgYW55IHNpZGUgZWZmZWN0cy5cblxuaW50ZXJmYWNlIElHbG9iYWxTdGF0ZSB7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+O1xuICAgIGxhc3RGb2N1c2VkQ29udGVudFNjcmlwdDogbnVtYmVyO1xuICAgIGZpcmVudmltRWxlbXM6IE1hcDxudW1iZXIsIEZpcmVudmltRWxlbWVudD47XG4gICAgZnJhbWVJZFJlc29sdmU6IChfOiBudW1iZXIpID0+IHZvaWQ7XG4gICAgbnZpbWlmeTogKGV2dDogRm9jdXNFdmVudCkgPT4gdm9pZDtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGdW5jdGlvbnMgcnVubmluZyBpbiB0aGUgY29udGVudCBzY3JpcHQgLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBfZm9jdXNJbnB1dChnbG9iYWw6IElHbG9iYWxTdGF0ZSwgZmlyZW52aW06IEZpcmVudmltRWxlbWVudCwgYWRkTGlzdGVuZXI6IGJvb2xlYW4pIHtcbiAgICBpZiAoYWRkTGlzdGVuZXIpIHtcbiAgICAgICAgLy8gT25seSByZS1hZGQgZXZlbnQgbGlzdGVuZXIgaWYgaW5wdXQncyBzZWxlY3RvciBtYXRjaGVzIHRoZSBvbmVzXG4gICAgICAgIC8vIHRoYXQgc2hvdWxkIGJlIGF1dG9udmltaWZpZWRcbiAgICAgICAgY29uc3QgY29uZiA9IGdldENvbmYoKTtcbiAgICAgICAgaWYgKGNvbmYuc2VsZWN0b3IgJiYgY29uZi5zZWxlY3RvciAhPT0gXCJcIikge1xuICAgICAgICAgICAgY29uc3QgZWxlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY29uZi5zZWxlY3RvcikpO1xuICAgICAgICAgICAgYWRkTGlzdGVuZXIgPSBlbGVtcy5pbmNsdWRlcyhmaXJlbnZpbS5nZXRFbGVtZW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpcmVudmltLmZvY3VzT3JpZ2luYWxFbGVtZW50KGFkZExpc3RlbmVyKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9jdXNlZEVsZW1lbnQgKGZpcmVudmltRWxlbXM6IE1hcDxudW1iZXIsIEZpcmVudmltRWxlbWVudD4pIHtcbiAgICByZXR1cm4gQXJyYXlcbiAgICAgICAgLmZyb20oZmlyZW52aW1FbGVtcy52YWx1ZXMoKSlcbiAgICAgICAgLmZpbmQoaW5zdGFuY2UgPT4gaW5zdGFuY2UuaXNGb2N1c2VkKCkpO1xufVxuXG4vLyBUYWIgZnVuY3Rpb25zIGFyZSBmdW5jdGlvbnMgYWxsIGNvbnRlbnQgc2NyaXB0cyBzaG91bGQgcmVhY3QgdG9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJGdW5jdGlvbnMoZ2xvYmFsOiBJR2xvYmFsU3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRBY3RpdmVJbnN0YW5jZUNvdW50IDogKCkgPT4gZ2xvYmFsLmZpcmVudmltRWxlbXMuc2l6ZSxcbiAgICAgICAgcmVnaXN0ZXJOZXdGcmFtZUlkOiAoZnJhbWVJZDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBnbG9iYWwuZnJhbWVJZFJlc29sdmUoZnJhbWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldERpc2FibGVkOiAoZGlzYWJsZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIGdsb2JhbC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgICB9LFxuICAgICAgICBzZXRMYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQ6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGdsb2JhbC5sYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQgPSBmcmFtZUlkO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaXNWaXNpYmxlKGU6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgdmlld0hlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgcmV0dXJuICEocmVjdC5ib3R0b20gPCAwIHx8IHJlY3QudG9wIC0gdmlld0hlaWdodCA+PSAwKTtcbn1cblxuLy8gQWN0aXZlQ29udGVudCBmdW5jdGlvbnMgYXJlIGZ1bmN0aW9ucyBvbmx5IHRoZSBhY3RpdmUgY29udGVudCBzY3JpcHQgc2hvdWxkIHJlYWN0IHRvXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aXZlQ29udGVudEZ1bmN0aW9ucyhnbG9iYWw6IElHbG9iYWxTdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcmNlTnZpbWlmeTogKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGVsZW0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaXNOdWxsID0gZWxlbSA9PT0gbnVsbCB8fCBlbGVtID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlTm90RWRpdGFibGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGVudEVkaXRhYmxlICE9PSBcInRydWVcIjtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlOb3RFZGl0YWJsZSA9IChkb2N1bWVudC5ib2R5LmNvbnRlbnRFZGl0YWJsZSA9PT0gXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAoZG9jdW1lbnQuYm9keS5jb250ZW50RWRpdGFibGUgPT09IFwiaW5oZXJpdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRlbnRFZGl0YWJsZSAhPT0gXCJ0cnVlXCIpKTtcbiAgICAgICAgICAgIGlmIChpc051bGxcbiAgICAgICAgICAgICAgICB8fCAoZWxlbSA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIHBhZ2VOb3RFZGl0YWJsZSlcbiAgICAgICAgICAgICAgICB8fCAoZWxlbSA9PT0gZG9jdW1lbnQuYm9keSAmJiBib2R5Tm90RWRpdGFibGUpKSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZXh0YXJlYVwiKSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoaXNWaXNpYmxlKTtcbiAgICAgICAgICAgICAgICBpZiAoIWVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbSA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKGUgPT4gZS50eXBlID09PSBcInRleHRcIiAmJiBpc1Zpc2libGUoZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsb2JhbC5udmltaWZ5KHsgdGFyZ2V0OiBlbGVtIH0gYXMgYW55KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VuZEtleTogKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaXJlbnZpbSA9IGdldEZvY3VzZWRFbGVtZW50KGdsb2JhbC5maXJlbnZpbUVsZW1zKTtcbiAgICAgICAgICAgIGlmIChmaXJlbnZpbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZmlyZW52aW0uc2VuZEtleShrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGltcG9ydGFudCB0byB0aHJvdyB0aGlzIGVycm9yIGFzIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgICAgICAgICAgICAgIC8vIHdpbGwgZXhlY3V0ZSBhIGZhbGxiYWNrXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gZmlyZW52aW0gZnJhbWUgc2VsZWN0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5lb3ZpbUZyYW1lRnVuY3Rpb25zKGdsb2JhbDogSUdsb2JhbFN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXZhbEluUGFnZTogKF86IG51bWJlciwganM6IHN0cmluZykgPT4gZXhlY3V0ZUluUGFnZShqcyksXG4gICAgICAgIGZvY3VzSW5wdXQ6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBmaXJlbnZpbUVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoZnJhbWVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZmlyZW52aW1FbGVtZW50ID0gZ2V0Rm9jdXNlZEVsZW1lbnQoZ2xvYmFsLmZpcmVudmltRWxlbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaXJlbnZpbUVsZW1lbnQgPSBnbG9iYWwuZmlyZW52aW1FbGVtcy5nZXQoZnJhbWVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZm9jdXNJbnB1dChnbG9iYWwsIGZpcmVudmltRWxlbWVudCwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzUGFnZTogKGZyYW1lSWQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmlyZW52aW1FbGVtZW50ID0gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpO1xuICAgICAgICAgICAgZmlyZW52aW1FbGVtZW50LmNsZWFyRm9jdXNMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIGFueSkuYmx1cigpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEVkaXRvckluZm86IChmcmFtZUlkOiBudW1iZXIpID0+IGdsb2JhbFxuICAgICAgICAgICAgLmZpcmVudmltRWxlbXNcbiAgICAgICAgICAgIC5nZXQoZnJhbWVJZClcbiAgICAgICAgICAgIC5nZXRCdWZmZXJJbmZvKCksXG4gICAgICAgIGdldEVsZW1lbnRDb250ZW50OiAoZnJhbWVJZDogbnVtYmVyKSA9PiBnbG9iYWxcbiAgICAgICAgICAgIC5maXJlbnZpbUVsZW1zXG4gICAgICAgICAgICAuZ2V0KGZyYW1lSWQpXG4gICAgICAgICAgICAuZ2V0UGFnZUVsZW1lbnRDb250ZW50KCksXG4gICAgICAgIGhpZGVFZGl0b3I6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5fX2ZpcmVudmltX21udF9lbG0uc3R5bGUudmlzaWJpbGl0eSA9ICd1bnNldCdcbiAgICAgICAgICAgIGNvbnN0IGZpcmVudmltID0gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpO1xuICAgICAgICAgICAgZmlyZW52aW0uaGlkZSgpO1xuICAgICAgICAgICAgX2ZvY3VzSW5wdXQoZ2xvYmFsLCBmaXJlbnZpbSwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGtpbGxFZGl0b3I6IChmcmFtZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5fX2ZpcmVudmltX21udF9lbG0uc3R5bGUudmlzaWJpbGl0eSA9ICd1bnNldCdcbiAgICAgICAgICAgIGNvbnN0IGZpcmVudmltID0gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpO1xuICAgICAgICAgICAgY29uc3QgaXNGb2N1c2VkID0gZmlyZW52aW0uaXNGb2N1c2VkKCk7XG4gICAgICAgICAgICBmaXJlbnZpbS5kZXRhY2hGcm9tUGFnZSgpO1xuICAgICAgICAgICAgY29uc3QgY29uZiA9IGdldENvbmYoKTtcbiAgICAgICAgICAgIGlmIChpc0ZvY3VzZWQpIHtcbiAgICAgICAgICAgICAgICBfZm9jdXNJbnB1dChnbG9iYWwsIGZpcmVudmltLCBjb25mLnRha2VvdmVyICE9PSBcIm9uY2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbG9iYWwuZmlyZW52aW1FbGVtcy5kZWxldGUoZnJhbWVJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHByZXNzS2V5czogKGZyYW1lSWQ6IG51bWJlciwga2V5czogc3RyaW5nW10pID0+IHtcbiAgICAgICAgICAgIGdsb2JhbC5maXJlbnZpbUVsZW1zLmdldChmcmFtZUlkKS5wcmVzc0tleXMoa2V5c1RvRXZlbnRzKGtleXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzaXplRWRpdG9yOiAoZnJhbWVJZDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGdsb2JhbC5maXJlbnZpbUVsZW1zLmdldChmcmFtZUlkKTtcbiAgICAgICAgICAgIGVsZW0ucmVzaXplVG8od2lkdGgsIGhlaWdodCwgdHJ1ZSk7XG4gICAgICAgICAgICBlbGVtLnB1dEVkaXRvckNsb3NlVG9JbnB1dE9yaWdpbkFmdGVyUmVzaXplRnJvbUZyYW1lKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEVsZW1lbnRDb250ZW50OiAoZnJhbWVJZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwuZmlyZW52aW1FbGVtcy5nZXQoZnJhbWVJZCkuc2V0UGFnZUVsZW1lbnRDb250ZW50KHRleHQpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFbGVtZW50Q3Vyc29yOiAoZnJhbWVJZDogbnVtYmVyLCBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLmZpcmVudmltRWxlbXMuZ2V0KGZyYW1lSWQpLnNldFBhZ2VFbGVtZW50Q3Vyc29yKGxpbmUsIGNvbHVtbik7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBEZWZpbml0aW9uIG9mIGEgcHJveHkgdHlwZSB0aGF0IGxldHMgdGhlIGZyYW1lIHNjcmlwdCB0cmFuc3BhcmVudGx5IGNhbGwgLy9cbi8vIHRoZSBjb250ZW50IHNjcmlwdCdzIGZ1bmN0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG47XG5cbi8vIFRoZSBwcm94eSBhdXRvbWF0aWNhbGx5IGFwcGVuZHMgdGhlIGZyYW1lSWQgdG8gdGhlIHJlcXVlc3QsIHNvIHdlIGhpZGUgdGhhdCBmcm9tIHVzZXJzXG50eXBlIEFyZ3VtZW50c1R5cGU8VD4gPSBUIGV4dGVuZHMgKHg6IGFueSwgLi4uYXJnczogaW5mZXIgVSkgPT4gYW55ID8gVTogbmV2ZXI7XG50eXBlIFByb21pc2lmeTxUPiA9IFQgZXh0ZW5kcyBQcm9taXNlPGFueT4gPyBUIDogUHJvbWlzZTxUPjtcblxudHlwZSBmdCA9IFJldHVyblR5cGU8dHlwZW9mIGdldE5lb3ZpbUZyYW1lRnVuY3Rpb25zPlxuXG50eXBlIFBhZ2VFdmVudHMgPSBcInJlc2l6ZVwiIHwgXCJmcmFtZV9zZW5kS2V5XCIgfCBcImdldF9idWZfY29udGVudFwiIHwgXCJwYXVzZV9rZXloYW5kbGVyXCI7XG50eXBlIFBhZ2VIYW5kbGVycyA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbmV4cG9ydCBjbGFzcyBQYWdlRXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyPFBhZ2VFdmVudHMsIFBhZ2VIYW5kbGVycz4ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0OiBhbnksIF9zZW5kZXI6IGFueSwgX3NlbmRSZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHJlcXVlc3QuZnVuY05hbWVbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicGF1c2Vfa2V5aGFuZGxlclwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmcmFtZV9zZW5kS2V5XCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInJlc2l6ZVwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQocmVxdWVzdC5mdW5jTmFtZVswXSwgcmVxdWVzdC5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImdldF9idWZfY29udGVudFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLmVtaXQocmVxdWVzdC5mdW5jTmFtZVswXSwgcmVzb2x2ZSkpO1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgcGFnZSByZXF1ZXN0OlwiLCByZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBQYWdlVHlwZSA9IFBhZ2VFdmVudEVtaXR0ZXIgJiB7XG4gICAgW2sgaW4ga2V5b2YgZnRdOiAoLi4uYXJnczogQXJndW1lbnRzVHlwZTxmdFtrXT4pID0+IFByb21pc2lmeTxSZXR1cm5UeXBlPGZ0W2tdPj47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFnZVByb3h5IChmcmFtZUlkOiBudW1iZXIpIHtcbiAgICBjb25zdCBwYWdlID0gbmV3IFBhZ2VFdmVudEVtaXR0ZXIoKTtcblxuICAgIGxldCBmdW5jTmFtZToga2V5b2YgUGFnZVR5cGU7XG4gICAgZm9yIChmdW5jTmFtZSBpbiBnZXROZW92aW1GcmFtZUZ1bmN0aW9ucyh7fSBhcyBhbnkpKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVjbGFyZSBmdW5jIGhlcmUgYmVjYXVzZSBmdW5jTmFtZSBpcyBhIGdsb2JhbCBhbmQgd291bGQgbm90XG4gICAgICAgIC8vIGJlIGNhcHR1cmVkIGluIHRoZSBjbG9zdXJlIG90aGVyd2lzZVxuICAgICAgICBjb25zdCBmdW5jID0gZnVuY05hbWU7XG4gICAgICAgIChwYWdlIGFzIGFueSlbZnVuY10gPSAoKC4uLmFycjogYW55W10pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW2ZyYW1lSWRdLmNvbmNhdChhcnIpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogW2Z1bmNdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6IFtcIm1lc3NhZ2VQYWdlXCJdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcGFnZSBhcyBQYWdlVHlwZTtcbn07XG4iLCIvLyBUaGVzZSBtb2RlcyBhcmUgZGVmaW5lZCBpbiBodHRwczovL2dpdGh1Yi5jb20vbmVvdmltL25lb3ZpbS9ibG9iL21hc3Rlci9zcmMvbnZpbS9jdXJzb3Jfc2hhcGUuY1xuZXhwb3J0IHR5cGUgTnZpbU1vZGUgPSBcImFsbFwiXG4gIHwgXCJub3JtYWxcIlxuICB8IFwidmlzdWFsXCJcbiAgfCBcImluc2VydFwiXG4gIHwgXCJyZXBsYWNlXCJcbiAgfCBcImNtZGxpbmVfbm9ybWFsXCJcbiAgfCBcImNtZGxpbmVfaW5zZXJ0XCJcbiAgfCBcImNtZGxpbmVfcmVwbGFjZVwiXG4gIHwgXCJvcGVyYXRvclwiXG4gIHwgXCJ2aXN1YWxfc2VsZWN0XCJcbiAgfCBcImNtZGxpbmVfaG92ZXJcIlxuICB8IFwic3RhdHVzbGluZV9ob3ZlclwiXG4gIHwgXCJzdGF0dXNsaW5lX2RyYWdcIlxuICB8IFwidnNlcF9ob3ZlclwiXG4gIHwgXCJ2c2VwX2RyYWdcIlxuICB8IFwibW9yZVwiXG4gIHwgXCJtb3JlX2xhc3RsaW5lXCJcbiAgfCBcInNob3dtYXRjaFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElTaXRlQ29uZmlnIHtcbiAgICBjbWRsaW5lOiBcIm5lb3ZpbVwiIHwgXCJmaXJlbnZpbVwiO1xuICAgIGNvbnRlbnQ6IFwiaHRtbFwiIHwgXCJ0ZXh0XCI7XG4gICAgcHJpb3JpdHk6IG51bWJlcjtcbiAgICByZW5kZXJlcjogXCJodG1sXCIgfCBcImNhbnZhc1wiO1xuICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgdGFrZW92ZXI6IFwiYWx3YXlzXCIgfCBcIm9uY2VcIiB8IFwiZW1wdHlcIiB8IFwibm9uZW1wdHlcIiB8IFwibmV2ZXJcIjtcbiAgICBmaWxlbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBHbG9iYWxTZXR0aW5ncyA9IHtcbiAgYWx0OiBcImFscGhhbnVtXCIgfCBcImFsbFwiLFxuICBcIjxDLW4+XCI6IFwiZGVmYXVsdFwiIHwgXCJub29wXCIsXG4gIFwiPEMtdD5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Qy13PlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiLFxuICBcIjxDUy1uPlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiLFxuICBcIjxDUy10PlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiLFxuICBcIjxDUy13PlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiLFxuICBpZ25vcmVLZXlzOiB7IFtrZXkgaW4gTnZpbU1vZGVdOiBzdHJpbmdbXSB9LFxuICBjbWRsaW5lVGltZW91dDogbnVtYmVyLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElDb25maWcge1xuICAgIGdsb2JhbFNldHRpbmdzOiBHbG9iYWxTZXR0aW5ncztcbiAgICBsb2NhbFNldHRpbmdzOiB7IFtrZXk6IHN0cmluZ106IElTaXRlQ29uZmlnIH07XG59XG5cbmxldCBjb25mOiBJQ29uZmlnID0gdW5kZWZpbmVkIGFzIElDb25maWc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVdpdGhEZWZhdWx0cyhvczogc3RyaW5nLCBzZXR0aW5nczogYW55KTogSUNvbmZpZyB7XG4gICAgZnVuY3Rpb24gbWFrZURlZmF1bHRzKG9iajogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgbmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmIChvYmpbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb2JqW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZURlZmF1bHRMb2NhbFNldHRpbmcoc2V0dDogeyBsb2NhbFNldHRpbmdzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l0ZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iajogSVNpdGVDb25maWcpIHtcbiAgICAgICAgbWFrZURlZmF1bHRzKHNldHQubG9jYWxTZXR0aW5ncywgc2l0ZSwge30pO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiAoT2JqZWN0LmtleXMob2JqKSBhcyAoa2V5b2YgdHlwZW9mIG9iailbXSkpIHtcbiAgICAgICAgICAgIG1ha2VEZWZhdWx0cyhzZXR0LmxvY2FsU2V0dGluZ3Nbc2l0ZV0sIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldHRpbmdzID0ge307XG4gICAgfVxuXG4gICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLCBcImdsb2JhbFNldHRpbmdzXCIsIHt9KTtcbiAgICAvLyBcIjxLRVk+XCI6IFwiZGVmYXVsdFwiIHwgXCJub29wXCJcbiAgICAvLyAjMTAzOiBXaGVuIHVzaW5nIHRoZSBicm93c2VyJ3MgY29tbWFuZCBBUEkgdG8gYWxsb3cgc2VuZGluZyBgPEMtdz5gIHRvXG4gICAgLy8gZmlyZW52aW0sIHdoZXRoZXIgdGhlIGRlZmF1bHQgYWN0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgaWYgbm8gbmVvdmltXG4gICAgLy8gZnJhbWUgaXMgZm9jdXNlZC5cbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPEMtbj5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Qy10PlwiLCBcImRlZmF1bHRcIik7XG4gICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLmdsb2JhbFNldHRpbmdzLCBcIjxDLXc+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICAvLyBOb3RlOiA8Q1MtKj4gYXJlIGN1cnJlbnRseSBkaXNhYmxlZCBiZWNhdXNlIG9mXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25lb3ZpbS9uZW92aW0vaXNzdWVzLzEyMDM3XG4gICAgLy8gTm90ZTogPENTLW4+IGRvZXNuJ3QgbWF0Y2ggdGhlIGRlZmF1bHQgYmVoYXZpb3Igb24gZmlyZWZveCBiZWNhdXNlIHRoaXNcbiAgICAvLyB3b3VsZCByZXF1aXJlIHRoZSBzZXNzaW9ucyBBUEkuIEluc3RlYWQsIEZpcmVmb3gncyBiZWhhdmlvciBtYXRjaGVzXG4gICAgLy8gQ2hyb21lJ3MuXG4gICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLmdsb2JhbFNldHRpbmdzLCBcIjxDUy1uPlwiLCBcImRlZmF1bHRcIik7XG4gICAgLy8gTm90ZTogPENTLXQ+IGlzIHRoZXJlIGZvciBjb21wbGV0ZW5lc3Mgc2FrZSdzIGJ1dCBjYW4ndCBiZSBlbXVsYXRlZCBpblxuICAgIC8vIENocm9tZSBhbmQgRmlyZWZveCBiZWNhdXNlIHRoaXMgd291bGQgcmVxdWlyZSB0aGUgc2Vzc2lvbnMgQVBJLlxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Q1MtdD5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Q1Mtdz5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIC8vICM3MTc6IGFsbG93IHBhc3Npbmcga2V5cyB0byB0aGUgYnJvd3NlclxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCJpZ25vcmVLZXlzXCIsIHt9KTtcbiAgICAvLyAjMTA1MDogY3Vyc29yIHNvbWV0aW1lcyBjb3ZlcmVkIGJ5IGNvbW1hbmQgbGluZVxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCJjbWRsaW5lVGltZW91dFwiLCAzMDAwKTtcblxuICAgIC8vIFwiYWx0XCI6IFwiYWxsXCIgfCBcImFscGhhbnVtXCJcbiAgICAvLyAjMjAyOiBPbmx5IHJlZ2lzdGVyIGFsdCBrZXkgb24gYWxwaGFudW1zIHRvIGxldCBzd2VkaXNoIG9zeCB1c2VycyB0eXBlXG4gICAgLy8gICAgICAgc3BlY2lhbCBjaGFyc1xuICAgIC8vIE9ubHkgdGVzdGVkIG9uIE9TWCwgd2hlcmUgd2UgZG9uJ3QgcHVsbCBjb3ZlcmFnZSByZXBvcnRzLCBzbyBkb24ndFxuICAgIC8vIGluc3RydW1lbnQgZnVuY3Rpb24uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAob3MgPT09IFwibWFjXCIpIHtcbiAgICAgICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLmdsb2JhbFNldHRpbmdzLCBcImFsdFwiLCBcImFscGhhbnVtXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCJhbHRcIiwgXCJhbGxcIik7XG4gICAgfVxuXG4gICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLCBcImxvY2FsU2V0dGluZ3NcIiwge30pO1xuICAgIG1ha2VEZWZhdWx0TG9jYWxTZXR0aW5nKHNldHRpbmdzLCBcIi4qXCIsIHtcbiAgICAgICAgLy8gXCJjbWRsaW5lXCI6IFwibmVvdmltXCIgfCBcImZpcmVudmltXCJcbiAgICAgICAgLy8gIzE2ODogVXNlIGFuIGV4dGVybmFsIGNvbW1hbmRsaW5lIHRvIHByZXNlcnZlIHNwYWNlXG4gICAgICAgIGNtZGxpbmU6IFwiZmlyZW52aW1cIixcbiAgICAgICAgY29udGVudDogXCJ0ZXh0XCIsXG4gICAgICAgIHByaW9yaXR5OiAwLFxuICAgICAgICByZW5kZXJlcjogXCJjYW52YXNcIixcbiAgICAgICAgc2VsZWN0b3I6ICd0ZXh0YXJlYTpub3QoW3JlYWRvbmx5XSksIGRpdltyb2xlPVwidGV4dGJveFwiXScsXG4gICAgICAgIC8vIFwidGFrZW92ZXJcIjogXCJhbHdheXNcIiB8IFwib25jZVwiIHwgXCJlbXB0eVwiIHwgXCJub25lbXB0eVwiIHwgXCJuZXZlclwiXG4gICAgICAgIC8vICMyNjU6IE9uIFwib25jZVwiLCBkb24ndCBhdXRvbWF0aWNhbGx5IGJyaW5nIGJhY2sgYWZ0ZXIgOnEnaW5nIGl0XG4gICAgICAgIHRha2VvdmVyOiBcImFsd2F5c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJ7aG9zdG5hbWUlMzJ9X3twYXRobmFtZSUzMn1fe3NlbGVjdG9yJTMyfV97dGltZXN0YW1wJTMyfS57ZXh0ZW5zaW9ufVwiLFxuICAgIH0pO1xuICAgIG1ha2VEZWZhdWx0TG9jYWxTZXR0aW5nKHNldHRpbmdzLCBcImFib3V0OmJsYW5rXFxcXD9jb21wb3NlXCIsIHtcbiAgICAgICAgY21kbGluZTogXCJmaXJlbnZpbVwiLFxuICAgICAgICBjb250ZW50OiBcInRleHRcIixcbiAgICAgICAgcHJpb3JpdHk6IDEsXG4gICAgICAgIHJlbmRlcmVyOiBcImNhbnZhc1wiLFxuICAgICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgICB0YWtlb3ZlcjogXCJhbHdheXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwibWFpbF97dGltZXN0YW1wJTMyfS5lbWxcIixcbiAgICB9KTtcbiAgICByZXR1cm4gc2V0dGluZ3M7XG59XG5cbmV4cG9ydCBjb25zdCBjb25mUmVhZHkgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KCkudGhlbigob2JqOiBhbnkpID0+IHtcbiAgICAgICAgY29uZiA9IG9iajtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICB9KTtcbn0pO1xuXG5icm93c2VyLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzOiBhbnkpID0+IHtcbiAgICBPYmplY3RcbiAgICAgICAgLmVudHJpZXMoY2hhbmdlcylcbiAgICAgICAgLmZvckVhY2goKFtrZXksIHZhbHVlXTogW2tleW9mIElDb25maWcsIGFueV0pID0+IGNvbmZSZWFkeS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbmZba2V5XSA9IHZhbHVlLm5ld1ZhbHVlO1xuICAgICAgICB9KSk7XG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdsb2JhbENvbmYoKSB7XG4gICAgLy8gQ2FuJ3QgYmUgdGVzdGVkIGZvclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGNvbmYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnZXRHbG9iYWxDb25mIGNhbGxlZCBiZWZvcmUgY29uZmlnIHdhcyByZWFkeVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbmYuZ2xvYmFsU2V0dGluZ3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25mKCkge1xuICAgIHJldHVybiBnZXRDb25mRm9yVXJsKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZkZvclVybCh1cmw6IHN0cmluZyk6IElTaXRlQ29uZmlnIHtcbiAgICBjb25zdCBsb2NhbFNldHRpbmdzID0gY29uZi5sb2NhbFNldHRpbmdzO1xuICAgIGZ1bmN0aW9uIG9yMSh2YWw6IG51bWJlcikge1xuICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIC8vIENhbid0IGJlIHRlc3RlZCBmb3JcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChsb2NhbFNldHRpbmdzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3I6IHlvdXIgc2V0dGluZ3MgYXJlIHVuZGVmaW5lZC4gVHJ5IHJlbG9hZGluZyB0aGUgcGFnZS4gSWYgdGhpcyBlcnJvciBwZXJzaXN0cywgdHJ5IHRoZSB0cm91Ymxlc2hvb3RpbmcgZ3VpZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9nbGFjYW1icmUvZmlyZW52aW0vYmxvYi9tYXN0ZXIvVFJPVUJMRVNIT09USU5HLm1kXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyhsb2NhbFNldHRpbmdzKSlcbiAgICAgICAgLmZpbHRlcigoW3BhdCwgX10pID0+IChuZXcgUmVnRXhwKHBhdCkpLnRlc3QodXJsKSlcbiAgICAgICAgLnNvcnQoKGUxLCBlMikgPT4gKG9yMShlMVsxXS5wcmlvcml0eSkgLSBvcjEoZTJbMV0ucHJpb3JpdHkpKSlcbiAgICAgICAgLnJlZHVjZSgoYWNjLCBbXywgY3VyXSkgPT4gT2JqZWN0LmFzc2lnbihhY2MsIGN1ciksIHt9IGFzIElTaXRlQ29uZmlnKTtcbn1cbiIsImV4cG9ydCBjb25zdCBub25MaXRlcmFsS2V5czoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgXCIgXCI6IFwiPFNwYWNlPlwiLFxuICAgIFwiPFwiOiBcIjxsdD5cIixcbiAgICBcIkFycm93RG93blwiOiBcIjxEb3duPlwiLFxuICAgIFwiQXJyb3dMZWZ0XCI6IFwiPExlZnQ+XCIsXG4gICAgXCJBcnJvd1JpZ2h0XCI6IFwiPFJpZ2h0PlwiLFxuICAgIFwiQXJyb3dVcFwiOiBcIjxVcD5cIixcbiAgICBcIkJhY2tzcGFjZVwiOiBcIjxCUz5cIixcbiAgICBcIkRlbGV0ZVwiOiBcIjxEZWw+XCIsXG4gICAgXCJFbmRcIjogXCI8RW5kPlwiLFxuICAgIFwiRW50ZXJcIjogXCI8Q1I+XCIsXG4gICAgXCJFc2NhcGVcIjogXCI8RXNjPlwiLFxuICAgIFwiRjFcIjogXCI8RjE+XCIsXG4gICAgXCJGMTBcIjogXCI8RjEwPlwiLFxuICAgIFwiRjExXCI6IFwiPEYxMT5cIixcbiAgICBcIkYxMlwiOiBcIjxGMTI+XCIsXG4gICAgXCJGMTNcIjogXCI8RjEzPlwiLFxuICAgIFwiRjE0XCI6IFwiPEYxND5cIixcbiAgICBcIkYxNVwiOiBcIjxGMTU+XCIsXG4gICAgXCJGMTZcIjogXCI8RjE2PlwiLFxuICAgIFwiRjE3XCI6IFwiPEYxNz5cIixcbiAgICBcIkYxOFwiOiBcIjxGMTg+XCIsXG4gICAgXCJGMTlcIjogXCI8RjE5PlwiLFxuICAgIFwiRjJcIjogXCI8RjI+XCIsXG4gICAgXCJGMjBcIjogXCI8RjIwPlwiLFxuICAgIFwiRjIxXCI6IFwiPEYyMT5cIixcbiAgICBcIkYyMlwiOiBcIjxGMjI+XCIsXG4gICAgXCJGMjNcIjogXCI8RjIzPlwiLFxuICAgIFwiRjI0XCI6IFwiPEYyND5cIixcbiAgICBcIkYzXCI6IFwiPEYzPlwiLFxuICAgIFwiRjRcIjogXCI8RjQ+XCIsXG4gICAgXCJGNVwiOiBcIjxGNT5cIixcbiAgICBcIkY2XCI6IFwiPEY2PlwiLFxuICAgIFwiRjdcIjogXCI8Rjc+XCIsXG4gICAgXCJGOFwiOiBcIjxGOD5cIixcbiAgICBcIkY5XCI6IFwiPEY5PlwiLFxuICAgIFwiSG9tZVwiOiBcIjxIb21lPlwiLFxuICAgIFwiUGFnZURvd25cIjogXCI8UGFnZURvd24+XCIsXG4gICAgXCJQYWdlVXBcIjogXCI8UGFnZVVwPlwiLFxuICAgIFwiVGFiXCI6IFwiPFRhYj5cIixcbiAgICBcIlxcXFxcIjogXCI8QnNsYXNoPlwiLFxuICAgIFwifFwiOiBcIjxCYXI+XCIsXG59O1xuXG5jb25zdCBub25MaXRlcmFsVmltS2V5cyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbnRyaWVzKG5vbkxpdGVyYWxLZXlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoW3gsIHldKSA9PiBbeSwgeF0pKTtcblxuY29uc3Qgbm9uTGl0ZXJhbEtleUNvZGVzOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHtcbiAgICBcIkVudGVyXCI6ICAgICAgMTMsXG4gICAgXCJTcGFjZVwiOiAgICAgIDMyLFxuICAgIFwiVGFiXCI6ICAgICAgICA5LFxuICAgIFwiRGVsZXRlXCI6ICAgICA0NixcbiAgICBcIkVuZFwiOiAgICAgICAgMzUsXG4gICAgXCJIb21lXCI6ICAgICAgIDM2LFxuICAgIFwiSW5zZXJ0XCI6ICAgICA0NSxcbiAgICBcIlBhZ2VEb3duXCI6ICAgMzQsXG4gICAgXCJQYWdlVXBcIjogICAgIDMzLFxuICAgIFwiQXJyb3dEb3duXCI6ICA0MCxcbiAgICBcIkFycm93TGVmdFwiOiAgMzcsXG4gICAgXCJBcnJvd1JpZ2h0XCI6IDM5LFxuICAgIFwiQXJyb3dVcFwiOiAgICAzOCxcbiAgICBcIkVzY2FwZVwiOiAgICAgMjcsXG59O1xuXG4vLyBHaXZlbiBhIFwic3BlY2lhbFwiIGtleSByZXByZXNlbnRhdGlvbiAoZS5nLiA8RW50ZXI+IG9yIDxNLWw+KSwgcmV0dXJucyBhblxuLy8gYXJyYXkgb2YgdGhyZWUgamF2YXNjcmlwdCBrZXlldmVudHMsIHRoZSBmaXJzdCBvbmUgcmVwcmVzZW50aW5nIHRoZVxuLy8gY29ycmVzcG9uZGluZyBrZXlkb3duLCB0aGUgc2Vjb25kIG9uZSBhIGtleXByZXNzIGFuZCB0aGUgdGhpcmQgb25lIGEga2V5dXBcbi8vIGV2ZW50LlxuZnVuY3Rpb24gbW9kS2V5VG9FdmVudHMoazogc3RyaW5nKSB7XG4gICAgbGV0IG1vZHMgPSBcIlwiO1xuICAgIGxldCBrZXkgPSBub25MaXRlcmFsVmltS2V5c1trXTtcbiAgICBsZXQgY3RybEtleSA9IGZhbHNlO1xuICAgIGxldCBhbHRLZXkgPSBmYWxzZTtcbiAgICBsZXQgc2hpZnRLZXkgPSBmYWxzZTtcbiAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYXJyID0gay5zbGljZSgxLCAtMSkuc3BsaXQoXCItXCIpO1xuICAgICAgICBtb2RzID0gYXJyWzBdO1xuICAgICAgICBrZXkgPSBhcnJbMV07XG4gICAgICAgIGN0cmxLZXkgPSAvYy9pLnRlc3QobW9kcyk7XG4gICAgICAgIGFsdEtleSA9IC9hL2kudGVzdChtb2RzKTtcbiAgICAgICAgY29uc3Qgc3BlY2lhbENoYXIgPSBcIjxcIiArIGtleSArIFwiPlwiO1xuICAgICAgICBpZiAobm9uTGl0ZXJhbFZpbUtleXNbc3BlY2lhbENoYXJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGtleSA9IG5vbkxpdGVyYWxWaW1LZXlzW3NwZWNpYWxDaGFyXTtcbiAgICAgICAgICAgIHNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaGlmdEtleSA9IGtleSAhPT0ga2V5LnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gU29tZSBwYWdlcyByZWx5IG9uIGtleUNvZGVzIHRvIGZpZ3VyZSBvdXQgd2hhdCBrZXkgd2FzIHByZXNzZWQuIFRoaXMgaXNcbiAgICAvLyBhd2Z1bCBiZWNhdXNlIGtleWNvZGVzIGFyZW4ndCBndWFyYW50ZWVkIHRvIGJlIHRoZSBzYW1lIGFjcnJvc3NcbiAgICAvLyBicm93c2Vycy9PUy9rZXlib2FyZCBsYXlvdXRzIGJ1dCB0cnkgdG8gZG8gdGhlIHJpZ2h0IHRoaW5nIGFueXdheS5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2xhY2FtYnJlL2ZpcmVudmltL2lzc3Vlcy83MjNcbiAgICBsZXQga2V5Q29kZSA9IDA7XG4gICAgaWYgKC9eW2EtekEtWjAtOV0kLy50ZXN0KGtleSkpIHtcbiAgICAgICAga2V5Q29kZSA9IGtleS5jaGFyQ29kZUF0KDApO1xuICAgIH0gZWxzZSBpZiAobm9uTGl0ZXJhbEtleUNvZGVzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlDb2RlID0gbm9uTGl0ZXJhbEtleUNvZGVzW2tleV07XG4gICAgfVxuICAgIGNvbnN0IGluaXQgPSB7IGtleSwga2V5Q29kZSwgY3RybEtleSwgYWx0S2V5LCBzaGlmdEtleSwgYnViYmxlczogdHJ1ZSB9O1xuICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBLZXlib2FyZEV2ZW50KFwia2V5ZG93blwiLCBpbml0KSxcbiAgICAgICAgbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlwcmVzc1wiLCBpbml0KSxcbiAgICAgICAgbmV3IEtleWJvYXJkRXZlbnQoXCJrZXl1cFwiLCBpbml0KSxcbiAgICBdO1xufVxuXG4vLyBHaXZlbiBhIFwic2ltcGxlXCIga2V5IChlLmcuIGBhYCwgYDFg4oCmKSwgcmV0dXJucyBhbiBhcnJheSBvZiB0aHJlZSBqYXZhc2NyaXB0XG4vLyBldmVudHMgcmVwcmVzZW50aW5nIHRoZSBhY3Rpb24gb2YgcHJlc3NpbmcgdGhlIGtleS5cbmZ1bmN0aW9uIGtleVRvRXZlbnRzKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc2hpZnRLZXkgPSBrZXkgIT09IGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBLZXlib2FyZEV2ZW50KFwia2V5ZG93blwiLCAgeyBrZXksIHNoaWZ0S2V5LCBidWJibGVzOiB0cnVlIH0pLFxuICAgICAgICBuZXcgS2V5Ym9hcmRFdmVudChcImtleXByZXNzXCIsIHsga2V5LCBzaGlmdEtleSwgYnViYmxlczogdHJ1ZSB9KSxcbiAgICAgICAgbmV3IEtleWJvYXJkRXZlbnQoXCJrZXl1cFwiLCAgICB7IGtleSwgc2hpZnRLZXksIGJ1YmJsZXM6IHRydWUgfSksXG4gICAgXTtcbn1cblxuLy8gR2l2ZW4gYW4gYXJyYXkgb2Ygc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGtleXMgKGUuZy4gW1wiYVwiLCBcIjxFbnRlcj5cIiwg4oCmXSksXG4vLyByZXR1cm5zIGFuIGFycmF5IG9mIGphdmFzY3JpcHQga2V5Ym9hcmQgZXZlbnRzIHRoYXQgc2ltdWxhdGUgdGhlc2Uga2V5c1xuLy8gYmVpbmcgcHJlc3NlZC5cbmV4cG9ydCBmdW5jdGlvbiBrZXlzVG9FdmVudHMoa2V5czogc3RyaW5nW10pIHtcbiAgICAvLyBDb2RlIHRvIHNwbGl0IG1vZCBrZXlzIGFuZCBub24tbW9kIGtleXM6XG4gICAgLy8gY29uc3Qga2V5cyA9IHN0ci5tYXRjaCgvKFs8Pl1bXjw+XStbPD5dKXwoW148Pl0rKS9nKVxuICAgIC8vIGlmIChrZXlzID09PSBudWxsKSB7XG4gICAgLy8gICAgIHJldHVybiBbXTtcbiAgICAvLyB9XG4gICAgcmV0dXJuIGtleXMubWFwKChrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleVswXSA9PT0gXCI8XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RLZXlUb0V2ZW50cyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlUb0V2ZW50cyhrZXkpO1xuICAgIH0pLmZsYXQoKTtcbn1cblxuLy8gVHVybnMgYSBub24tbGl0ZXJhbCBrZXkgKGUuZy4gXCJFbnRlclwiKSBpbnRvIGEgdmltLWVxdWl2YWxlbnQgXCI8RW50ZXI+XCJcbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAobm9uTGl0ZXJhbEtleXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBub25MaXRlcmFsS2V5c1trZXldO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xufVxuXG4vLyBBZGQgbW9kaWZpZXIgYG1vZGAgKGBBYCwgYENgLCBgU2DigKYpIHRvIGB0ZXh0YCAoYSB2aW0ga2V5IGBiYCwgYDxFbnRlcj5gLFxuLy8gYDxDUy14PmDigKYpXG5leHBvcnQgZnVuY3Rpb24gYWRkTW9kaWZpZXIobW9kOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xuICAgIGxldCBtYXRjaDtcbiAgICBsZXQgbW9kaWZpZXJzID0gXCJcIjtcbiAgICBsZXQga2V5ID0gXCJcIjtcbiAgICBpZiAoKG1hdGNoID0gdGV4dC5tYXRjaCgvXjwoW0EtWl17MSw1fSktKC4rKT4kLykpKSB7XG4gICAgICAgIG1vZGlmaWVycyA9IG1hdGNoWzFdO1xuICAgICAgICBrZXkgPSBtYXRjaFsyXTtcbiAgICB9IGVsc2UgaWYgKChtYXRjaCA9IHRleHQubWF0Y2goL148KC4rKT4kLykpKSB7XG4gICAgICAgIGtleSA9IG1hdGNoWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleSA9IHRleHQ7XG4gICAgfVxuICAgIHJldHVybiBcIjxcIiArIG1vZCArIG1vZGlmaWVycyArIFwiLVwiICsga2V5ICsgXCI+XCI7XG59XG4iLCJsZXQgY3VySG9zdCA6IHN0cmluZztcblxuLy8gQ2FuJ3QgZ2V0IGNvdmVyYWdlIGZvciB0aHVuZGVyYmlyZC5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoKGJyb3dzZXIgYXMgYW55KS5jb21wb3NlU2NyaXB0cyAhPT0gdW5kZWZpbmVkIHx8IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPT09IFwiYWJvdXQ6Ymxhbms/Y29tcG9zZVwiKSB7XG4gICAgY3VySG9zdCA9IFwidGh1bmRlcmJpcmRcIjtcbi8vIENocm9tZSBkb2Vzbid0IGhhdmUgYSBcImJyb3dzZXJcIiBvYmplY3QsIGluc3RlYWQgaXQgdXNlcyBcImNocm9tZVwiLlxufSBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09IFwibW96LWV4dGVuc2lvbjpcIikge1xuICAgIGN1ckhvc3QgPSBcImZpcmVmb3hcIjtcbn0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSBcImNocm9tZS1leHRlbnNpb246XCIpIHtcbiAgICBjdXJIb3N0ID0gXCJjaHJvbWVcIjtcbn1cblxuLy8gT25seSB1c2FibGUgaW4gYmFja2dyb3VuZCBzY3JpcHQhXG5leHBvcnQgZnVuY3Rpb24gaXNDaHJvbWUoKSB7XG4gICAgLy8gQ2FuJ3QgY292ZXIgZXJyb3IgY29uZGl0aW9uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoY3VySG9zdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiVXNlZCBpc0Nocm9tZSBpbiBjb250ZW50IHNjcmlwdCFcIik7XG4gICAgfVxuICAgIHJldHVybiBjdXJIb3N0ID09PSBcImNocm9tZVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVGh1bmRlcmJpcmQoKSB7XG4gICAgLy8gQ2FuJ3QgY292ZXIgZXJyb3IgY29uZGl0aW9uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoY3VySG9zdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiVXNlZCBpc1RodW5kZXJiaXJkIGluIGNvbnRlbnQgc2NyaXB0IVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1ckhvc3QgPT09IFwidGh1bmRlcmJpcmRcIjtcbn1cblxuLy8gUnVucyBDT0RFIGluIHRoZSBwYWdlJ3MgY29udGV4dCBieSBzZXR0aW5nIHVwIGEgY3VzdG9tIGV2ZW50IGxpc3RlbmVyLFxuLy8gZW1iZWRkaW5nIGEgc2NyaXB0IGVsZW1lbnQgdGhhdCBydW5zIHRoZSBwaWVjZSBvZiBjb2RlIGFuZCBlbWl0cyBpdHMgcmVzdWx0XG4vLyBhcyBhbiBldmVudC5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlSW5QYWdlKGNvZGU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgY29uc3QgZXZlbnRJZCA9IChuZXcgVVJMKGJyb3dzZXIucnVudGltZS5nZXRVUkwoXCJcIikpKS5ob3N0bmFtZSArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIHNjcmlwdC5pbm5lckhUTUwgPSBgKGFzeW5jIChldklkKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgJHtjb2RlfTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZJZCwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2SWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IHN1Y2Nlc3M6IGZhbHNlLCByZWFzb246IGUgfSxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCR7SlNPTi5zdHJpbmdpZnkoZXZlbnRJZCl9KWA7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50SWQsICh7IGRldGFpbCB9OiBhbnkpID0+IHtcbiAgICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICBpZiAoZGV0YWlsLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZXRhaWwucmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZGV0YWlsLnJlYXNvbik7XG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH0pO1xufVxuXG4vLyBWYXJpb3VzIGZpbHRlcnMgdGhhdCBhcmUgdXNlZCB0byBjaGFuZ2UgdGhlIGFwcGVhcmFuY2Ugb2YgdGhlIEJyb3dzZXJBY3Rpb25cbi8vIGljb24uXG5jb25zdCBzdmdwYXRoID0gXCJmaXJlbnZpbS5zdmdcIjtcbmNvbnN0IHRyYW5zZm9ybWF0aW9ucyA9IHtcbiAgICBkaXNhYmxlZDogKGltZzogVWludDhDbGFtcGVkQXJyYXkpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWcubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgICAgIC8vIFNraXAgdHJhbnNwYXJlbnQgcGl4ZWxzXG4gICAgICAgICAgICBpZiAoaW1nW2kgKyAzXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWVhbiA9IE1hdGguZmxvb3IoKGltZ1tpXSArIGltZ1tpICsgMV0gKyBpbWdbaSArIDJdKSAvIDMpO1xuICAgICAgICAgICAgaW1nW2ldID0gbWVhbjtcbiAgICAgICAgICAgIGltZ1tpICsgMV0gPSBtZWFuO1xuICAgICAgICAgICAgaW1nW2kgKyAyXSA9IG1lYW47XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVycm9yOiAoaW1nOiBVaW50OENsYW1wZWRBcnJheSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICAgICAgLy8gVHVybiB0cmFuc3BhcmVudCBwaXhlbHMgcmVkXG4gICAgICAgICAgICBpZiAoaW1nW2kgKyAzXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGltZ1tpXSA9IDI1NTtcbiAgICAgICAgICAgICAgICBpbWdbaSArIDNdID0gMjU1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBub3JtYWw6ICgoX2ltZzogVWludDhDbGFtcGVkQXJyYXkpID0+ICh1bmRlZmluZWQgYXMgbmV2ZXIpKSxcbiAgICBub3RpZmljYXRpb246IChpbWc6IFVpbnQ4Q2xhbXBlZEFycmF5KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgICAgICAvLyBUdXJuIHRyYW5zcGFyZW50IHBpeGVscyB5ZWxsb3dcbiAgICAgICAgICAgIGlmIChpbWdbaSArIDNdID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaW1nW2ldID0gMjU1O1xuICAgICAgICAgICAgICAgIGltZ1tpICsgMV0gPSAyNTU7XG4gICAgICAgICAgICAgICAgaW1nW2kgKyAzXSA9IDI1NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5leHBvcnQgdHlwZSBJY29uS2luZCA9IGtleW9mIHR5cGVvZiB0cmFuc2Zvcm1hdGlvbnM7XG5cbi8vIFRha2VzIGFuIGljb24ga2luZCBhbmQgZGltZW5zaW9ucyBhcyBwYXJhbWV0ZXIsIGRyYXdzIHRoYXQgdG8gYSBjYW52YXMgYW5kXG4vLyByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgY2FudmFzJyBpbWFnZSBkYXRhLlxuZXhwb3J0IGZ1bmN0aW9uIGdldEljb25JbWFnZURhdGEoa2luZDogSWNvbktpbmQsIHdpZHRoID0gMzIsIGhlaWdodCA9IDMyKSB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjb25zdCBpZCA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRyYW5zZm9ybWF0aW9uc1traW5kXShpZC5kYXRhKTtcbiAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgfSkpO1xuICAgIGltZy5zcmMgPSBzdmdwYXRoO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEdpdmVuIGEgdXJsIGFuZCBhIHNlbGVjdG9yLCB0cmllcyB0byBjb21wdXRlIGEgbmFtZSB0aGF0IHdpbGwgYmUgdW5pcXVlLFxuLy8gc2hvcnQgYW5kIHJlYWRhYmxlIGZvciB0aGUgdXNlci5cbmV4cG9ydCBmdW5jdGlvbiB0b0ZpbGVOYW1lKGZvcm1hdFN0cmluZzogc3RyaW5nLCB1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgbGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIGxldCBwYXJzZWRVUkw6IHsgaG9zdG5hbWU6IHN0cmluZywgcGF0aG5hbWU6IHN0cmluZyB9O1xuICAgIHRyeSB7XG4gICAgICAgIHBhcnNlZFVSTCA9IG5ldyBVUkwodXJsKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIE9ubHkgaGFwcGVucyB3aXRoIHRodW5kZXJiaXJkLCB3aGVyZSB3ZSBjYW4ndCBnZXQgY292ZXJhZ2VcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgcGFyc2VkVVJMID0geyBob3N0bmFtZTogJ3RodW5kZXJiaXJkJywgcGF0aG5hbWU6ICdtYWlsJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IHNhbml0aXplID0gKHM6IHN0cmluZykgPT4gKHMubWF0Y2goL1thLXpBLVowLTldKy9nKSB8fCBbXSkuam9pbihcIi1cIik7XG5cbiAgICBjb25zdCBleHBhbmQgPSAocGF0dGVybjogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vQnJhY2tldHMgPSBwYXR0ZXJuLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgY29uc3QgW3N5bWJvbCwgbGVuZ3RoXSA9IG5vQnJhY2tldHMuc3BsaXQoXCIlXCIpO1xuICAgICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgICBzd2l0Y2ggKHN5bWJvbCkge1xuICAgICAgICAgICAgY2FzZSBcImhvc3RuYW1lXCI6IHZhbHVlID0gcGFyc2VkVVJMLmhvc3RuYW1lOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYXRobmFtZVwiOiB2YWx1ZSA9IHNhbml0aXplKHBhcnNlZFVSTC5wYXRobmFtZSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNlbGVjdG9yXCI6IHZhbHVlID0gc2FuaXRpemUoaWQucmVwbGFjZSgvOm50aC1vZi10eXBlL2csIFwiXCIpKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidGltZXN0YW1wXCI6IHZhbHVlID0gc2FuaXRpemUoKG5ldyBEYXRlKCkpLnRvSVNPU3RyaW5nKCkpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHRlbnNpb25cIjogdmFsdWUgPSBsYW5ndWFnZVRvRXh0ZW5zaW9ucyhsYW5ndWFnZSk7IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogY29uc29sZS5lcnJvcihgVW5yZWNvZ25pemVkIGZpbGVuYW1lIHBhdHRlcm46ICR7cGF0dGVybn1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUuc2xpY2UoLWxlbmd0aCk7XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBmb3JtYXRTdHJpbmc7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGZvcm1hdFN0cmluZy5tYXRjaCgve1tefV0qfS9nKTtcbiAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCkge1xuICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMuZmlsdGVyKHMgPT4gcyAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UobWF0Y2gsIGV4cGFuZChtYXRjaCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEdpdmVuIGEgbGFuZ3VhZ2UgbmFtZSwgcmV0dXJucyBhIGZpbGVuYW1lIGV4dGVuc2lvbi4gQ2FuIHJldHVybiB1bmRlZmluZWQuXG5leHBvcnQgZnVuY3Rpb24gbGFuZ3VhZ2VUb0V4dGVuc2lvbnMobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIC8vIGlmIChsYW5ndWFnZSA9PT0gdW5kZWZpbmVkIHx8IGxhbmd1YWdlID09PSBudWxsKSB7XG4gICAgLy8gICAgIGxhbmd1YWdlID0gXCJcIjtcbiAgICAvLyB9XG4gICAgLy8gY29uc3QgbGFuZyA9IGxhbmd1YWdlLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAvLyBzd2l0Y2ggKGxhbmcpIHtcbiAgICAvLyAgICAgY2FzZSBcImFwbFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwiYXBsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJicmFpbmZ1Y2tcIjogICAgICAgIHJldHVybiBcImJmXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjXCI6ICAgICAgICAgICAgICAgIHJldHVybiBcImNcIjtcbiAgICAvLyAgICAgY2FzZSBcImMjXCI6ICAgICAgICAgICAgICAgcmV0dXJuIFwiY3NcIjtcbiAgICAvLyAgICAgY2FzZSBcImMrK1wiOiAgICAgICAgICAgICAgcmV0dXJuIFwiY3BwXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjZXlsb25cIjogICAgICAgICAgIHJldHVybiBcImNleWxvblwiO1xuICAgIC8vICAgICBjYXNlIFwiY2xpa2VcIjogICAgICAgICAgICByZXR1cm4gXCJjXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjbG9qdXJlXCI6ICAgICAgICAgIHJldHVybiBcImNsalwiO1xuICAgIC8vICAgICBjYXNlIFwiY21ha2VcIjogICAgICAgICAgICByZXR1cm4gXCIuY21ha2VcIjtcbiAgICAvLyAgICAgY2FzZSBcImNvYm9sXCI6ICAgICAgICAgICAgcmV0dXJuIFwiY2JsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjb2ZmZWVzY3JpcHRcIjogICAgIHJldHVybiBcImNvZmZlZVwiO1xuICAgIC8vICAgICBjYXNlIFwiY29tbW9ubGlzcFwiOiAgICAgIHJldHVybiBcImxpc3BcIjtcbiAgICAvLyAgICAgY2FzZSBcImNyeXN0YWxcIjogICAgICAgICAgcmV0dXJuIFwiY3JcIjtcbiAgICAvLyAgICAgY2FzZSBcImNzc1wiOiAgICAgICAgICAgICAgcmV0dXJuIFwiY3NzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjeXRob25cIjogICAgICAgICAgIHJldHVybiBcInB5XCI7XG4gICAgLy8gICAgIGNhc2UgXCJkXCI6ICAgICAgICAgICAgICAgIHJldHVybiBcImRcIjtcbiAgICAvLyAgICAgY2FzZSBcImRhcnRcIjogICAgICAgICAgICAgcmV0dXJuIFwiZGFydFwiO1xuICAgIC8vICAgICBjYXNlIFwiZGlmZlwiOiAgICAgICAgICAgICByZXR1cm4gXCJkaWZmXCI7XG4gICAgLy8gICAgIGNhc2UgXCJkb2NrZXJmaWxlXCI6ICAgICAgIHJldHVybiBcImRvY2tlcmZpbGVcIjtcbiAgICAvLyAgICAgY2FzZSBcImR0ZFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwiZHRkXCI7XG4gICAgLy8gICAgIGNhc2UgXCJkeWxhblwiOiAgICAgICAgICAgIHJldHVybiBcImR5bGFuXCI7XG4gICAgLy8gICAgIC8vIEVpZmZlbCB3YXMgdGhlcmUgZmlyc3QgYnV0IGVsaXhpciBzZWVtcyBtb3JlIGxpa2VseVxuICAgIC8vICAgICAvLyBjYXNlIFwiZWlmZmVsXCI6ICAgICAgICAgICByZXR1cm4gXCJlXCI7XG4gICAgLy8gICAgIGNhc2UgXCJlbGl4aXJcIjogICAgICAgICAgIHJldHVybiBcImVcIjtcbiAgICAvLyAgICAgY2FzZSBcImVsbVwiOiAgICAgICAgICAgICAgcmV0dXJuIFwiZWxtXCI7XG4gICAgLy8gICAgIGNhc2UgXCJlcmxhbmdcIjogICAgICAgICAgIHJldHVybiBcImVybFwiO1xuICAgIC8vICAgICBjYXNlIFwiZiNcIjogICAgICAgICAgICAgICByZXR1cm4gXCJmc1wiO1xuICAgIC8vICAgICBjYXNlIFwiZmFjdG9yXCI6ICAgICAgICAgICByZXR1cm4gXCJmYWN0b3JcIjtcbiAgICAvLyAgICAgY2FzZSBcImZvcnRoXCI6ICAgICAgICAgICAgcmV0dXJuIFwiZnRoXCI7XG4gICAgLy8gICAgIGNhc2UgXCJmb3J0cmFuXCI6ICAgICAgICAgIHJldHVybiBcImY5MFwiO1xuICAgIC8vICAgICBjYXNlIFwiZ2FzXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJhc21cIjtcbiAgICAvLyAgICAgY2FzZSBcImdvXCI6ICAgICAgICAgICAgICAgcmV0dXJuIFwiZ29cIjtcbiAgICAvLyAgICAgLy8gR0ZNOiBDb2RlTWlycm9yJ3MgZ2l0aHViLWZsYXZvcmVkIG1hcmtkb3duXG4gICAgLy8gICAgIGNhc2UgXCJnZm1cIjogICAgICAgICAgICAgIHJldHVybiBcIm1kXCI7XG4gICAgLy8gICAgIGNhc2UgXCJncm9vdnlcIjogICAgICAgICAgIHJldHVybiBcImdyb292eVwiO1xuICAgIC8vICAgICBjYXNlIFwiaGFtbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJoYW1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJoYW5kbGViYXJzXCI6ICAgICAgIHJldHVybiBcImhic1wiO1xuICAgIC8vICAgICBjYXNlIFwiaGFza2VsbFwiOiAgICAgICAgICByZXR1cm4gXCJoc1wiO1xuICAgIC8vICAgICBjYXNlIFwiaGF4ZVwiOiAgICAgICAgICAgICByZXR1cm4gXCJoeFwiO1xuICAgIC8vICAgICBjYXNlIFwiaHRtbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJodG1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJodG1sZW1iZWRkZWRcIjogICAgIHJldHVybiBcImh0bWxcIjtcbiAgICAvLyAgICAgY2FzZSBcImh0bWxtaXhlZFwiOiAgICAgICAgcmV0dXJuIFwiaHRtbFwiO1xuICAgIC8vICAgICBjYXNlIFwiaXB5dGhvblwiOiAgICAgICAgICByZXR1cm4gXCJweVwiO1xuICAgIC8vICAgICBjYXNlIFwiaXB5dGhvbmZtXCI6ICAgICAgICByZXR1cm4gXCJtZFwiO1xuICAgIC8vICAgICBjYXNlIFwiamF2YVwiOiAgICAgICAgICAgICByZXR1cm4gXCJqYXZhXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqYXZhc2NyaXB0XCI6ICAgICAgIHJldHVybiBcImpzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqaW5qYTJcIjogICAgICAgICAgIHJldHVybiBcImppbmphXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqdWxpYVwiOiAgICAgICAgICAgIHJldHVybiBcImpsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqc3hcIjogICAgICAgICAgICAgIHJldHVybiBcImpzeFwiO1xuICAgIC8vICAgICBjYXNlIFwia290bGluXCI6ICAgICAgICAgICByZXR1cm4gXCJrdFwiO1xuICAgIC8vICAgICBjYXNlIFwibGF0ZXhcIjogICAgICAgICAgICByZXR1cm4gXCJsYXRleFwiO1xuICAgIC8vICAgICBjYXNlIFwibGVzc1wiOiAgICAgICAgICAgICByZXR1cm4gXCJsZXNzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJsdWFcIjogICAgICAgICAgICAgIHJldHVybiBcImx1YVwiO1xuICAgIC8vICAgICBjYXNlIFwibWFya2Rvd25cIjogICAgICAgICByZXR1cm4gXCJtZFwiO1xuICAgIC8vICAgICBjYXNlIFwibWxsaWtlXCI6ICAgICAgICAgICAgcmV0dXJuIFwibWxcIjtcbiAgICAvLyAgICAgY2FzZSBcIm9jYW1sXCI6ICAgICAgICAgICAgcmV0dXJuIFwibWxcIjtcbiAgICAvLyAgICAgY2FzZSBcIm9jdGF2ZVwiOiAgICAgICAgICAgcmV0dXJuIFwibVwiO1xuICAgIC8vICAgICBjYXNlIFwicGFzY2FsXCI6ICAgICAgICAgICByZXR1cm4gXCJwYXNcIjtcbiAgICAvLyAgICAgY2FzZSBcInBlcmxcIjogICAgICAgICAgICAgcmV0dXJuIFwicGxcIjtcbiAgICAvLyAgICAgY2FzZSBcInBocFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwicGhwXCI7XG4gICAgLy8gICAgIGNhc2UgXCJwb3dlcnNoZWxsXCI6ICAgICAgIHJldHVybiBcInBzMVwiO1xuICAgIC8vICAgICBjYXNlIFwicHl0aG9uXCI6ICAgICAgICAgICByZXR1cm4gXCJweVwiO1xuICAgIC8vICAgICBjYXNlIFwiclwiOiAgICAgICAgICAgICAgICByZXR1cm4gXCJyXCI7XG4gICAgLy8gICAgIGNhc2UgXCJyc3RcIjogICAgICAgICAgICAgIHJldHVybiBcInJzdFwiO1xuICAgIC8vICAgICBjYXNlIFwicnVieVwiOiAgICAgICAgICAgICByZXR1cm4gXCJydWJ5XCI7XG4gICAgLy8gICAgIGNhc2UgXCJydXN0XCI6ICAgICAgICAgICAgIHJldHVybiBcInJzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzYXNcIjogICAgICAgICAgICAgIHJldHVybiBcInNhc1wiO1xuICAgIC8vICAgICBjYXNlIFwic2Fzc1wiOiAgICAgICAgICAgICByZXR1cm4gXCJzYXNzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzY2FsYVwiOiAgICAgICAgICAgIHJldHVybiBcInNjYWxhXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzY2hlbWVcIjogICAgICAgICAgIHJldHVybiBcInNjbVwiO1xuICAgIC8vICAgICBjYXNlIFwic2Nzc1wiOiAgICAgICAgICAgICByZXR1cm4gXCJzY3NzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzbWFsbHRhbGtcIjogICAgICAgIHJldHVybiBcInN0XCI7XG4gICAgLy8gICAgIGNhc2UgXCJzaGVsbFwiOiAgICAgICAgICAgIHJldHVybiBcInNoXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzcWxcIjogICAgICAgICAgICAgIHJldHVybiBcInNxbFwiO1xuICAgIC8vICAgICBjYXNlIFwic3RleFwiOiAgICAgICAgICAgICByZXR1cm4gXCJsYXRleFwiO1xuICAgIC8vICAgICBjYXNlIFwic3dpZnRcIjogICAgICAgICAgICByZXR1cm4gXCJzd2lmdFwiO1xuICAgIC8vICAgICBjYXNlIFwidGNsXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJ0Y2xcIjtcbiAgICAvLyAgICAgY2FzZSBcInRvbWxcIjogICAgICAgICAgICAgcmV0dXJuIFwidG9tbFwiO1xuICAgIC8vICAgICBjYXNlIFwidHdpZ1wiOiAgICAgICAgICAgICByZXR1cm4gXCJ0d2lnXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ0eXBlc2NyaXB0XCI6ICAgICAgIHJldHVybiBcInRzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ2YlwiOiAgICAgICAgICAgICAgIHJldHVybiBcInZiXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ2YnNjcmlwdFwiOiAgICAgICAgIHJldHVybiBcInZic1wiO1xuICAgIC8vICAgICBjYXNlIFwidmVyaWxvZ1wiOiAgICAgICAgICByZXR1cm4gXCJzdlwiO1xuICAgIC8vICAgICBjYXNlIFwidmhkbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJ2aGRsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ4bWxcIjogICAgICAgICAgICAgIHJldHVybiBcInhtbFwiO1xuICAgIC8vICAgICBjYXNlIFwieWFtbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJ5YW1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ6ODBcIjogICAgICAgICAgICAgIHJldHVybiBcIno4YVwiO1xuICAgIC8vIH1cbiAgICByZXR1cm4gXCJ0eHRcIjtcbn1cblxuLy8gTWFrZSB0c2xpbnQgaGFwcHlcbmNvbnN0IGZvbnRGYW1pbHkgPSBcImZvbnQtZmFtaWx5XCI7XG5cbi8vIENhbid0IGJlIHRlc3RlZCBlMmUgOi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTaW5nbGVHdWlmb250KGd1aWZvbnQ6IHN0cmluZywgZGVmYXVsdHM6IGFueSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBndWlmb250LnNwbGl0KFwiOlwiKTtcbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cyk7XG4gICAgaWYgKC9eW2EtekEtWjAtOV0rJC8udGVzdChvcHRpb25zWzBdKSkge1xuICAgICAgICByZXN1bHRbZm9udEZhbWlseV0gPSBvcHRpb25zWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtmb250RmFtaWx5XSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnNbMF0pO1xuICAgIH1cbiAgICBpZiAoZGVmYXVsdHNbZm9udEZhbWlseV0pIHtcbiAgICAgICAgcmVzdWx0W2ZvbnRGYW1pbHldICs9IGAsICR7ZGVmYXVsdHNbZm9udEZhbWlseV19YDtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnMuc2xpY2UoMSkucmVkdWNlKChhY2MsIG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25bMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiaFwiOlxuICAgICAgICAgICAgICAgICAgICBhY2NbXCJmb250LXNpemVcIl0gPSBgJHtvcHRpb24uc2xpY2UoMSl9cHRgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiYlwiOlxuICAgICAgICAgICAgICAgICAgICBhY2NbXCJmb250LXdlaWdodFwiXSA9IFwiYm9sZFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiaVwiOlxuICAgICAgICAgICAgICAgICAgICBhY2NbXCJmb250LXN0eWxlXCJdID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1widGV4dC1kZWNvcmF0aW9uXCJdID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInNcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1widGV4dC1kZWNvcmF0aW9uXCJdID0gXCJsaW5lLXRocm91Z2hcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIndcIjogLy8gQ2FuJ3Qgc2V0IGZvbnQgd2lkdGguIFdvdWxkIGhhdmUgdG8gYWRqdXN0IGNlbGwgd2lkdGguXG4gICAgICAgICAgICAgICAgY2FzZSBcImNcIjogLy8gQ2FuJ3Qgc2V0IGNoYXJhY3RlciBzZXRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCByZXN1bHQgYXMgYW55KTtcbn07XG5cbi8vIFBhcnNlcyBhIGd1aWZvbnQgZGVjbGFyYXRpb24gYXMgZGVzY3JpYmVkIGluIGA6aCBFMjQ0YFxuLy8gZGVmYXVsdHM6IGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggb2YuXG4vLyBDYW4ndCBiZSB0ZXN0ZWQgZTJlIDovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR3VpZm9udChndWlmb250OiBzdHJpbmcsIGRlZmF1bHRzOiBhbnkpIHtcbiAgICBjb25zdCBmb250cyA9IGd1aWZvbnQuc3BsaXQoXCIsXCIpLnJldmVyc2UoKTtcbiAgICByZXR1cm4gZm9udHMucmVkdWNlKChhY2MsIGN1cikgPT4gcGFyc2VTaW5nbGVHdWlmb250KGN1ciwgYWNjKSwgZGVmYXVsdHMpO1xufVxuXG4vLyBDb21wdXRlcyBhIHVuaXF1ZSBzZWxlY3RvciBmb3IgaXRzIGFyZ3VtZW50LlxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVTZWxlY3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGZ1bmN0aW9uIHVuaXF1ZVNlbGVjdG9yKGU6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICAgICAgLy8gT25seSBtYXRjaGluZyBhbHBoYW51bWVyaWMgc2VsZWN0b3JzIGJlY2F1c2Ugb3RoZXJzIGNoYXJzIG1pZ2h0IGhhdmUgc3BlY2lhbCBtZWFuaW5nIGluIENTU1xuICAgICAgICBpZiAoZS5pZCAmJiBlLmlkLm1hdGNoKFwiXlthLXpBLVowLTlfLV0rJFwiKSkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBlLnRhZ05hbWUgKyBgW2lkPVwiJHtlLmlkfVwiXWA7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpZCkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgdGhlIHRvcCBvZiB0aGUgZG9jdW1lbnRcbiAgICAgICAgaWYgKCFlLnBhcmVudEVsZW1lbnQpIHsgcmV0dXJuIFwiSFRNTFwiOyB9XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBlbGVtZW50XG4gICAgICAgIGNvbnN0IGluZGV4ID1cbiAgICAgICAgICAgIEFycmF5LmZyb20oZS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoY2hpbGQgPT4gY2hpbGQudGFnTmFtZSA9PT0gZS50YWdOYW1lKVxuICAgICAgICAgICAgICAgIC5pbmRleE9mKGUpICsgMTtcbiAgICAgICAgcmV0dXJuIGAke3VuaXF1ZVNlbGVjdG9yKGUucGFyZW50RWxlbWVudCl9ID4gJHtlLnRhZ05hbWV9Om50aC1vZi10eXBlKCR7aW5kZXh9KWA7XG4gICAgfVxuICAgIHJldHVybiB1bmlxdWVTZWxlY3RvcihlbGVtZW50KTtcbn1cblxuLy8gVHVybnMgYSBudW1iZXIgaW50byBpdHMgaGFzaCs2IG51bWJlciBoZXhhZGVjaW1hbCByZXByZXNlbnRhdGlvbi5cbmV4cG9ydCBmdW5jdGlvbiB0b0hleENzcyhuOiBudW1iZXIpIHtcbiAgICBpZiAobiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHN0ciA9IG4udG9TdHJpbmcoMTYpO1xuICAgIC8vIFBhZCB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICByZXR1cm4gXCIjXCIgKyAobmV3IEFycmF5KDYgLSBzdHIubGVuZ3RoKSkuZmlsbChcIjBcIikuam9pbihcIlwiKSArIHN0cjtcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBGaXJlbnZpbUVsZW1lbnQgfSBmcm9tIFwiLi9GaXJlbnZpbUVsZW1lbnRcIjtcbmltcG9ydCB7IGF1dG9maWxsIH0gZnJvbSBcIi4vYXV0b2ZpbGxcIjtcbmltcG9ydCB7IGNvbmZSZWFkeSwgZ2V0Q29uZiB9IGZyb20gXCIuL3V0aWxzL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IGdldE5lb3ZpbUZyYW1lRnVuY3Rpb25zLCBnZXRBY3RpdmVDb250ZW50RnVuY3Rpb25zLCBnZXRUYWJGdW5jdGlvbnMgfSBmcm9tIFwiLi9wYWdlXCI7XG5cbmlmIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmID09PSBcImh0dHBzOi8vZ2l0aHViLmNvbS9nbGFjYW1icmUvZmlyZW52aW0vaXNzdWVzL25ld1wiXG4gICAgfHwgZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09IFwiZmlsZTpcIiAmJiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLmVuZHNXaXRoKFwiZ2l0aHViLmh0bWxcIikpIHtcbiAgICBhZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhdXRvZmlsbCk7XG59XG5cbi8vIFByb21pc2UgdXNlZCB0byBpbXBsZW1lbnQgYSBsb2NraW5nIG1lY2hhbmlzbSBwcmV2ZW50aW5nIGNvbmN1cnJlbnQgY3JlYXRpb25cbi8vIG9mIG5lb3ZpbSBmcmFtZXNcbmxldCBmcmFtZUlkTG9jayA9IFByb21pc2UucmVzb2x2ZSgpO1xuXG5leHBvcnQgY29uc3QgZmlyZW52aW1HbG9iYWwgPSB7XG4gICAgLy8gV2hldGhlciBGaXJlbnZpbSBpcyBkaXNhYmxlZCBpbiB0aGlzIHRhYlxuICAgIGRpc2FibGVkOiBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGFyZ3M6IFtcImRpc2FibGVkXCJdLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiBbXCJnZXRUYWJWYWx1ZVwiXSxcbiAgICAgICAgfSlcbiAgICAgICAgLy8gTm90ZTogdGhpcyByZWxpZXMgb24gc2V0RGlzYWJsZWQgZXhpc3RpbmcgaW4gdGhlIG9iamVjdCByZXR1cm5lZCBieVxuICAgICAgICAvLyBnZXRGdW5jdGlvbnMgYW5kIGF0dGFjaGVkIHRvIHRoZSB3aW5kb3cgb2JqZWN0XG4gICAgICAgIC50aGVuKChkaXNhYmxlZDogYm9vbGVhbikgPT4gKHdpbmRvdyBhcyBhbnkpLnNldERpc2FibGVkKGRpc2FibGVkKSksXG4gICAgLy8gUHJvbWlzZS1yZXNvbHV0aW9uIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgZnJhbWVJZCBpcyByZWNlaXZlZCBmcm9tIHRoZVxuICAgIC8vIGJhY2tncm91bmQgc2NyaXB0XG4gICAgZnJhbWVJZFJlc29sdmU6IChfOiBudW1iZXIpOiB2b2lkID0+IHVuZGVmaW5lZCxcbiAgICAvLyBsYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQga2VlcHMgdHJhY2sgb2YgdGhlIGxhc3QgY29udGVudCBmcmFtZSB0aGF0IGhhc1xuICAgIC8vIGJlZW4gZm9jdXNlZC4gVGhpcyBpcyBuZWNlc3NhcnkgaW4gcGFnZXMgdGhhdCBjb250YWluIG11bHRpcGxlIGZyYW1lc1xuICAgIC8vIChhbmQgdGh1cyBtdWx0aXBsZSBjb250ZW50IHNjcmlwdHMpOiBmb3IgZXhhbXBsZSwgaWYgdXNlcnMgcHJlc3MgdGhlXG4gICAgLy8gZ2xvYmFsIGtleWJvYXJkIHNob3J0Y3V0IDxDLW4+LCB0aGUgYmFja2dyb3VuZCBzY3JpcHQgc2VuZHMgYSBcImdsb2JhbFwiXG4gICAgLy8gbWVzc2FnZSB0byBhbGwgb2YgdGhlIGFjdGl2ZSB0YWIncyBjb250ZW50IHNjcmlwdHMuIEZvciBhIGNvbnRlbnQgc2NyaXB0XG4gICAgLy8gdG8ga25vdyBpZiBpdCBzaG91bGQgcmVhY3QgdG8gYSBnbG9iYWwgbWVzc2FnZSwgaXQganVzdCBuZWVkcyB0byBjaGVja1xuICAgIC8vIGlmIGl0IGlzIHRoZSBsYXN0IGFjdGl2ZSBjb250ZW50IHNjcmlwdC5cbiAgICBsYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQ6IDAsXG4gICAgLy8gbnZpbWlmeTogdHJpZ2dlcmVkIHdoZW4gYW4gZWxlbWVudCBpcyBmb2N1c2VkLCB0YWtlcyBjYXJlIG9mIGNyZWF0aW5nXG4gICAgLy8gdGhlIGVkaXRvciBpZnJhbWUsIGFwcGVuZGluZyBpdCB0byB0aGUgcGFnZSBhbmQgZm9jdXNpbmcgaXQuXG4gICAgbnZpbWlmeTogYXN5bmMgKGV2dDogeyB0YXJnZXQ6IEV2ZW50VGFyZ2V0IH0pID0+IHtcbiAgICAgICAgaWYgKGZpcmVudmltR2xvYmFsLmRpc2FibGVkIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgYXdhaXQgZmlyZW52aW1HbG9iYWwuZGlzYWJsZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIGNyZWF0aW5nIG5ldyBmcmFtZXMsIHdlIG5lZWQgdG8ga25vdyB0aGVpciBmcmFtZUlkIGluIG9yZGVyIHRvXG4gICAgICAgIC8vIGNvbW11bmljYXRlIHdpdGggdGhlbS4gVGhpcyBjYW4ndCBiZSByZXRyaWV2ZWQgdGhyb3VnaCBhXG4gICAgICAgIC8vIHN5bmNocm9ub3VzLCBpbi1wYWdlIGNhbGwgc28gdGhlIG5ldyBmcmFtZSBoYXMgdG8gdGVsbCB0aGVcbiAgICAgICAgLy8gYmFja2dyb3VuZCBzY3JpcHQgdG8gc2VuZCBpdHMgZnJhbWUgaWQgdG8gdGhlIHBhZ2UuIFByb2JsZW0gaXMsIGlmXG4gICAgICAgIC8vIG11bHRpcGxlIGZyYW1lcyBhcmUgY3JlYXRlZCBpbiBhIHZlcnkgc2hvcnQgYW1vdW50IG9mIHRpbWUsIHdlXG4gICAgICAgIC8vIGFyZW4ndCBndWFyYW50ZWVkIHRvIHJlY2VpdmUgdGhlc2UgZnJhbWVJZHMgaW4gdGhlIG9yZGVyIGluIHdoaWNoXG4gICAgICAgIC8vIHRoZSBmcmFtZXMgd2VyZSBjcmVhdGVkLiBTbyB3ZSBoYXZlIHRvIGltcGxlbWVudCBhIGxvY2tpbmcgbWVjaGFuaXNtXG4gICAgICAgIC8vIHRvIG1ha2Ugc3VyZSB0aGF0IHdlIGRvbid0IGNyZWF0ZSBuZXcgZnJhbWVzIHVudGlsIHdlIHJlY2VpdmVkIHRoZVxuICAgICAgICAvLyBmcmFtZUlkIG9mIHRoZSBwcmV2aW91c2x5IGNyZWF0ZWQgZnJhbWUuXG4gICAgICAgIGxldCBsb2NrO1xuICAgICAgICB3aGlsZSAobG9jayAhPT0gZnJhbWVJZExvY2spIHtcbiAgICAgICAgICAgIGxvY2sgPSBmcmFtZUlkTG9jaztcbiAgICAgICAgICAgIGF3YWl0IGZyYW1lSWRMb2NrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnJhbWVJZExvY2sgPSBuZXcgUHJvbWlzZShhc3luYyAodW5sb2NrOiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vIGF1dG8gaXMgdHJ1ZSB3aGVuIG52aW1pZnkoKSBpcyBjYWxsZWQgYXMgYW4gZXZlbnQgbGlzdGVuZXIsIGZhbHNlXG4gICAgICAgICAgICAvLyB3aGVuIGNhbGxlZCBmcm9tIGZvcmNlTnZpbWlmeSgpXG4gICAgICAgICAgICBjb25zdCBhdXRvID0gKGV2dCBpbnN0YW5jZW9mIEZvY3VzRXZlbnQpO1xuXG4gICAgICAgICAgICBjb25zdCB0YWtlb3ZlciA9IGdldENvbmYoKS50YWtlb3ZlcjtcbiAgICAgICAgICAgIGlmIChmaXJlbnZpbUdsb2JhbC5kaXNhYmxlZCB8fCAoYXV0byAmJiB0YWtlb3ZlciA9PT0gXCJuZXZlclwiKSkge1xuICAgICAgICAgICAgICAgIHVubG9jaygpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBlbG0gPSBldnQudGFyZ2V0O1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xlZXRjb2RlLmNuJykge1xuICAgICAgICAgICAgICBlbG0gPSAoZWxtIGFzIGFueSkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAod2luZG93IGFzIGFueSkuX19maXJlbnZpbV9tbnRfZWxtID0gZWxtO1xuICAgICAgICAgICAgKHdpbmRvdyBhcyBhbnkpLl9fZmlyZW52aW1fbW50X2VsbS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcbiAgICAgICAgICAgIGNvbnN0IGZpcmVudmltID0gbmV3IEZpcmVudmltRWxlbWVudChcbiAgICAgICAgICAgICAgICBldnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgICAgIGZpcmVudmltR2xvYmFsLm52aW1pZnksXG4gICAgICAgICAgICAgICAgKGlkOiBudW1iZXIpID0+IGZpcmVudmltR2xvYmFsLmZpcmVudmltRWxlbXMuZGVsZXRlKGlkKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGZpcmVudmltLmdldEVkaXRvcigpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgYWxyZWFkeSBoYXMgYSBuZW92aW0gZnJhbWUsIHN0b3BcbiAgICAgICAgICAgIGNvbnN0IGFscmVhZHlSdW5uaW5nID0gQXJyYXkuZnJvbShmaXJlbnZpbUdsb2JhbC5maXJlbnZpbUVsZW1zLnZhbHVlcygpKVxuICAgICAgICAgICAgICAgIC5maW5kKChpbnN0YW5jZSkgPT4gaW5zdGFuY2UuZ2V0RWxlbWVudCgpID09PSBlZGl0b3IuZ2V0RWxlbWVudCgpKTtcbiAgICAgICAgICAgIGlmIChhbHJlYWR5UnVubmluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIHNwYW4gbWlnaHQgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGFnZSBieSB0aGUgcGFnZVxuICAgICAgICAgICAgICAgIC8vICh0aGlzIGhhcHBlbnMgb24gSmlyYS9Db25mbHVlbmNlIGZvciBleGFtcGxlKSBzbyB3ZSBjaGVja1xuICAgICAgICAgICAgICAgIC8vIGZvciB0aGF0LlxuICAgICAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBhbHJlYWR5UnVubmluZy5nZXRTcGFuKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNwYW4ub3duZXJEb2N1bWVudC5jb250YWlucyhzcGFuKSkge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5UnVubmluZy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHlSdW5uaW5nLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHVubG9jaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHNwYW4gaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYWdlLCB0aGUgZWRpdG9yXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzIGRlYWQgYmVjYXVzZSByZW1vdmluZyBhbiBpZnJhbWUgZnJvbSB0aGUgcGFnZSBraWxsc1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgd2Vic29ja2V0IGNvbm5lY3Rpb24gaW5zaWRlIG9mIGl0LlxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBqdXN0IHRlbGwgdGhlIGVkaXRvciB0byBjbGVhbiBpdHNlbGYgdXAgYW5kIGdvIG9uIGFzXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGRpZG4ndCBleGlzdC5cbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeVJ1bm5pbmcuZGV0YWNoRnJvbVBhZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhdXRvICYmICh0YWtlb3ZlciA9PT0gXCJlbXB0eVwiIHx8IHRha2VvdmVyID09PSBcIm5vbmVtcHR5XCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IChhd2FpdCBlZGl0b3IuZ2V0Q29udGVudCgpKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKChjb250ZW50ICE9PSBcIlwiICYmIHRha2VvdmVyID09PSBcImVtcHR5XCIpXG4gICAgICAgICAgICAgICAgICAgIHx8IChjb250ZW50ID09PSBcIlwiICYmIHRha2VvdmVyID09PSBcIm5vbmVtcHR5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmxvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaXJlbnZpbS5wcmVwYXJlQnVmZmVySW5mbygpO1xuICAgICAgICAgICAgY29uc3QgZnJhbWVJZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKF86IG51bWJlcikgPT4gdm9pZCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZmlyZW52aW1HbG9iYWwuZnJhbWVJZFJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyB0aW1lb3V0IHRoZSBzYW1lIGFzIHRoZSBvbmUgaW4gYmFja2dyb3VuZC50c1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocmVqZWN0LCAxMDAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZyYW1lSWRQcm9taXNlLnRoZW4oKGZyYW1lSWQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGZpcmVudmltR2xvYmFsLmZpcmVudmltRWxlbXMuc2V0KGZyYW1lSWQsIGZpcmVudmltKTtcbiAgICAgICAgICAgICAgICBmaXJlbnZpbUdsb2JhbC5mcmFtZUlkUmVzb2x2ZSA9ICgpID0+IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB1bmxvY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnJhbWVJZFByb21pc2UuY2F0Y2godW5sb2NrKTtcbiAgICAgICAgICAgIGZpcmVudmltLmF0dGFjaFRvUGFnZShmcmFtZUlkUHJvbWlzZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBmaWVudmltRWxlbXMgbWFwcyBmcmFtZSBpZHMgdG8gZmlyZW52aW0gZWxlbWVudHMuXG4gICAgZmlyZW52aW1FbGVtczogbmV3IE1hcDxudW1iZXIsIEZpcmVudmltRWxlbWVudD4oKSxcbn07XG5cbmNvbnN0IG93bkZyYW1lSWQgPSBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBhcmdzOiBbXSwgZnVuY05hbWU6IFtcImdldE93bkZyYW1lSWRcIl0gfSk7XG5hc3luYyBmdW5jdGlvbiBhbm5vdW5jZUZvY3VzICgpIHtcbiAgICBjb25zdCBmcmFtZUlkID0gYXdhaXQgb3duRnJhbWVJZDtcbiAgICBmaXJlbnZpbUdsb2JhbC5sYXN0Rm9jdXNlZENvbnRlbnRTY3JpcHQgPSBmcmFtZUlkO1xuICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIGFyZ3M6IFsgZnJhbWVJZCBdLFxuICAgICAgICAgICAgZnVuY05hbWU6IFtcInNldExhc3RGb2N1c2VkQ29udGVudFNjcmlwdFwiXVxuICAgICAgICB9LFxuICAgICAgICBmdW5jTmFtZTogW1wibWVzc2FnZVBhZ2VcIl1cbiAgICB9KTtcbn1cbi8vIFdoZW4gdGhlIGZyYW1lIGlzIGNyZWF0ZWQsIHdlIG1pZ2h0IHJlY2VpdmUgZm9jdXMsIGNoZWNrIGZvciB0aGF0XG5vd25GcmFtZUlkLnRoZW4oXyA9PiB7XG4gICAgaWYgKGRvY3VtZW50Lmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgYW5ub3VuY2VGb2N1cygpO1xuICAgIH1cbn0pO1xuYXN5bmMgZnVuY3Rpb24gYWRkRm9jdXNMaXN0ZW5lciAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBhbm5vdW5jZUZvY3VzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGFubm91bmNlRm9jdXMpO1xufVxuYWRkRm9jdXNMaXN0ZW5lcigpO1xuLy8gV2UgbmVlZCB0byB1c2Ugc2V0SW50ZXJ2YWwgdG8gcGVyaW9kaWNhbGx5IHJlLWFkZCB0aGUgZm9jdXMgbGlzdGVuZXJzIGFzIGluXG4vLyBmcmFtZXMgdGhlIGRvY3VtZW50IGNvdWxkIGdldCBkZWxldGVkIGFuZCByZS1jcmVhdGVkIHdpdGhvdXQgb3VyIGtub3dsZWRnZS5cbmNvbnN0IGludGVydmFsSWQgPSBzZXRJbnRlcnZhbChhZGRGb2N1c0xpc3RlbmVyLCAxMDApO1xuLy8gQnV0IHdlIGRvbid0IHdhbnQgdG8gc3lwaG9uIHRoZSB1c2VyJ3MgYmF0dGVyeSBzbyB3ZSBzdG9wIGNoZWNraW5nIGFmdGVyIGEgc2Vjb25kXG5zZXRUaW1lb3V0KCgpID0+IGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCksIDEwMDApO1xuXG5leHBvcnQgY29uc3QgZnJhbWVGdW5jdGlvbnMgPSBnZXROZW92aW1GcmFtZUZ1bmN0aW9ucyhmaXJlbnZpbUdsb2JhbCk7XG5leHBvcnQgY29uc3QgYWN0aXZlRnVuY3Rpb25zID0gZ2V0QWN0aXZlQ29udGVudEZ1bmN0aW9ucyhmaXJlbnZpbUdsb2JhbCk7XG5leHBvcnQgY29uc3QgdGFiRnVuY3Rpb25zID0gZ2V0VGFiRnVuY3Rpb25zKGZpcmVudmltR2xvYmFsKTtcbk9iamVjdC5hc3NpZ24od2luZG93LCBmcmFtZUZ1bmN0aW9ucywgYWN0aXZlRnVuY3Rpb25zLCB0YWJGdW5jdGlvbnMpO1xuYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihhc3luYyAocmVxdWVzdDogeyBmdW5jTmFtZTogc3RyaW5nW10sIGFyZ3M6IGFueVtdIH0pID0+IHtcbiAgICAvLyBBbGwgY29udGVudCBzY3JpcHRzIG11c3QgcmVhY3QgdG8gdGFiIGZ1bmN0aW9uc1xuICAgIGxldCBmbiA9IHJlcXVlc3QuZnVuY05hbWUucmVkdWNlKChhY2M6IGFueSwgY3VyOiBzdHJpbmcpID0+IGFjY1tjdXJdLCB0YWJGdW5jdGlvbnMpO1xuICAgIGlmIChmbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmbiguLi5yZXF1ZXN0LmFyZ3MpO1xuICAgIH1cblxuICAgIC8vIFRoZSBvbmx5IGNvbnRlbnQgc2NyaXB0IHRoYXQgc2hvdWxkIHJlYWN0IHRvIGFjdGl2ZUZ1bmN0aW9ucyBpcyB0aGUgYWN0aXZlIG9uZVxuICAgIGZuID0gcmVxdWVzdC5mdW5jTmFtZS5yZWR1Y2UoKGFjYzogYW55LCBjdXI6IHN0cmluZykgPT4gYWNjW2N1cl0sIGFjdGl2ZUZ1bmN0aW9ucyk7XG4gICAgaWYgKGZuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGZpcmVudmltR2xvYmFsLmxhc3RGb2N1c2VkQ29udGVudFNjcmlwdCA9PT0gYXdhaXQgb3duRnJhbWVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuKC4uLnJlcXVlc3QuYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgLy8gVGhlIG9ubHkgY29udGVudCBzY3JpcHQgdGhhdCBzaG91bGQgcmVhY3QgdG8gZnJhbWVGdW5jdGlvbnMgaXMgdGhlIG9uZVxuICAgIC8vIHRoYXQgb3ducyB0aGUgZnJhbWUgdGhhdCBzZW50IHRoZSByZXF1ZXN0XG4gICAgZm4gPSByZXF1ZXN0LmZ1bmNOYW1lLnJlZHVjZSgoYWNjOiBhbnksIGN1cjogc3RyaW5nKSA9PiBhY2NbY3VyXSwgZnJhbWVGdW5jdGlvbnMpO1xuICAgIGlmIChmbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChmaXJlbnZpbUdsb2JhbC5maXJlbnZpbUVsZW1zLmdldChyZXF1ZXN0LmFyZ3NbMF0pICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmbiguLi5yZXF1ZXN0LmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3I6IHVuaGFuZGxlZCBjb250ZW50IHJlcXVlc3Q6ICR7SlNPTi5zdHJpbmdpZnkocmVxdWVzdCl9LmApO1xufSk7XG5cblxuZnVuY3Rpb24gc2V0dXBMaXN0ZW5lcnMoc2VsZWN0b3I6IHN0cmluZykge1xuICAgIGZ1bmN0aW9uIG9uU2Nyb2xsKGNvbnQ6IGJvb2xlYW4pIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3NDaGFuZ2VkID0gQXJyYXkuZnJvbShmaXJlbnZpbUdsb2JhbC5maXJlbnZpbUVsZW1zLmVudHJpZXMoKSlcbiAgICAgICAgICAgICAgICAubWFwKChbXywgZWxlbV0pID0+IGVsZW0ucHV0RWRpdG9yQ2xvc2VUb0lucHV0T3JpZ2luKCkpXG4gICAgICAgICAgICAgICAgLmZpbmQoY2hhbmdlZCA9PiBjaGFuZ2VkLnBvc0NoYW5nZWQpO1xuICAgICAgICAgICAgaWYgKHBvc0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBBcyBsb25nIGFzIG9uZSBlZGl0b3IgY2hhbmdlcyBwb3NpdGlvbiwgdHJ5IHRvIHJlc2l6ZVxuICAgICAgICAgICAgICAgIG9uU2Nyb2xsKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250KSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gZWRpdG9yIGhhcyBtb3ZlZCwgYnV0IHRoaXMgbWlnaHQgYmUgYmVjYXVzZSB0aGUgd2Vic2l0ZVxuICAgICAgICAgICAgICAgIC8vIGltcGxlbWVudHMgc29tZSBraW5kIG9mIHNtb290aCBzY3JvbGxpbmcgdGhhdCBkb2Vzbid0IG1ha2VcbiAgICAgICAgICAgICAgICAvLyB0aGUgdGV4dGFyZWEgbW92ZSBpbW1lZGlhdGVseS4gSW4gb3JkZXIgdG8gZGVhbCB3aXRoIHRoZXNlXG4gICAgICAgICAgICAgICAgLy8gY2FzZXMsIHNjaGVkdWxlIGEgbGFzdCByZWRyYXcgaW4gYSBmZXcgbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvblNjcm9sbChmYWxzZSksIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1Njcm9sbCgpIHtcbiAgICAgICAgcmV0dXJuIG9uU2Nyb2xsKHRydWUpO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBkb1Njcm9sbCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCBkb1Njcm9sbCk7XG4gICAgKG5ldyAoKHdpbmRvdyBhcyBhbnkpLlJlc2l6ZU9ic2VydmVyKSgoXzogYW55W10pID0+IHtcbiAgICAgICAgb25TY3JvbGwodHJ1ZSk7XG4gICAgfSkpLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblxuICAgIGZ1bmN0aW9uIGFkZE52aW1MaXN0ZW5lcihlbGVtOiBFbGVtZW50KSB7XG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZpcmVudmltR2xvYmFsLm52aW1pZnkpO1xuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmaXJlbnZpbUdsb2JhbC5udmltaWZ5KTtcbiAgICAgICAgbGV0IHBhcmVudCA9IGVsZW0ucGFyZW50RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZG9TY3JvbGwpO1xuICAgICAgICAgICAgcGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZG9TY3JvbGwpO1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAobmV3IE11dGF0aW9uT2JzZXJ2ZXIoKGNoYW5nZXMsIF8pID0+IHtcbiAgICAgICAgaWYgKGNoYW5nZXMuZmlsdGVyKGNoYW5nZSA9PiBjaGFuZ2UuYWRkZWROb2Rlcy5sZW5ndGggPiAwKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgbXV0YXRpb24gb2JzZXJ2ZXIgaXMgdHJpZ2dlcmVkIGV2ZXJ5IHRpbWUgYW4gZWxlbWVudCBpc1xuICAgICAgICAvLyBhZGRlZC9yZW1vdmVkIGZyb20gdGhlIHBhZ2UuIFdoZW4gdGhpcyBoYXBwZW5zLCB0cnkgdG8gYXBwbHlcbiAgICAgICAgLy8gbGlzdGVuZXJzIGFnYWluLCBpbiBjYXNlIGEgbmV3IHRleHRhcmVhL2lucHV0IGZpZWxkIGhhcyBiZWVuIGFkZGVkLlxuICAgICAgICBjb25zdCB0b1Bvc3NpYmx5TnZpbWlmeSA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgICAgICB0b1Bvc3NpYmx5TnZpbWlmeS5mb3JFYWNoKGVsZW0gPT4gYWRkTnZpbUxpc3RlbmVyKGVsZW0pKTtcblxuICAgICAgICBjb25zdCB0YWtlb3ZlciA9IGdldENvbmYoKS50YWtlb3ZlcjtcbiAgICAgICAgZnVuY3Rpb24gc2hvdWxkTnZpbWlmeShub2RlOiBhbnkpIHtcbiAgICAgICAgICAgIC8vIElkZWFsbHksIHRoZSB0YWtlb3ZlciAhPT0gXCJuZXZlclwiIGNoZWNrIHNob3VsZG4ndCBiZSBwZXJmb3JtZWRcbiAgICAgICAgICAgIC8vIGhlcmU6IGl0IHNob3VsZCBsaXZlIGluIG52aW1pZnkoKS4gSG93ZXZlciwgbnZpbWlmeSgpIG9ubHlcbiAgICAgICAgICAgIC8vIGNoZWNrcyBmb3IgdGFrZW92ZXIgPT09IFwibmV2ZXJcIiBpZiBpdCBpcyBjYWxsZWQgZnJvbSBhbiBldmVudFxuICAgICAgICAgICAgLy8gaGFuZGxlciAodGhpcyBpcyBuZWNlc3NhcnkgaW4gb3JkZXIgdG8gYWxsb3cgbWFudWFsbHkgbnZpbWlmeWluZ1xuICAgICAgICAgICAgLy8gZWxlbWVudHMpLiBUaHVzLCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRha2VvdmVyICE9PSBcIm5ldmVyXCIgaGVyZVxuICAgICAgICAgICAgLy8gdG9vLlxuICAgICAgICAgICAgcmV0dXJuIHRha2VvdmVyICE9PSBcIm5ldmVyXCJcbiAgICAgICAgICAgICAgICAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBub2RlXG4gICAgICAgICAgICAgICAgJiYgdG9Qb3NzaWJseU52aW1pZnkuaW5jbHVkZXMobm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBhbHNvIG5lZWQgdG8gY2hlY2sgaWYgdGhlIGN1cnJlbnRseSBmb2N1c2VkIGVsZW1lbnQgaXMgYW1vbmcgdGhlXG4gICAgICAgIC8vIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHMgYW5kIGlmIGl0IGlzLCBudmltaWZ5IGl0LlxuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgY2FuJ3QgZG8gdGhpcyB1bmNvbmRpdGlvbmFsbHk6IHdlIHdvdWxkIHR1cm4gdGhlIGFjdGl2ZVxuICAgICAgICAvLyBlbGVtZW50IGludG8gYSBuZW92aW0gZnJhbWUgZXZlbiBmb3IgdW5yZWxhdGVkIGRvbSBjaGFuZ2VzLlxuICAgICAgICBmb3IgKGNvbnN0IG1yIG9mIGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtci5hZGRlZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZE52aW1pZnkobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlRnVuY3Rpb25zLmZvcmNlTnZpbWlmeSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIobm9kZSwgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh3YWxrZXIubmV4dE5vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkTnZpbWlmeSh3YWxrZXIuY3VycmVudE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVGdW5jdGlvbnMuZm9yY2VOdmltaWZ5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSkub2JzZXJ2ZSh3aW5kb3cuZG9jdW1lbnQsIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuXG4gICAgbGV0IGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdO1xuICAgIHRyeSB7XG4gICAgICAgIGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIGFsZXJ0KGBGaXJlbnZpbSBlcnJvcjogaW52YWxpZCBDU1Mgc2VsZWN0b3IgKCR7c2VsZWN0b3J9KSBpbiB5b3VyIGc6ZmlyZW52aW1fY29uZmlnLmApO1xuICAgICAgICBlbGVtZW50cyA9IFtdO1xuICAgIH1cbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW0gPT4gYWRkTnZpbUxpc3RlbmVyKGVsZW0pKTtcbn1cblxuZXhwb3J0IGNvbnN0IGxpc3RlbmVyc1NldHVwID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgY29uZlJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBjb25mOiB7IHNlbGVjdG9yOiBzdHJpbmcgfSA9IGdldENvbmYoKTtcbiAgICAgICAgaWYgKGNvbmYuc2VsZWN0b3IgIT09IHVuZGVmaW5lZCAmJiBjb25mLnNlbGVjdG9yICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBzZXR1cExpc3RlbmVycyhjb25mLnNlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==