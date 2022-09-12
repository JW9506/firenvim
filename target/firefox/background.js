/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "preloadedInstance": () => (/* binding */ preloadedInstance)
/* harmony export */ });
/* harmony import */ var _utils_configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/configuration */ "./src/utils/configuration.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.ts");
/**
 * Browser extensions have multiple processes. This is the entry point for the
 * [background process](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts).
 * Our background process has multiple tasks:
 * - Keep track of per-tab values with its setTabValue/getTabValue functions
 * - Set the [browserActions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction)'s icon.
 * - Keep track of error messages/warnings that should are displayed in the
 *   browserAction.
 * - Update settings when the user changes their vimrc.
 * - Start new neovim instances when asked by a content script.
 * - Provide an RPC mechanism that enables calling background APIs from the
 *   browserAction/content script.
 *
 * The background process mostly acts as a slave for the browserAction and
 * content scripts. It rarely acts on its own.
 */


let preloadedInstance;
// We can't use the sessions.setTabValue/getTabValue apis firefox has because
// chrome doesn't support them. Instead, we create a map of tabid => {} kept in
// the background. This has the disadvantage of not surviving browser restarts,
// but's it's cross platform.
const tabValues = new Map();
function setTabValue(tabid, item, value) {
    let obj = tabValues.get(tabid);
    if (obj === undefined) {
        obj = { "disabled": false };
        tabValues.set(tabid, obj);
    }
    obj[item] = value;
}
function getTabValue(tabid, item) {
    const obj = tabValues.get(tabid);
    if (obj === undefined) {
        return undefined;
    }
    return obj[item];
}
async function updateIcon(tabid) {
    let name = "normal";
    if (tabid === undefined) {
        tabid = (await browser.tabs.query({ active: true, currentWindow: true }))[0].id;
    }
    if (getTabValue(tabid, "disabled") === true) {
        name = "disabled";
    }
    else if (error !== "") {
        name = "error";
    }
    else if (warning !== "") {
        name = "notification";
    }
    // Can't test on the bird of thunder
    /* istanbul ignore next */
    if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isThunderbird)()) {
        return Promise.resolve();
    }
    return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getIconImageData)(name).then((imageData) => browser.browserAction.setIcon({ imageData }));
}
// Os is win/mac/linux/androis/cros. We only use it to add information to error
// messages on windows.
let os = "";
browser.runtime.getPlatformInfo().then((plat) => os = plat.os);
// Last error message
let error = "";
// Simple getter for easy RPC calls. Can't be tested as requires opening
// browserAction.
/* istanbul ignore next */
function getError() {
    return error;
}
function registerErrors(nvim, reject) {
    error = "";
    const timeout = setTimeout(() => {
        nvim.timedOut = true;
        error = "Neovim is not responding.";
        updateIcon();
        nvim.disconnect();
        reject(error);
    }, 10000);
    nvim.onDisconnect.addListener(async (p) => {
        clearTimeout(timeout);
        updateIcon();
        // Unfortunately this error handling can't be tested as it requires
        // side-effects on the OS.
        /* istanbul ignore next */
        if (p.error) {
            const errstr = p.error.toString();
            if (errstr.match(/no such native application/i)) {
                error = "Native manifest not found. Please run `:call firenvim#install(0)` in neovim.";
            }
            else if (errstr.match(/an unexpected error occurred/i)) {
                error = "The script supposed to start neovim couldn't be found."
                    + " Please run `:call firenvim#install(0)` in neovim";
                if (os === "win") {
                    error += " or try running the scripts in %LOCALAPPDATA%\\firenvim\\";
                }
                error += ".";
            }
            else if (errstr.match(/Native application tried to send a message of/)) {
                error = "Unexpected output. Run `nvim --headless` and ensure it prints nothing.";
            }
            else {
                error = errstr;
            }
            updateIcon();
            reject(p.error);
        }
        else if (!nvim.replied && !nvim.timedOut) {
            error = "Neovim died without answering.";
            updateIcon();
            reject(error);
        }
    });
    return timeout;
}
// Last warning message
let warning = "";
/* istanbul ignore next */
function getWarning() {
    return warning;
}
let nvimPluginVersion = "";
async function checkVersion(nvimVersion) {
    nvimPluginVersion = nvimVersion;
    const manifest = browser.runtime.getManifest();
    warning = "";
    // Can't be tested as it would require side effects on the OS.
    /* istanbul ignore next */
    if (manifest.version !== nvimVersion) {
        warning = `Neovim plugin version (${nvimVersion}) and browser addon `
            + `version (${manifest.version}) do not match.`;
    }
    updateIcon();
}
// Function called in order to fill out default settings. Called from updateSettings.
function applySettings(settings) {
    return browser.storage.local.set((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.mergeWithDefaults)(os, settings));
}
function updateSettings() {
    const tmp = preloadedInstance;
    preloadedInstance = createNewInstance();
    tmp.then(nvim => nvim.kill());
    // It's ok to return the preloadedInstance as a promise because
    // settings are only applied when the preloadedInstance has returned a
    // port+settings object anyway.
    return preloadedInstance;
}
function createNewInstance() {
    return new Promise((resolve, reject) => {
        const random = new Uint32Array(8);
        window.crypto.getRandomValues(random);
        const password = Array.from(random).join("");
        const nvim = browser.runtime.connectNative("firenvim");
        const errorTimeout = registerErrors(nvim, reject);
        nvim.onMessage.addListener((resp) => {
            nvim.replied = true;
            clearTimeout(errorTimeout);
            checkVersion(resp.version);
            applySettings(resp.settings).finally(() => {
                resolve({
                    kill: () => nvim.disconnect(),
                    password,
                    port: resp.port,
                });
            });
        });
        nvim.postMessage({
            newInstance: true,
            password,
        });
    });
}
// Creating this first instance serves two purposes: make creating new neovim
// frames fast and also initialize settings the first time Firenvim is enabled
// in a browser.
preloadedInstance = createNewInstance();
async function toggleDisabled() {
    const tabid = (await browser.tabs.query({ active: true, currentWindow: true }))[0].id;
    const disabled = !getTabValue(tabid, "disabled");
    setTabValue(tabid, "disabled", disabled);
    updateIcon(tabid);
    return browser.tabs.sendMessage(tabid, { args: [disabled], funcName: ["setDisabled"] });
}
async function acceptCommand(command) {
    const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    let p;
    switch (command) {
        case "nvimify":
            p = browser.tabs.sendMessage(tab.id, { args: [], funcName: ["forceNvimify"] });
            break;
        case "send_C-n":
            p = browser.tabs.sendMessage(tab.id, { args: ["<C-n>"], funcName: ["sendKey"] });
            if ((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.getGlobalConf)()["<C-n>"] === "default") {
                p = p.catch(() => browser.windows.create());
            }
            break;
        case "send_C-t":
            p = browser.tabs.sendMessage(tab.id, { args: ["<C-t>"], funcName: ["sendKey"] });
            if ((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.getGlobalConf)()["<C-t>"] === "default") {
                p = p.catch(() => browser.tabs.create({ "windowId": tab.windowId }));
            }
            break;
        case "send_C-w":
            p = browser.tabs.sendMessage(tab.id, { args: ["<C-w>"], funcName: ["sendKey"] });
            if ((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.getGlobalConf)()["<C-w>"] === "default") {
                p = p.catch(() => browser.tabs.remove(tab.id));
            }
            break;
        case "send_CS-n":
            p = browser.tabs.sendMessage(tab.id, { args: ["<CS-n>"], funcName: ["sendKey"] });
            if ((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.getGlobalConf)()["<CS-n>"] === "default") {
                p = p.catch(() => browser.windows.create({ "incognito": true }));
            }
            break;
        case "send_CS-t":
            // <CS-t> can't be emulated without the sessions API.
            p = browser.tabs.sendMessage(tab.id, { args: ["<CS-t>"], funcName: ["sendKey"] });
            break;
        case "send_CS-w":
            p = browser.tabs.sendMessage(tab.id, { args: ["<CS-w>"], funcName: ["sendKey"] });
            if ((0,_utils_configuration__WEBPACK_IMPORTED_MODULE_0__.getGlobalConf)()["<CS-w>"] === "default") {
                p = p.catch(() => browser.windows.remove(tab.windowId));
            }
            break;
        case "toggle_firenvim":
            p = toggleDisabled();
            break;
    }
    return p;
}
Object.assign(window, {
    acceptCommand,
    // We need to stick the browser polyfill in `window` if we want the `exec`
    // call to be able to find it on Chrome
    browser,
    closeOwnTab: (sender) => browser.tabs.remove(sender.tab.id),
    exec: (_, args) => args.funcName.reduce((acc, cur) => acc[cur], window)(...(args.args)),
    getError,
    getNeovimInstance: () => {
        const result = preloadedInstance;
        preloadedInstance = createNewInstance();
        // Destructuring result to remove kill() from it
        return result.then(({ password, port }) => ({ password, port }));
    },
    getNvimPluginVersion: () => nvimPluginVersion,
    getOwnFrameId: (sender) => sender.frameId,
    getOwnComposeDetails: (sender) => browser.compose.getComposeDetails(sender.tab.id),
    getTab: (sender) => sender.tab,
    getTabValue: (sender, args) => getTabValue(sender.tab.id, args[0]),
    getTabValueFor: (_, args) => getTabValue(args[0], args[1]),
    getWarning,
    messageFrame: (sender, args) => browser.tabs.sendMessage(sender.tab.id, args.message, { frameId: args.frameId }),
    messagePage: (sender, args) => browser.tabs.sendMessage(sender.tab.id, args),
    publishFrameId: (sender) => {
        browser.tabs.sendMessage(sender.tab.id, {
            args: [sender.frameId],
            funcName: ["registerNewFrameId"],
        });
        return sender.frameId;
    },
    setTabValue: (sender, args) => setTabValue(sender.tab.id, args[0], args[1]),
    thunderbirdSend: (sender) => {
        return browser.compose.sendMessage(sender.tab.id, { mode: 'default' });
    },
    toggleDisabled: () => toggleDisabled(),
    updateSettings: () => updateSettings(),
    openTroubleshootingGuide: () => browser.tabs.create({ active: true, url: "https://github.com/glacambre/firenvim/blob/master/TROUBLESHOOTING.md" }),
});
browser.runtime.onMessage.addListener(async (request, sender, _sendResponse) => {
    const fn = request.funcName.reduce((acc, cur) => acc[cur], window);
    // Can't be tested as there's no way to force an incorrect content request.
    /* istanbul ignore next */
    if (!fn) {
        throw new Error(`Error: unhandled content request: ${JSON.stringify(request)}.`);
    }
    return fn(sender, request.args !== undefined ? request.args : []);
});
browser.tabs.onActivated.addListener(tab => {
    updateIcon(tab.tabId);
});
browser.windows.onFocusChanged.addListener(async (windowId) => {
    const tabs = await browser.tabs.query({ active: true, windowId });
    if (tabs.length >= 1) {
        updateIcon(tabs[0].id);
    }
});
updateIcon();
// browser.commands doesn't exist in thunderbird. Else branch can't be covered
// so don't instrument the if.
/* istanbul ignore next */
if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isThunderbird)()) {
    browser.commands.onCommand.addListener(acceptCommand);
    browser.runtime.onMessageExternal.addListener(async (request, sender, _sendResponse) => {
        const resp = await acceptCommand(request.command);
        _sendResponse(resp);
    });
}
async function updateIfPossible() {
    const tabs = await browser.tabs.query({});
    const messages = tabs.map(tab => browser
        .tabs
        .sendMessage(tab.id, {
        args: [],
        funcName: ["getActiveInstanceCount"],
    }, { frameId: 0 })
        .catch(() => 0));
    const instances = await (Promise.all(messages));
    // Can't be covered as reload() would destroy websockets and thus coverage
    // data.
    /* istanbul ignore next */
    if (instances.find(n => n > 0) === undefined) {
        browser.runtime.reload();
    }
    else {
        setTimeout(updateIfPossible, 1000 * 60 * 10);
    }
}
window.updateIfPossible = updateIfPossible;
browser.runtime.onUpdateAvailable.addListener(updateIfPossible);
// Can't test on the bird of thunder
/* istanbul ignore next */
if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isThunderbird)()) {
    browser.compose.onBeforeSend.addListener(async (tab, details) => {
        const lines = (await browser.tabs.sendMessage(tab.id, { args: [], funcName: ["get_buf_content"] }));
        // No need to remove the canvas when working with plaintext,
        // thunderbird will do that for us.
        if (details.isPlainText) {
            // Firenvim has to cancel the beforeinput event on the compose
            // window's documentElement in order to prevent the canvas from
            // being destroyed. However, thunderbird has a bug where cancelling
            // this event will prevent onBeforeSend from setting the compose
            // window's content when editing plaintext emails.
            // We work around this by telling the compose script to temporarily
            // stop cancelling events.
            await browser.tabs.sendMessage(tab.id, { args: [], funcName: ["pause_keyhandler"] });
            return { cancel: false, details: { plainTextBody: lines.join("\n") } };
        }
        const doc = document.createElement("html");
        const bod = document.createElement("body");
        doc.appendChild(bod);
        // Turn `>` into appropriate blockquote elements.
        let previousQuoteLevel = 0;
        let parent = bod;
        for (const l of lines) {
            let currentQuoteLevel = 0;
            // Count number of ">" symbols
            let i = 0;
            while (l[i] === " " || l[i] === ">") {
                if (l[i] === ">") {
                    currentQuoteLevel += 1;
                }
                i += 1;
            }
            const line = l.slice(i);
            if (currentQuoteLevel > previousQuoteLevel) {
                for (let i = previousQuoteLevel; i < currentQuoteLevel; ++i) {
                    const block = document.createElement("blockquote");
                    block.setAttribute("type", "cite");
                    parent.appendChild(block);
                    parent = block;
                }
            }
            else if (currentQuoteLevel < previousQuoteLevel) {
                for (let i = previousQuoteLevel; i > currentQuoteLevel; --i) {
                    parent = parent.parentElement;
                }
            }
            parent.appendChild(document.createTextNode(line));
            parent.appendChild(document.createElement("br"));
            previousQuoteLevel = currentQuoteLevel;
        }
        return { cancel: false, details: { body: doc.outerHTML } };
    });
    // In thunderbird, register the script to be loaded in the compose window
    browser.composeScripts.register({
        js: [{ file: "compose.js" }],
    });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRWpELGtCQUFrQixHQUFHLGlCQUFpQixDQUFDO1NBQzFDO1FBQ0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ0gseUVBQXlFO0lBQ3hFLE9BQWUsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQ3JDLEVBQUUsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxDQUFDO0tBQzdCLENBQUMsQ0FBQztDQUNOIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRmlyZW52aW0vLi9zcmMvdXRpbHMvY29uZmlndXJhdGlvbi50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS8uL3NyYy91dGlscy91dGlscy50cyIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vRmlyZW52aW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9GaXJlbnZpbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0ZpcmVudmltLy4vc3JjL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlc2UgbW9kZXMgYXJlIGRlZmluZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL25lb3ZpbS9uZW92aW0vYmxvYi9tYXN0ZXIvc3JjL252aW0vY3Vyc29yX3NoYXBlLmNcbmV4cG9ydCB0eXBlIE52aW1Nb2RlID0gXCJhbGxcIlxuICB8IFwibm9ybWFsXCJcbiAgfCBcInZpc3VhbFwiXG4gIHwgXCJpbnNlcnRcIlxuICB8IFwicmVwbGFjZVwiXG4gIHwgXCJjbWRsaW5lX25vcm1hbFwiXG4gIHwgXCJjbWRsaW5lX2luc2VydFwiXG4gIHwgXCJjbWRsaW5lX3JlcGxhY2VcIlxuICB8IFwib3BlcmF0b3JcIlxuICB8IFwidmlzdWFsX3NlbGVjdFwiXG4gIHwgXCJjbWRsaW5lX2hvdmVyXCJcbiAgfCBcInN0YXR1c2xpbmVfaG92ZXJcIlxuICB8IFwic3RhdHVzbGluZV9kcmFnXCJcbiAgfCBcInZzZXBfaG92ZXJcIlxuICB8IFwidnNlcF9kcmFnXCJcbiAgfCBcIm1vcmVcIlxuICB8IFwibW9yZV9sYXN0bGluZVwiXG4gIHwgXCJzaG93bWF0Y2hcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJU2l0ZUNvbmZpZyB7XG4gICAgY21kbGluZTogXCJuZW92aW1cIiB8IFwiZmlyZW52aW1cIjtcbiAgICBjb250ZW50OiBcImh0bWxcIiB8IFwidGV4dFwiO1xuICAgIHByaW9yaXR5OiBudW1iZXI7XG4gICAgcmVuZGVyZXI6IFwiaHRtbFwiIHwgXCJjYW52YXNcIjtcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xuICAgIHRha2VvdmVyOiBcImFsd2F5c1wiIHwgXCJvbmNlXCIgfCBcImVtcHR5XCIgfCBcIm5vbmVtcHR5XCIgfCBcIm5ldmVyXCI7XG4gICAgZmlsZW5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgR2xvYmFsU2V0dGluZ3MgPSB7XG4gIGFsdDogXCJhbHBoYW51bVwiIHwgXCJhbGxcIixcbiAgXCI8Qy1uPlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiLFxuICBcIjxDLXQ+XCI6IFwiZGVmYXVsdFwiIHwgXCJub29wXCIsXG4gIFwiPEMtdz5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Q1Mtbj5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Q1MtdD5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgXCI8Q1Mtdz5cIjogXCJkZWZhdWx0XCIgfCBcIm5vb3BcIixcbiAgaWdub3JlS2V5czogeyBba2V5IGluIE52aW1Nb2RlXTogc3RyaW5nW10gfSxcbiAgY21kbGluZVRpbWVvdXQ6IG51bWJlcixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ29uZmlnIHtcbiAgICBnbG9iYWxTZXR0aW5nczogR2xvYmFsU2V0dGluZ3M7XG4gICAgbG9jYWxTZXR0aW5nczogeyBba2V5OiBzdHJpbmddOiBJU2l0ZUNvbmZpZyB9O1xufVxuXG5sZXQgY29uZjogSUNvbmZpZyA9IHVuZGVmaW5lZCBhcyBJQ29uZmlnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VXaXRoRGVmYXVsdHMob3M6IHN0cmluZywgc2V0dGluZ3M6IGFueSk6IElDb25maWcge1xuICAgIGZ1bmN0aW9uIG1ha2VEZWZhdWx0cyhvYmo6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAob2JqW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9ialtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VEZWZhdWx0TG9jYWxTZXR0aW5nKHNldHQ6IHsgbG9jYWxTZXR0aW5nczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpdGU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmo6IElTaXRlQ29uZmlnKSB7XG4gICAgICAgIG1ha2VEZWZhdWx0cyhzZXR0LmxvY2FsU2V0dGluZ3MsIHNpdGUsIHt9KTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgKE9iamVjdC5rZXlzKG9iaikgYXMgKGtleW9mIHR5cGVvZiBvYmopW10pKSB7XG4gICAgICAgICAgICBtYWtlRGVmYXVsdHMoc2V0dC5sb2NhbFNldHRpbmdzW3NpdGVdLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0aW5ncyA9IHt9O1xuICAgIH1cblxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncywgXCJnbG9iYWxTZXR0aW5nc1wiLCB7fSk7XG4gICAgLy8gXCI8S0VZPlwiOiBcImRlZmF1bHRcIiB8IFwibm9vcFwiXG4gICAgLy8gIzEwMzogV2hlbiB1c2luZyB0aGUgYnJvd3NlcidzIGNvbW1hbmQgQVBJIHRvIGFsbG93IHNlbmRpbmcgYDxDLXc+YCB0b1xuICAgIC8vIGZpcmVudmltLCB3aGV0aGVyIHRoZSBkZWZhdWx0IGFjdGlvbiBzaG91bGQgYmUgcGVyZm9ybWVkIGlmIG5vIG5lb3ZpbVxuICAgIC8vIGZyYW1lIGlzIGZvY3VzZWQuXG4gICAgbWFrZURlZmF1bHRzKHNldHRpbmdzLmdsb2JhbFNldHRpbmdzLCBcIjxDLW4+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPEMtdD5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Qy13PlwiLCBcImRlZmF1bHRcIik7XG4gICAgLy8gTm90ZTogPENTLSo+IGFyZSBjdXJyZW50bHkgZGlzYWJsZWQgYmVjYXVzZSBvZlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uZW92aW0vbmVvdmltL2lzc3Vlcy8xMjAzN1xuICAgIC8vIE5vdGU6IDxDUy1uPiBkb2Vzbid0IG1hdGNoIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9uIGZpcmVmb3ggYmVjYXVzZSB0aGlzXG4gICAgLy8gd291bGQgcmVxdWlyZSB0aGUgc2Vzc2lvbnMgQVBJLiBJbnN0ZWFkLCBGaXJlZm94J3MgYmVoYXZpb3IgbWF0Y2hlc1xuICAgIC8vIENocm9tZSdzLlxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCI8Q1Mtbj5cIiwgXCJkZWZhdWx0XCIpO1xuICAgIC8vIE5vdGU6IDxDUy10PiBpcyB0aGVyZSBmb3IgY29tcGxldGVuZXNzIHNha2UncyBidXQgY2FuJ3QgYmUgZW11bGF0ZWQgaW5cbiAgICAvLyBDaHJvbWUgYW5kIEZpcmVmb3ggYmVjYXVzZSB0aGlzIHdvdWxkIHJlcXVpcmUgdGhlIHNlc3Npb25zIEFQSS5cbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPENTLXQ+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiPENTLXc+XCIsIFwiZGVmYXVsdFwiKTtcbiAgICAvLyAjNzE3OiBhbGxvdyBwYXNzaW5nIGtleXMgdG8gdGhlIGJyb3dzZXJcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiaWdub3JlS2V5c1wiLCB7fSk7XG4gICAgLy8gIzEwNTA6IGN1cnNvciBzb21ldGltZXMgY292ZXJlZCBieSBjb21tYW5kIGxpbmVcbiAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiY21kbGluZVRpbWVvdXRcIiwgMzAwMCk7XG5cbiAgICAvLyBcImFsdFwiOiBcImFsbFwiIHwgXCJhbHBoYW51bVwiXG4gICAgLy8gIzIwMjogT25seSByZWdpc3RlciBhbHQga2V5IG9uIGFscGhhbnVtcyB0byBsZXQgc3dlZGlzaCBvc3ggdXNlcnMgdHlwZVxuICAgIC8vICAgICAgIHNwZWNpYWwgY2hhcnNcbiAgICAvLyBPbmx5IHRlc3RlZCBvbiBPU1gsIHdoZXJlIHdlIGRvbid0IHB1bGwgY292ZXJhZ2UgcmVwb3J0cywgc28gZG9uJ3RcbiAgICAvLyBpbnN0cnVtZW50IGZ1bmN0aW9uLlxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKG9zID09PSBcIm1hY1wiKSB7XG4gICAgICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncy5nbG9iYWxTZXR0aW5ncywgXCJhbHRcIiwgXCJhbHBoYW51bVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYWtlRGVmYXVsdHMoc2V0dGluZ3MuZ2xvYmFsU2V0dGluZ3MsIFwiYWx0XCIsIFwiYWxsXCIpO1xuICAgIH1cblxuICAgIG1ha2VEZWZhdWx0cyhzZXR0aW5ncywgXCJsb2NhbFNldHRpbmdzXCIsIHt9KTtcbiAgICBtYWtlRGVmYXVsdExvY2FsU2V0dGluZyhzZXR0aW5ncywgXCIuKlwiLCB7XG4gICAgICAgIC8vIFwiY21kbGluZVwiOiBcIm5lb3ZpbVwiIHwgXCJmaXJlbnZpbVwiXG4gICAgICAgIC8vICMxNjg6IFVzZSBhbiBleHRlcm5hbCBjb21tYW5kbGluZSB0byBwcmVzZXJ2ZSBzcGFjZVxuICAgICAgICBjbWRsaW5lOiBcImZpcmVudmltXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwidGV4dFwiLFxuICAgICAgICBwcmlvcml0eTogMCxcbiAgICAgICAgcmVuZGVyZXI6IFwiY2FudmFzXCIsXG4gICAgICAgIHNlbGVjdG9yOiAndGV4dGFyZWE6bm90KFtyZWFkb25seV0pLCBkaXZbcm9sZT1cInRleHRib3hcIl0nLFxuICAgICAgICAvLyBcInRha2VvdmVyXCI6IFwiYWx3YXlzXCIgfCBcIm9uY2VcIiB8IFwiZW1wdHlcIiB8IFwibm9uZW1wdHlcIiB8IFwibmV2ZXJcIlxuICAgICAgICAvLyAjMjY1OiBPbiBcIm9uY2VcIiwgZG9uJ3QgYXV0b21hdGljYWxseSBicmluZyBiYWNrIGFmdGVyIDpxJ2luZyBpdFxuICAgICAgICB0YWtlb3ZlcjogXCJhbHdheXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwie2hvc3RuYW1lJTMyfV97cGF0aG5hbWUlMzJ9X3tzZWxlY3RvciUzMn1fe3RpbWVzdGFtcCUzMn0ue2V4dGVuc2lvbn1cIixcbiAgICB9KTtcbiAgICBtYWtlRGVmYXVsdExvY2FsU2V0dGluZyhzZXR0aW5ncywgXCJhYm91dDpibGFua1xcXFw/Y29tcG9zZVwiLCB7XG4gICAgICAgIGNtZGxpbmU6IFwiZmlyZW52aW1cIixcbiAgICAgICAgY29udGVudDogXCJ0ZXh0XCIsXG4gICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICByZW5kZXJlcjogXCJjYW52YXNcIixcbiAgICAgICAgc2VsZWN0b3I6ICdib2R5JyxcbiAgICAgICAgdGFrZW92ZXI6IFwiYWx3YXlzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIm1haWxfe3RpbWVzdGFtcCUzMn0uZW1sXCIsXG4gICAgfSk7XG4gICAgcmV0dXJuIHNldHRpbmdzO1xufVxuXG5leHBvcnQgY29uc3QgY29uZlJlYWR5ID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLmdldCgpLnRoZW4oKG9iajogYW55KSA9PiB7XG4gICAgICAgIGNvbmYgPSBvYmo7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG59KTtcblxuYnJvd3Nlci5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlczogYW55KSA9PiB7XG4gICAgT2JqZWN0XG4gICAgICAgIC5lbnRyaWVzKGNoYW5nZXMpXG4gICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV06IFtrZXlvZiBJQ29uZmlnLCBhbnldKSA9PiBjb25mUmVhZHkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25mW2tleV0gPSB2YWx1ZS5uZXdWYWx1ZTtcbiAgICAgICAgfSkpO1xufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxDb25mKCkge1xuICAgIC8vIENhbid0IGJlIHRlc3RlZCBmb3JcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChjb25mID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0R2xvYmFsQ29uZiBjYWxsZWQgYmVmb3JlIGNvbmZpZyB3YXMgcmVhZHlcIik7XG4gICAgfVxuICAgIHJldHVybiBjb25mLmdsb2JhbFNldHRpbmdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZigpIHtcbiAgICByZXR1cm4gZ2V0Q29uZkZvclVybChkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZGb3JVcmwodXJsOiBzdHJpbmcpOiBJU2l0ZUNvbmZpZyB7XG4gICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IGNvbmYubG9jYWxTZXR0aW5ncztcbiAgICBmdW5jdGlvbiBvcjEodmFsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICAvLyBDYW4ndCBiZSB0ZXN0ZWQgZm9yXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAobG9jYWxTZXR0aW5ncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yOiB5b3VyIHNldHRpbmdzIGFyZSB1bmRlZmluZWQuIFRyeSByZWxvYWRpbmcgdGhlIHBhZ2UuIElmIHRoaXMgZXJyb3IgcGVyc2lzdHMsIHRyeSB0aGUgdHJvdWJsZXNob290aW5nIGd1aWRlOiBodHRwczovL2dpdGh1Yi5jb20vZ2xhY2FtYnJlL2ZpcmVudmltL2Jsb2IvbWFzdGVyL1RST1VCTEVTSE9PVElORy5tZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oT2JqZWN0LmVudHJpZXMobG9jYWxTZXR0aW5ncykpXG4gICAgICAgIC5maWx0ZXIoKFtwYXQsIF9dKSA9PiAobmV3IFJlZ0V4cChwYXQpKS50ZXN0KHVybCkpXG4gICAgICAgIC5zb3J0KChlMSwgZTIpID0+IChvcjEoZTFbMV0ucHJpb3JpdHkpIC0gb3IxKGUyWzFdLnByaW9yaXR5KSkpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgW18sIGN1cl0pID0+IE9iamVjdC5hc3NpZ24oYWNjLCBjdXIpLCB7fSBhcyBJU2l0ZUNvbmZpZyk7XG59XG4iLCJsZXQgY3VySG9zdCA6IHN0cmluZztcblxuLy8gQ2FuJ3QgZ2V0IGNvdmVyYWdlIGZvciB0aHVuZGVyYmlyZC5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoKGJyb3dzZXIgYXMgYW55KS5jb21wb3NlU2NyaXB0cyAhPT0gdW5kZWZpbmVkIHx8IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPT09IFwiYWJvdXQ6Ymxhbms/Y29tcG9zZVwiKSB7XG4gICAgY3VySG9zdCA9IFwidGh1bmRlcmJpcmRcIjtcbi8vIENocm9tZSBkb2Vzbid0IGhhdmUgYSBcImJyb3dzZXJcIiBvYmplY3QsIGluc3RlYWQgaXQgdXNlcyBcImNocm9tZVwiLlxufSBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09IFwibW96LWV4dGVuc2lvbjpcIikge1xuICAgIGN1ckhvc3QgPSBcImZpcmVmb3hcIjtcbn0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSBcImNocm9tZS1leHRlbnNpb246XCIpIHtcbiAgICBjdXJIb3N0ID0gXCJjaHJvbWVcIjtcbn1cblxuLy8gT25seSB1c2FibGUgaW4gYmFja2dyb3VuZCBzY3JpcHQhXG5leHBvcnQgZnVuY3Rpb24gaXNDaHJvbWUoKSB7XG4gICAgLy8gQ2FuJ3QgY292ZXIgZXJyb3IgY29uZGl0aW9uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoY3VySG9zdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiVXNlZCBpc0Nocm9tZSBpbiBjb250ZW50IHNjcmlwdCFcIik7XG4gICAgfVxuICAgIHJldHVybiBjdXJIb3N0ID09PSBcImNocm9tZVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVGh1bmRlcmJpcmQoKSB7XG4gICAgLy8gQ2FuJ3QgY292ZXIgZXJyb3IgY29uZGl0aW9uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoY3VySG9zdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiVXNlZCBpc1RodW5kZXJiaXJkIGluIGNvbnRlbnQgc2NyaXB0IVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1ckhvc3QgPT09IFwidGh1bmRlcmJpcmRcIjtcbn1cblxuLy8gUnVucyBDT0RFIGluIHRoZSBwYWdlJ3MgY29udGV4dCBieSBzZXR0aW5nIHVwIGEgY3VzdG9tIGV2ZW50IGxpc3RlbmVyLFxuLy8gZW1iZWRkaW5nIGEgc2NyaXB0IGVsZW1lbnQgdGhhdCBydW5zIHRoZSBwaWVjZSBvZiBjb2RlIGFuZCBlbWl0cyBpdHMgcmVzdWx0XG4vLyBhcyBhbiBldmVudC5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlSW5QYWdlKGNvZGU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgY29uc3QgZXZlbnRJZCA9IChuZXcgVVJMKGJyb3dzZXIucnVudGltZS5nZXRVUkwoXCJcIikpKS5ob3N0bmFtZSArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIHNjcmlwdC5pbm5lckhUTUwgPSBgKGFzeW5jIChldklkKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgJHtjb2RlfTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZJZCwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2SWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IHN1Y2Nlc3M6IGZhbHNlLCByZWFzb246IGUgfSxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCR7SlNPTi5zdHJpbmdpZnkoZXZlbnRJZCl9KWA7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50SWQsICh7IGRldGFpbCB9OiBhbnkpID0+IHtcbiAgICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICBpZiAoZGV0YWlsLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZXRhaWwucmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZGV0YWlsLnJlYXNvbik7XG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH0pO1xufVxuXG4vLyBWYXJpb3VzIGZpbHRlcnMgdGhhdCBhcmUgdXNlZCB0byBjaGFuZ2UgdGhlIGFwcGVhcmFuY2Ugb2YgdGhlIEJyb3dzZXJBY3Rpb25cbi8vIGljb24uXG5jb25zdCBzdmdwYXRoID0gXCJmaXJlbnZpbS5zdmdcIjtcbmNvbnN0IHRyYW5zZm9ybWF0aW9ucyA9IHtcbiAgICBkaXNhYmxlZDogKGltZzogVWludDhDbGFtcGVkQXJyYXkpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWcubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgICAgIC8vIFNraXAgdHJhbnNwYXJlbnQgcGl4ZWxzXG4gICAgICAgICAgICBpZiAoaW1nW2kgKyAzXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWVhbiA9IE1hdGguZmxvb3IoKGltZ1tpXSArIGltZ1tpICsgMV0gKyBpbWdbaSArIDJdKSAvIDMpO1xuICAgICAgICAgICAgaW1nW2ldID0gbWVhbjtcbiAgICAgICAgICAgIGltZ1tpICsgMV0gPSBtZWFuO1xuICAgICAgICAgICAgaW1nW2kgKyAyXSA9IG1lYW47XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVycm9yOiAoaW1nOiBVaW50OENsYW1wZWRBcnJheSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICAgICAgLy8gVHVybiB0cmFuc3BhcmVudCBwaXhlbHMgcmVkXG4gICAgICAgICAgICBpZiAoaW1nW2kgKyAzXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGltZ1tpXSA9IDI1NTtcbiAgICAgICAgICAgICAgICBpbWdbaSArIDNdID0gMjU1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBub3JtYWw6ICgoX2ltZzogVWludDhDbGFtcGVkQXJyYXkpID0+ICh1bmRlZmluZWQgYXMgbmV2ZXIpKSxcbiAgICBub3RpZmljYXRpb246IChpbWc6IFVpbnQ4Q2xhbXBlZEFycmF5KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgICAgICAvLyBUdXJuIHRyYW5zcGFyZW50IHBpeGVscyB5ZWxsb3dcbiAgICAgICAgICAgIGlmIChpbWdbaSArIDNdID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaW1nW2ldID0gMjU1O1xuICAgICAgICAgICAgICAgIGltZ1tpICsgMV0gPSAyNTU7XG4gICAgICAgICAgICAgICAgaW1nW2kgKyAzXSA9IDI1NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5leHBvcnQgdHlwZSBJY29uS2luZCA9IGtleW9mIHR5cGVvZiB0cmFuc2Zvcm1hdGlvbnM7XG5cbi8vIFRha2VzIGFuIGljb24ga2luZCBhbmQgZGltZW5zaW9ucyBhcyBwYXJhbWV0ZXIsIGRyYXdzIHRoYXQgdG8gYSBjYW52YXMgYW5kXG4vLyByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgY2FudmFzJyBpbWFnZSBkYXRhLlxuZXhwb3J0IGZ1bmN0aW9uIGdldEljb25JbWFnZURhdGEoa2luZDogSWNvbktpbmQsIHdpZHRoID0gMzIsIGhlaWdodCA9IDMyKSB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjb25zdCBpZCA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRyYW5zZm9ybWF0aW9uc1traW5kXShpZC5kYXRhKTtcbiAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgfSkpO1xuICAgIGltZy5zcmMgPSBzdmdwYXRoO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEdpdmVuIGEgdXJsIGFuZCBhIHNlbGVjdG9yLCB0cmllcyB0byBjb21wdXRlIGEgbmFtZSB0aGF0IHdpbGwgYmUgdW5pcXVlLFxuLy8gc2hvcnQgYW5kIHJlYWRhYmxlIGZvciB0aGUgdXNlci5cbmV4cG9ydCBmdW5jdGlvbiB0b0ZpbGVOYW1lKGZvcm1hdFN0cmluZzogc3RyaW5nLCB1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgbGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIGxldCBwYXJzZWRVUkw6IHsgaG9zdG5hbWU6IHN0cmluZywgcGF0aG5hbWU6IHN0cmluZyB9O1xuICAgIHRyeSB7XG4gICAgICAgIHBhcnNlZFVSTCA9IG5ldyBVUkwodXJsKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIE9ubHkgaGFwcGVucyB3aXRoIHRodW5kZXJiaXJkLCB3aGVyZSB3ZSBjYW4ndCBnZXQgY292ZXJhZ2VcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgcGFyc2VkVVJMID0geyBob3N0bmFtZTogJ3RodW5kZXJiaXJkJywgcGF0aG5hbWU6ICdtYWlsJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IHNhbml0aXplID0gKHM6IHN0cmluZykgPT4gKHMubWF0Y2goL1thLXpBLVowLTldKy9nKSB8fCBbXSkuam9pbihcIi1cIik7XG5cbiAgICBjb25zdCBleHBhbmQgPSAocGF0dGVybjogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vQnJhY2tldHMgPSBwYXR0ZXJuLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgY29uc3QgW3N5bWJvbCwgbGVuZ3RoXSA9IG5vQnJhY2tldHMuc3BsaXQoXCIlXCIpO1xuICAgICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgICBzd2l0Y2ggKHN5bWJvbCkge1xuICAgICAgICAgICAgY2FzZSBcImhvc3RuYW1lXCI6IHZhbHVlID0gcGFyc2VkVVJMLmhvc3RuYW1lOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYXRobmFtZVwiOiB2YWx1ZSA9IHNhbml0aXplKHBhcnNlZFVSTC5wYXRobmFtZSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNlbGVjdG9yXCI6IHZhbHVlID0gc2FuaXRpemUoaWQucmVwbGFjZSgvOm50aC1vZi10eXBlL2csIFwiXCIpKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidGltZXN0YW1wXCI6IHZhbHVlID0gc2FuaXRpemUoKG5ldyBEYXRlKCkpLnRvSVNPU3RyaW5nKCkpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHRlbnNpb25cIjogdmFsdWUgPSBsYW5ndWFnZVRvRXh0ZW5zaW9ucyhsYW5ndWFnZSk7IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogY29uc29sZS5lcnJvcihgVW5yZWNvZ25pemVkIGZpbGVuYW1lIHBhdHRlcm46ICR7cGF0dGVybn1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUuc2xpY2UoLWxlbmd0aCk7XG4gICAgfTtcblxuICAgIGxldCByZXN1bHQgPSBmb3JtYXRTdHJpbmc7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGZvcm1hdFN0cmluZy5tYXRjaCgve1tefV0qfS9nKTtcbiAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCkge1xuICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMuZmlsdGVyKHMgPT4gcyAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UobWF0Y2gsIGV4cGFuZChtYXRjaCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEdpdmVuIGEgbGFuZ3VhZ2UgbmFtZSwgcmV0dXJucyBhIGZpbGVuYW1lIGV4dGVuc2lvbi4gQ2FuIHJldHVybiB1bmRlZmluZWQuXG5leHBvcnQgZnVuY3Rpb24gbGFuZ3VhZ2VUb0V4dGVuc2lvbnMobGFuZ3VhZ2U6IHN0cmluZykge1xuICAgIC8vIGlmIChsYW5ndWFnZSA9PT0gdW5kZWZpbmVkIHx8IGxhbmd1YWdlID09PSBudWxsKSB7XG4gICAgLy8gICAgIGxhbmd1YWdlID0gXCJcIjtcbiAgICAvLyB9XG4gICAgLy8gY29uc3QgbGFuZyA9IGxhbmd1YWdlLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAvLyBzd2l0Y2ggKGxhbmcpIHtcbiAgICAvLyAgICAgY2FzZSBcImFwbFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwiYXBsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJicmFpbmZ1Y2tcIjogICAgICAgIHJldHVybiBcImJmXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjXCI6ICAgICAgICAgICAgICAgIHJldHVybiBcImNcIjtcbiAgICAvLyAgICAgY2FzZSBcImMjXCI6ICAgICAgICAgICAgICAgcmV0dXJuIFwiY3NcIjtcbiAgICAvLyAgICAgY2FzZSBcImMrK1wiOiAgICAgICAgICAgICAgcmV0dXJuIFwiY3BwXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjZXlsb25cIjogICAgICAgICAgIHJldHVybiBcImNleWxvblwiO1xuICAgIC8vICAgICBjYXNlIFwiY2xpa2VcIjogICAgICAgICAgICByZXR1cm4gXCJjXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjbG9qdXJlXCI6ICAgICAgICAgIHJldHVybiBcImNsalwiO1xuICAgIC8vICAgICBjYXNlIFwiY21ha2VcIjogICAgICAgICAgICByZXR1cm4gXCIuY21ha2VcIjtcbiAgICAvLyAgICAgY2FzZSBcImNvYm9sXCI6ICAgICAgICAgICAgcmV0dXJuIFwiY2JsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjb2ZmZWVzY3JpcHRcIjogICAgIHJldHVybiBcImNvZmZlZVwiO1xuICAgIC8vICAgICBjYXNlIFwiY29tbW9ubGlzcFwiOiAgICAgIHJldHVybiBcImxpc3BcIjtcbiAgICAvLyAgICAgY2FzZSBcImNyeXN0YWxcIjogICAgICAgICAgcmV0dXJuIFwiY3JcIjtcbiAgICAvLyAgICAgY2FzZSBcImNzc1wiOiAgICAgICAgICAgICAgcmV0dXJuIFwiY3NzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJjeXRob25cIjogICAgICAgICAgIHJldHVybiBcInB5XCI7XG4gICAgLy8gICAgIGNhc2UgXCJkXCI6ICAgICAgICAgICAgICAgIHJldHVybiBcImRcIjtcbiAgICAvLyAgICAgY2FzZSBcImRhcnRcIjogICAgICAgICAgICAgcmV0dXJuIFwiZGFydFwiO1xuICAgIC8vICAgICBjYXNlIFwiZGlmZlwiOiAgICAgICAgICAgICByZXR1cm4gXCJkaWZmXCI7XG4gICAgLy8gICAgIGNhc2UgXCJkb2NrZXJmaWxlXCI6ICAgICAgIHJldHVybiBcImRvY2tlcmZpbGVcIjtcbiAgICAvLyAgICAgY2FzZSBcImR0ZFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwiZHRkXCI7XG4gICAgLy8gICAgIGNhc2UgXCJkeWxhblwiOiAgICAgICAgICAgIHJldHVybiBcImR5bGFuXCI7XG4gICAgLy8gICAgIC8vIEVpZmZlbCB3YXMgdGhlcmUgZmlyc3QgYnV0IGVsaXhpciBzZWVtcyBtb3JlIGxpa2VseVxuICAgIC8vICAgICAvLyBjYXNlIFwiZWlmZmVsXCI6ICAgICAgICAgICByZXR1cm4gXCJlXCI7XG4gICAgLy8gICAgIGNhc2UgXCJlbGl4aXJcIjogICAgICAgICAgIHJldHVybiBcImVcIjtcbiAgICAvLyAgICAgY2FzZSBcImVsbVwiOiAgICAgICAgICAgICAgcmV0dXJuIFwiZWxtXCI7XG4gICAgLy8gICAgIGNhc2UgXCJlcmxhbmdcIjogICAgICAgICAgIHJldHVybiBcImVybFwiO1xuICAgIC8vICAgICBjYXNlIFwiZiNcIjogICAgICAgICAgICAgICByZXR1cm4gXCJmc1wiO1xuICAgIC8vICAgICBjYXNlIFwiZmFjdG9yXCI6ICAgICAgICAgICByZXR1cm4gXCJmYWN0b3JcIjtcbiAgICAvLyAgICAgY2FzZSBcImZvcnRoXCI6ICAgICAgICAgICAgcmV0dXJuIFwiZnRoXCI7XG4gICAgLy8gICAgIGNhc2UgXCJmb3J0cmFuXCI6ICAgICAgICAgIHJldHVybiBcImY5MFwiO1xuICAgIC8vICAgICBjYXNlIFwiZ2FzXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJhc21cIjtcbiAgICAvLyAgICAgY2FzZSBcImdvXCI6ICAgICAgICAgICAgICAgcmV0dXJuIFwiZ29cIjtcbiAgICAvLyAgICAgLy8gR0ZNOiBDb2RlTWlycm9yJ3MgZ2l0aHViLWZsYXZvcmVkIG1hcmtkb3duXG4gICAgLy8gICAgIGNhc2UgXCJnZm1cIjogICAgICAgICAgICAgIHJldHVybiBcIm1kXCI7XG4gICAgLy8gICAgIGNhc2UgXCJncm9vdnlcIjogICAgICAgICAgIHJldHVybiBcImdyb292eVwiO1xuICAgIC8vICAgICBjYXNlIFwiaGFtbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJoYW1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJoYW5kbGViYXJzXCI6ICAgICAgIHJldHVybiBcImhic1wiO1xuICAgIC8vICAgICBjYXNlIFwiaGFza2VsbFwiOiAgICAgICAgICByZXR1cm4gXCJoc1wiO1xuICAgIC8vICAgICBjYXNlIFwiaGF4ZVwiOiAgICAgICAgICAgICByZXR1cm4gXCJoeFwiO1xuICAgIC8vICAgICBjYXNlIFwiaHRtbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJodG1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJodG1sZW1iZWRkZWRcIjogICAgIHJldHVybiBcImh0bWxcIjtcbiAgICAvLyAgICAgY2FzZSBcImh0bWxtaXhlZFwiOiAgICAgICAgcmV0dXJuIFwiaHRtbFwiO1xuICAgIC8vICAgICBjYXNlIFwiaXB5dGhvblwiOiAgICAgICAgICByZXR1cm4gXCJweVwiO1xuICAgIC8vICAgICBjYXNlIFwiaXB5dGhvbmZtXCI6ICAgICAgICByZXR1cm4gXCJtZFwiO1xuICAgIC8vICAgICBjYXNlIFwiamF2YVwiOiAgICAgICAgICAgICByZXR1cm4gXCJqYXZhXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqYXZhc2NyaXB0XCI6ICAgICAgIHJldHVybiBcImpzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqaW5qYTJcIjogICAgICAgICAgIHJldHVybiBcImppbmphXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqdWxpYVwiOiAgICAgICAgICAgIHJldHVybiBcImpsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJqc3hcIjogICAgICAgICAgICAgIHJldHVybiBcImpzeFwiO1xuICAgIC8vICAgICBjYXNlIFwia290bGluXCI6ICAgICAgICAgICByZXR1cm4gXCJrdFwiO1xuICAgIC8vICAgICBjYXNlIFwibGF0ZXhcIjogICAgICAgICAgICByZXR1cm4gXCJsYXRleFwiO1xuICAgIC8vICAgICBjYXNlIFwibGVzc1wiOiAgICAgICAgICAgICByZXR1cm4gXCJsZXNzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJsdWFcIjogICAgICAgICAgICAgIHJldHVybiBcImx1YVwiO1xuICAgIC8vICAgICBjYXNlIFwibWFya2Rvd25cIjogICAgICAgICByZXR1cm4gXCJtZFwiO1xuICAgIC8vICAgICBjYXNlIFwibWxsaWtlXCI6ICAgICAgICAgICAgcmV0dXJuIFwibWxcIjtcbiAgICAvLyAgICAgY2FzZSBcIm9jYW1sXCI6ICAgICAgICAgICAgcmV0dXJuIFwibWxcIjtcbiAgICAvLyAgICAgY2FzZSBcIm9jdGF2ZVwiOiAgICAgICAgICAgcmV0dXJuIFwibVwiO1xuICAgIC8vICAgICBjYXNlIFwicGFzY2FsXCI6ICAgICAgICAgICByZXR1cm4gXCJwYXNcIjtcbiAgICAvLyAgICAgY2FzZSBcInBlcmxcIjogICAgICAgICAgICAgcmV0dXJuIFwicGxcIjtcbiAgICAvLyAgICAgY2FzZSBcInBocFwiOiAgICAgICAgICAgICAgcmV0dXJuIFwicGhwXCI7XG4gICAgLy8gICAgIGNhc2UgXCJwb3dlcnNoZWxsXCI6ICAgICAgIHJldHVybiBcInBzMVwiO1xuICAgIC8vICAgICBjYXNlIFwicHl0aG9uXCI6ICAgICAgICAgICByZXR1cm4gXCJweVwiO1xuICAgIC8vICAgICBjYXNlIFwiclwiOiAgICAgICAgICAgICAgICByZXR1cm4gXCJyXCI7XG4gICAgLy8gICAgIGNhc2UgXCJyc3RcIjogICAgICAgICAgICAgIHJldHVybiBcInJzdFwiO1xuICAgIC8vICAgICBjYXNlIFwicnVieVwiOiAgICAgICAgICAgICByZXR1cm4gXCJydWJ5XCI7XG4gICAgLy8gICAgIGNhc2UgXCJydXN0XCI6ICAgICAgICAgICAgIHJldHVybiBcInJzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzYXNcIjogICAgICAgICAgICAgIHJldHVybiBcInNhc1wiO1xuICAgIC8vICAgICBjYXNlIFwic2Fzc1wiOiAgICAgICAgICAgICByZXR1cm4gXCJzYXNzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzY2FsYVwiOiAgICAgICAgICAgIHJldHVybiBcInNjYWxhXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzY2hlbWVcIjogICAgICAgICAgIHJldHVybiBcInNjbVwiO1xuICAgIC8vICAgICBjYXNlIFwic2Nzc1wiOiAgICAgICAgICAgICByZXR1cm4gXCJzY3NzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzbWFsbHRhbGtcIjogICAgICAgIHJldHVybiBcInN0XCI7XG4gICAgLy8gICAgIGNhc2UgXCJzaGVsbFwiOiAgICAgICAgICAgIHJldHVybiBcInNoXCI7XG4gICAgLy8gICAgIGNhc2UgXCJzcWxcIjogICAgICAgICAgICAgIHJldHVybiBcInNxbFwiO1xuICAgIC8vICAgICBjYXNlIFwic3RleFwiOiAgICAgICAgICAgICByZXR1cm4gXCJsYXRleFwiO1xuICAgIC8vICAgICBjYXNlIFwic3dpZnRcIjogICAgICAgICAgICByZXR1cm4gXCJzd2lmdFwiO1xuICAgIC8vICAgICBjYXNlIFwidGNsXCI6ICAgICAgICAgICAgICByZXR1cm4gXCJ0Y2xcIjtcbiAgICAvLyAgICAgY2FzZSBcInRvbWxcIjogICAgICAgICAgICAgcmV0dXJuIFwidG9tbFwiO1xuICAgIC8vICAgICBjYXNlIFwidHdpZ1wiOiAgICAgICAgICAgICByZXR1cm4gXCJ0d2lnXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ0eXBlc2NyaXB0XCI6ICAgICAgIHJldHVybiBcInRzXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ2YlwiOiAgICAgICAgICAgICAgIHJldHVybiBcInZiXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ2YnNjcmlwdFwiOiAgICAgICAgIHJldHVybiBcInZic1wiO1xuICAgIC8vICAgICBjYXNlIFwidmVyaWxvZ1wiOiAgICAgICAgICByZXR1cm4gXCJzdlwiO1xuICAgIC8vICAgICBjYXNlIFwidmhkbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJ2aGRsXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ4bWxcIjogICAgICAgICAgICAgIHJldHVybiBcInhtbFwiO1xuICAgIC8vICAgICBjYXNlIFwieWFtbFwiOiAgICAgICAgICAgICByZXR1cm4gXCJ5YW1sXCI7XG4gICAgLy8gICAgIGNhc2UgXCJ6ODBcIjogICAgICAgICAgICAgIHJldHVybiBcIno4YVwiO1xuICAgIC8vIH1cbiAgICByZXR1cm4gXCJ0eHRcIjtcbn1cblxuLy8gTWFrZSB0c2xpbnQgaGFwcHlcbmNvbnN0IGZvbnRGYW1pbHkgPSBcImZvbnQtZmFtaWx5XCI7XG5cbi8vIENhbid0IGJlIHRlc3RlZCBlMmUgOi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTaW5nbGVHdWlmb250KGd1aWZvbnQ6IHN0cmluZywgZGVmYXVsdHM6IGFueSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBndWlmb250LnNwbGl0KFwiOlwiKTtcbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cyk7XG4gICAgaWYgKC9eW2EtekEtWjAtOV0rJC8udGVzdChvcHRpb25zWzBdKSkge1xuICAgICAgICByZXN1bHRbZm9udEZhbWlseV0gPSBvcHRpb25zWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtmb250RmFtaWx5XSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnNbMF0pO1xuICAgIH1cbiAgICBpZiAoZGVmYXVsdHNbZm9udEZhbWlseV0pIHtcbiAgICAgICAgcmVzdWx0W2ZvbnRGYW1pbHldICs9IGAsICR7ZGVmYXVsdHNbZm9udEZhbWlseV19YDtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnMuc2xpY2UoMSkucmVkdWNlKChhY2MsIG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25bMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiaFwiOlxuICAgICAgICAgICAgICAgICAgICBhY2NbXCJmb250LXNpemVcIl0gPSBgJHtvcHRpb24uc2xpY2UoMSl9cHRgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiYlwiOlxuICAgICAgICAgICAgICAgICAgICBhY2NbXCJmb250LXdlaWdodFwiXSA9IFwiYm9sZFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiaVwiOlxuICAgICAgICAgICAgICAgICAgICBhY2NbXCJmb250LXN0eWxlXCJdID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1widGV4dC1kZWNvcmF0aW9uXCJdID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInNcIjpcbiAgICAgICAgICAgICAgICAgICAgYWNjW1widGV4dC1kZWNvcmF0aW9uXCJdID0gXCJsaW5lLXRocm91Z2hcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIndcIjogLy8gQ2FuJ3Qgc2V0IGZvbnQgd2lkdGguIFdvdWxkIGhhdmUgdG8gYWRqdXN0IGNlbGwgd2lkdGguXG4gICAgICAgICAgICAgICAgY2FzZSBcImNcIjogLy8gQ2FuJ3Qgc2V0IGNoYXJhY3RlciBzZXRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCByZXN1bHQgYXMgYW55KTtcbn07XG5cbi8vIFBhcnNlcyBhIGd1aWZvbnQgZGVjbGFyYXRpb24gYXMgZGVzY3JpYmVkIGluIGA6aCBFMjQ0YFxuLy8gZGVmYXVsdHM6IGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggb2YuXG4vLyBDYW4ndCBiZSB0ZXN0ZWQgZTJlIDovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR3VpZm9udChndWlmb250OiBzdHJpbmcsIGRlZmF1bHRzOiBhbnkpIHtcbiAgICBjb25zdCBmb250cyA9IGd1aWZvbnQuc3BsaXQoXCIsXCIpLnJldmVyc2UoKTtcbiAgICByZXR1cm4gZm9udHMucmVkdWNlKChhY2MsIGN1cikgPT4gcGFyc2VTaW5nbGVHdWlmb250KGN1ciwgYWNjKSwgZGVmYXVsdHMpO1xufVxuXG4vLyBDb21wdXRlcyBhIHVuaXF1ZSBzZWxlY3RvciBmb3IgaXRzIGFyZ3VtZW50LlxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVTZWxlY3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGZ1bmN0aW9uIHVuaXF1ZVNlbGVjdG9yKGU6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICAgICAgLy8gT25seSBtYXRjaGluZyBhbHBoYW51bWVyaWMgc2VsZWN0b3JzIGJlY2F1c2Ugb3RoZXJzIGNoYXJzIG1pZ2h0IGhhdmUgc3BlY2lhbCBtZWFuaW5nIGluIENTU1xuICAgICAgICBpZiAoZS5pZCAmJiBlLmlkLm1hdGNoKFwiXlthLXpBLVowLTlfLV0rJFwiKSkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBlLnRhZ05hbWUgKyBgW2lkPVwiJHtlLmlkfVwiXWA7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpZCkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgdGhlIHRvcCBvZiB0aGUgZG9jdW1lbnRcbiAgICAgICAgaWYgKCFlLnBhcmVudEVsZW1lbnQpIHsgcmV0dXJuIFwiSFRNTFwiOyB9XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBlbGVtZW50XG4gICAgICAgIGNvbnN0IGluZGV4ID1cbiAgICAgICAgICAgIEFycmF5LmZyb20oZS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoY2hpbGQgPT4gY2hpbGQudGFnTmFtZSA9PT0gZS50YWdOYW1lKVxuICAgICAgICAgICAgICAgIC5pbmRleE9mKGUpICsgMTtcbiAgICAgICAgcmV0dXJuIGAke3VuaXF1ZVNlbGVjdG9yKGUucGFyZW50RWxlbWVudCl9ID4gJHtlLnRhZ05hbWV9Om50aC1vZi10eXBlKCR7aW5kZXh9KWA7XG4gICAgfVxuICAgIHJldHVybiB1bmlxdWVTZWxlY3RvcihlbGVtZW50KTtcbn1cblxuLy8gVHVybnMgYSBudW1iZXIgaW50byBpdHMgaGFzaCs2IG51bWJlciBoZXhhZGVjaW1hbCByZXByZXNlbnRhdGlvbi5cbmV4cG9ydCBmdW5jdGlvbiB0b0hleENzcyhuOiBudW1iZXIpIHtcbiAgICBpZiAobiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHN0ciA9IG4udG9TdHJpbmcoMTYpO1xuICAgIC8vIFBhZCB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICByZXR1cm4gXCIjXCIgKyAobmV3IEFycmF5KDYgLSBzdHIubGVuZ3RoKSkuZmlsbChcIjBcIikuam9pbihcIlwiKSArIHN0cjtcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKipcbiAqIEJyb3dzZXIgZXh0ZW5zaW9ucyBoYXZlIG11bHRpcGxlIHByb2Nlc3Nlcy4gVGhpcyBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHRoZVxuICogW2JhY2tncm91bmQgcHJvY2Vzc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9BbmF0b215X29mX2FfV2ViRXh0ZW5zaW9uI0JhY2tncm91bmRfc2NyaXB0cykuXG4gKiBPdXIgYmFja2dyb3VuZCBwcm9jZXNzIGhhcyBtdWx0aXBsZSB0YXNrczpcbiAqIC0gS2VlcCB0cmFjayBvZiBwZXItdGFiIHZhbHVlcyB3aXRoIGl0cyBzZXRUYWJWYWx1ZS9nZXRUYWJWYWx1ZSBmdW5jdGlvbnNcbiAqIC0gU2V0IHRoZSBbYnJvd3NlckFjdGlvbnNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL2Jyb3dzZXJBY3Rpb24pJ3MgaWNvbi5cbiAqIC0gS2VlcCB0cmFjayBvZiBlcnJvciBtZXNzYWdlcy93YXJuaW5ncyB0aGF0IHNob3VsZCBhcmUgZGlzcGxheWVkIGluIHRoZVxuICogICBicm93c2VyQWN0aW9uLlxuICogLSBVcGRhdGUgc2V0dGluZ3Mgd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZWlyIHZpbXJjLlxuICogLSBTdGFydCBuZXcgbmVvdmltIGluc3RhbmNlcyB3aGVuIGFza2VkIGJ5IGEgY29udGVudCBzY3JpcHQuXG4gKiAtIFByb3ZpZGUgYW4gUlBDIG1lY2hhbmlzbSB0aGF0IGVuYWJsZXMgY2FsbGluZyBiYWNrZ3JvdW5kIEFQSXMgZnJvbSB0aGVcbiAqICAgYnJvd3NlckFjdGlvbi9jb250ZW50IHNjcmlwdC5cbiAqXG4gKiBUaGUgYmFja2dyb3VuZCBwcm9jZXNzIG1vc3RseSBhY3RzIGFzIGEgc2xhdmUgZm9yIHRoZSBicm93c2VyQWN0aW9uIGFuZFxuICogY29udGVudCBzY3JpcHRzLiBJdCByYXJlbHkgYWN0cyBvbiBpdHMgb3duLlxuICovXG5pbXBvcnQgeyBnZXRHbG9iYWxDb25mLCBtZXJnZVdpdGhEZWZhdWx0cyB9IGZyb20gXCIuL3V0aWxzL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IGdldEljb25JbWFnZURhdGEsIEljb25LaW5kLCBpc1RodW5kZXJiaXJkIH0gZnJvbSBcIi4vdXRpbHMvdXRpbHNcIjtcblxuZXhwb3J0IGxldCBwcmVsb2FkZWRJbnN0YW5jZTogUHJvbWlzZTxhbnk+O1xuXG50eXBlIHRhYklkID0gbnVtYmVyO1xudHlwZSB0YWJTdG9yYWdlID0ge1xuICAgIGRpc2FibGVkOiBib29sZWFuLFxufTtcbi8vIFdlIGNhbid0IHVzZSB0aGUgc2Vzc2lvbnMuc2V0VGFiVmFsdWUvZ2V0VGFiVmFsdWUgYXBpcyBmaXJlZm94IGhhcyBiZWNhdXNlXG4vLyBjaHJvbWUgZG9lc24ndCBzdXBwb3J0IHRoZW0uIEluc3RlYWQsIHdlIGNyZWF0ZSBhIG1hcCBvZiB0YWJpZCA9PiB7fSBrZXB0IGluXG4vLyB0aGUgYmFja2dyb3VuZC4gVGhpcyBoYXMgdGhlIGRpc2FkdmFudGFnZSBvZiBub3Qgc3Vydml2aW5nIGJyb3dzZXIgcmVzdGFydHMsXG4vLyBidXQncyBpdCdzIGNyb3NzIHBsYXRmb3JtLlxuY29uc3QgdGFiVmFsdWVzID0gbmV3IE1hcDx0YWJJZCwgdGFiU3RvcmFnZT4oKTtcbmZ1bmN0aW9uIHNldFRhYlZhbHVlKHRhYmlkOiB0YWJJZCwgaXRlbToga2V5b2YgdGFiU3RvcmFnZSwgdmFsdWU6IGFueSkge1xuICAgIGxldCBvYmogPSB0YWJWYWx1ZXMuZ2V0KHRhYmlkKTtcbiAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb2JqID0geyBcImRpc2FibGVkXCI6IGZhbHNlIH07XG4gICAgICAgIHRhYlZhbHVlcy5zZXQodGFiaWQsIG9iaik7XG4gICAgfVxuICAgIG9ialtpdGVtXSA9IHZhbHVlO1xufVxuZnVuY3Rpb24gZ2V0VGFiVmFsdWUodGFiaWQ6IHRhYklkLCBpdGVtOiBrZXlvZiB0YWJTdG9yYWdlKSB7XG4gICAgY29uc3Qgb2JqID0gdGFiVmFsdWVzLmdldCh0YWJpZCk7XG4gICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBvYmpbaXRlbV07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUljb24odGFiaWQ/OiBudW1iZXIpIHtcbiAgICBsZXQgbmFtZTogSWNvbktpbmQgPSBcIm5vcm1hbFwiO1xuICAgIGlmICh0YWJpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRhYmlkID0gKGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KSlbMF0uaWQ7XG4gICAgfVxuICAgIGlmIChnZXRUYWJWYWx1ZSh0YWJpZCwgXCJkaXNhYmxlZFwiKSA9PT0gdHJ1ZSkge1xuICAgICAgICBuYW1lID0gXCJkaXNhYmxlZFwiO1xuICAgIH0gZWxzZSBpZiAoZXJyb3IgIT09IFwiXCIpIHtcbiAgICAgICAgbmFtZSA9IFwiZXJyb3JcIjtcbiAgICB9IGVsc2UgaWYgKHdhcm5pbmcgIT09IFwiXCIpIHtcbiAgICAgICAgbmFtZSA9IFwibm90aWZpY2F0aW9uXCI7XG4gICAgfVxuICAgIC8vIENhbid0IHRlc3Qgb24gdGhlIGJpcmQgb2YgdGh1bmRlclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGlzVGh1bmRlcmJpcmQoKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBnZXRJY29uSW1hZ2VEYXRhKG5hbWUpLnRoZW4oKGltYWdlRGF0YTogYW55KSA9PiBicm93c2VyLmJyb3dzZXJBY3Rpb24uc2V0SWNvbih7IGltYWdlRGF0YSB9KSk7XG59XG5cbi8vIE9zIGlzIHdpbi9tYWMvbGludXgvYW5kcm9pcy9jcm9zLiBXZSBvbmx5IHVzZSBpdCB0byBhZGQgaW5mb3JtYXRpb24gdG8gZXJyb3Jcbi8vIG1lc3NhZ2VzIG9uIHdpbmRvd3MuXG5sZXQgb3MgPSBcIlwiO1xuYnJvd3Nlci5ydW50aW1lLmdldFBsYXRmb3JtSW5mbygpLnRoZW4oKHBsYXQ6IGFueSkgPT4gb3MgPSBwbGF0Lm9zKTtcblxuLy8gTGFzdCBlcnJvciBtZXNzYWdlXG5sZXQgZXJyb3IgPSBcIlwiO1xuXG4vLyBTaW1wbGUgZ2V0dGVyIGZvciBlYXN5IFJQQyBjYWxscy4gQ2FuJ3QgYmUgdGVzdGVkIGFzIHJlcXVpcmVzIG9wZW5pbmdcbi8vIGJyb3dzZXJBY3Rpb24uXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZnVuY3Rpb24gZ2V0RXJyb3IoKSB7XG4gICAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlckVycm9ycyhudmltOiBhbnksIHJlamVjdDogYW55KSB7XG4gICAgZXJyb3IgPSBcIlwiO1xuICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbnZpbS50aW1lZE91dCA9IHRydWU7XG4gICAgICAgIGVycm9yID0gXCJOZW92aW0gaXMgbm90IHJlc3BvbmRpbmcuXCI7XG4gICAgICAgIHVwZGF0ZUljb24oKTtcbiAgICAgICAgbnZpbS5kaXNjb25uZWN0KCk7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSwgMTAwMDApO1xuICAgIG52aW0ub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKGFzeW5jIChwOiBhbnkpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB1cGRhdGVJY29uKCk7XG4gICAgICAgIC8vIFVuZm9ydHVuYXRlbHkgdGhpcyBlcnJvciBoYW5kbGluZyBjYW4ndCBiZSB0ZXN0ZWQgYXMgaXQgcmVxdWlyZXNcbiAgICAgICAgLy8gc2lkZS1lZmZlY3RzIG9uIHRoZSBPUy5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKHAuZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGVycnN0ciA9IHAuZXJyb3IudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChlcnJzdHIubWF0Y2goL25vIHN1Y2ggbmF0aXZlIGFwcGxpY2F0aW9uL2kpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBcIk5hdGl2ZSBtYW5pZmVzdCBub3QgZm91bmQuIFBsZWFzZSBydW4gYDpjYWxsIGZpcmVudmltI2luc3RhbGwoMClgIGluIG5lb3ZpbS5cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyc3RyLm1hdGNoKC9hbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkL2kpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBcIlRoZSBzY3JpcHQgc3VwcG9zZWQgdG8gc3RhcnQgbmVvdmltIGNvdWxkbid0IGJlIGZvdW5kLlwiXG4gICAgICAgICAgICAgICAgICAgICsgXCIgUGxlYXNlIHJ1biBgOmNhbGwgZmlyZW52aW0jaW5zdGFsbCgwKWAgaW4gbmVvdmltXCI7XG4gICAgICAgICAgICAgICAgaWYgKG9zID09PSBcIndpblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yICs9IFwiIG9yIHRyeSBydW5uaW5nIHRoZSBzY3JpcHRzIGluICVMT0NBTEFQUERBVEElXFxcXGZpcmVudmltXFxcXFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlcnJvciArPSBcIi5cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyc3RyLm1hdGNoKC9OYXRpdmUgYXBwbGljYXRpb24gdHJpZWQgdG8gc2VuZCBhIG1lc3NhZ2Ugb2YvKSkge1xuICAgICAgICAgICAgICAgIGVycm9yID0gXCJVbmV4cGVjdGVkIG91dHB1dC4gUnVuIGBudmltIC0taGVhZGxlc3NgIGFuZCBlbnN1cmUgaXQgcHJpbnRzIG5vdGhpbmcuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZXJyc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlSWNvbigpO1xuICAgICAgICAgICAgcmVqZWN0KHAuZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKCFudmltLnJlcGxpZWQgJiYgIW52aW0udGltZWRPdXQpIHtcbiAgICAgICAgICAgIGVycm9yID0gXCJOZW92aW0gZGllZCB3aXRob3V0IGFuc3dlcmluZy5cIjtcbiAgICAgICAgICAgIHVwZGF0ZUljb24oKTtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGltZW91dDtcbn1cblxuLy8gTGFzdCB3YXJuaW5nIG1lc3NhZ2VcbmxldCB3YXJuaW5nID0gXCJcIjtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBnZXRXYXJuaW5nKCkge1xuICAgIHJldHVybiB3YXJuaW5nO1xufVxubGV0IG52aW1QbHVnaW5WZXJzaW9uID0gXCJcIjtcbmFzeW5jIGZ1bmN0aW9uIGNoZWNrVmVyc2lvbihudmltVmVyc2lvbjogc3RyaW5nKSB7XG4gICAgbnZpbVBsdWdpblZlcnNpb24gPSBudmltVmVyc2lvbjtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpO1xuICAgIHdhcm5pbmcgPSBcIlwiO1xuICAgIC8vIENhbid0IGJlIHRlc3RlZCBhcyBpdCB3b3VsZCByZXF1aXJlIHNpZGUgZWZmZWN0cyBvbiB0aGUgT1MuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAobWFuaWZlc3QudmVyc2lvbiAhPT0gbnZpbVZlcnNpb24pIHtcbiAgICAgICAgd2FybmluZyA9IGBOZW92aW0gcGx1Z2luIHZlcnNpb24gKCR7bnZpbVZlcnNpb259KSBhbmQgYnJvd3NlciBhZGRvbiBgXG4gICAgICAgICAgICArIGB2ZXJzaW9uICgke21hbmlmZXN0LnZlcnNpb259KSBkbyBub3QgbWF0Y2guYDtcbiAgICB9XG4gICAgdXBkYXRlSWNvbigpO1xufVxuXG4vLyBGdW5jdGlvbiBjYWxsZWQgaW4gb3JkZXIgdG8gZmlsbCBvdXQgZGVmYXVsdCBzZXR0aW5ncy4gQ2FsbGVkIGZyb20gdXBkYXRlU2V0dGluZ3MuXG5mdW5jdGlvbiBhcHBseVNldHRpbmdzKHNldHRpbmdzOiBhbnkpIHtcbiAgICByZXR1cm4gYnJvd3Nlci5zdG9yYWdlLmxvY2FsLnNldChtZXJnZVdpdGhEZWZhdWx0cyhvcywgc2V0dGluZ3MpIGFzIGFueSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IHRtcCA9IHByZWxvYWRlZEluc3RhbmNlO1xuICAgIHByZWxvYWRlZEluc3RhbmNlID0gY3JlYXRlTmV3SW5zdGFuY2UoKTtcbiAgICB0bXAudGhlbihudmltID0+IG52aW0ua2lsbCgpKTtcbiAgICAvLyBJdCdzIG9rIHRvIHJldHVybiB0aGUgcHJlbG9hZGVkSW5zdGFuY2UgYXMgYSBwcm9taXNlIGJlY2F1c2VcbiAgICAvLyBzZXR0aW5ncyBhcmUgb25seSBhcHBsaWVkIHdoZW4gdGhlIHByZWxvYWRlZEluc3RhbmNlIGhhcyByZXR1cm5lZCBhXG4gICAgLy8gcG9ydCtzZXR0aW5ncyBvYmplY3QgYW55d2F5LlxuICAgIHJldHVybiBwcmVsb2FkZWRJbnN0YW5jZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTmV3SW5zdGFuY2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgcmFuZG9tID0gbmV3IFVpbnQzMkFycmF5KDgpO1xuICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYW5kb20pO1xuICAgICAgICBjb25zdCBwYXNzd29yZCA9IEFycmF5LmZyb20ocmFuZG9tKS5qb2luKFwiXCIpO1xuXG4gICAgICAgIGNvbnN0IG52aW0gPSBicm93c2VyLnJ1bnRpbWUuY29ubmVjdE5hdGl2ZShcImZpcmVudmltXCIpO1xuICAgICAgICBjb25zdCBlcnJvclRpbWVvdXQgPSByZWdpc3RlckVycm9ycyhudmltLCByZWplY3QpO1xuICAgICAgICBudmltLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVzcDogYW55KSA9PiB7XG4gICAgICAgICAgICAobnZpbSBhcyBhbnkpLnJlcGxpZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGVycm9yVGltZW91dCk7XG4gICAgICAgICAgICBjaGVja1ZlcnNpb24ocmVzcC52ZXJzaW9uKTtcbiAgICAgICAgICAgIGFwcGx5U2V0dGluZ3MocmVzcC5zZXR0aW5ncykuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIGtpbGw6ICgpID0+IG52aW0uZGlzY29ubmVjdCgpLFxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgcG9ydDogcmVzcC5wb3J0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBudmltLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIG5ld0luc3RhbmNlOiB0cnVlLFxuICAgICAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vLyBDcmVhdGluZyB0aGlzIGZpcnN0IGluc3RhbmNlIHNlcnZlcyB0d28gcHVycG9zZXM6IG1ha2UgY3JlYXRpbmcgbmV3IG5lb3ZpbVxuLy8gZnJhbWVzIGZhc3QgYW5kIGFsc28gaW5pdGlhbGl6ZSBzZXR0aW5ncyB0aGUgZmlyc3QgdGltZSBGaXJlbnZpbSBpcyBlbmFibGVkXG4vLyBpbiBhIGJyb3dzZXIuXG5wcmVsb2FkZWRJbnN0YW5jZSA9IGNyZWF0ZU5ld0luc3RhbmNlKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIHRvZ2dsZURpc2FibGVkKCkge1xuICAgIGNvbnN0IHRhYmlkID0gKGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KSlbMF0uaWQ7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAhZ2V0VGFiVmFsdWUodGFiaWQsIFwiZGlzYWJsZWRcIik7XG4gICAgc2V0VGFiVmFsdWUodGFiaWQsIFwiZGlzYWJsZWRcIiwgZGlzYWJsZWQpO1xuICAgIHVwZGF0ZUljb24odGFiaWQpO1xuICAgIHJldHVybiBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiaWQsIHsgYXJnczogW2Rpc2FibGVkXSwgZnVuY05hbWU6IFtcInNldERpc2FibGVkXCJdIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBhY2NlcHRDb21tYW5kIChjb21tYW5kOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0YWIgPSAoYXdhaXQgYnJvd3Nlci50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pKVswXTtcbiAgICBsZXQgcDtcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgICAgY2FzZSBcIm52aW1pZnlcIjpcbiAgICAgICAgICAgIHAgPSBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgdGFiLmlkLFxuICAgICAgICAgICAgICAgIHsgYXJnczogW10sIGZ1bmNOYW1lOiBbXCJmb3JjZU52aW1pZnlcIl0gfSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZW5kX0MtblwiOlxuICAgICAgICAgICAgcCA9IGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZShcbiAgICAgICAgICAgICAgICB0YWIuaWQsXG4gICAgICAgICAgICAgICAgeyBhcmdzOiBbXCI8Qy1uPlwiXSwgZnVuY05hbWU6IFtcInNlbmRLZXlcIl0gfSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGdldEdsb2JhbENvbmYoKVtcIjxDLW4+XCJdID09PSBcImRlZmF1bHRcIikge1xuICAgICAgICAgICAgcCA9IHAuY2F0Y2goKCkgPT4gYnJvd3Nlci53aW5kb3dzLmNyZWF0ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNlbmRfQy10XCI6XG4gICAgICAgICAgICBwID0gYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKFxuICAgICAgICAgICAgICAgIHRhYi5pZCxcbiAgICAgICAgICAgICAgICB7IGFyZ3M6IFtcIjxDLXQ+XCJdLCBmdW5jTmFtZTogW1wic2VuZEtleVwiXSB9LFxuICAgICAgICApO1xuICAgICAgICBpZiAoZ2V0R2xvYmFsQ29uZigpW1wiPEMtdD5cIl0gPT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICAgICAgICBwID0gcC5jYXRjaCgoKSA9PiBicm93c2VyLnRhYnMuY3JlYXRlKHsgXCJ3aW5kb3dJZFwiOiB0YWIud2luZG93SWQgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VuZF9DLXdcIjpcbiAgICAgICAgICAgIHAgPSBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgdGFiLmlkLFxuICAgICAgICAgICAgICAgIHsgYXJnczogW1wiPEMtdz5cIl0sIGZ1bmNOYW1lOiBbXCJzZW5kS2V5XCJdIH0sXG4gICAgICAgICk7XG4gICAgICAgIGlmIChnZXRHbG9iYWxDb25mKClbXCI8Qy13PlwiXSA9PT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgIHAgPSBwLmNhdGNoKCgpID0+IGJyb3dzZXIudGFicy5yZW1vdmUodGFiLmlkKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZW5kX0NTLW5cIjpcbiAgICAgICAgICAgIHAgPSBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgdGFiLmlkLFxuICAgICAgICAgICAgICAgIHsgYXJnczogW1wiPENTLW4+XCJdLCBmdW5jTmFtZTogW1wic2VuZEtleVwiXSB9LFxuICAgICAgICApO1xuICAgICAgICBpZiAoZ2V0R2xvYmFsQ29uZigpW1wiPENTLW4+XCJdID09PSBcImRlZmF1bHRcIikge1xuICAgICAgICAgICAgcCA9IHAuY2F0Y2goKCkgPT4gYnJvd3Nlci53aW5kb3dzLmNyZWF0ZSh7IFwiaW5jb2duaXRvXCI6IHRydWUgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VuZF9DUy10XCI6XG4gICAgICAgICAgICAvLyA8Q1MtdD4gY2FuJ3QgYmUgZW11bGF0ZWQgd2l0aG91dCB0aGUgc2Vzc2lvbnMgQVBJLlxuICAgICAgICAgICAgcCA9IGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZShcbiAgICAgICAgICAgICAgICB0YWIuaWQsXG4gICAgICAgICAgICAgICAgeyBhcmdzOiBbXCI8Q1MtdD5cIl0sIGZ1bmNOYW1lOiBbXCJzZW5kS2V5XCJdIH0sXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2VuZF9DUy13XCI6XG4gICAgICAgICAgICBwID0gYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKFxuICAgICAgICAgICAgICAgIHRhYi5pZCxcbiAgICAgICAgICAgICAgICB7IGFyZ3M6IFtcIjxDUy13PlwiXSwgZnVuY05hbWU6IFtcInNlbmRLZXlcIl0gfSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGdldEdsb2JhbENvbmYoKVtcIjxDUy13PlwiXSA9PT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgIHAgPSBwLmNhdGNoKCgpID0+IGJyb3dzZXIud2luZG93cy5yZW1vdmUodGFiLndpbmRvd0lkKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ0b2dnbGVfZmlyZW52aW1cIjpcbiAgICAgICAgICAgIHAgPSB0b2dnbGVEaXNhYmxlZCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHA7XG59XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gICAgYWNjZXB0Q29tbWFuZCxcbiAgICAvLyBXZSBuZWVkIHRvIHN0aWNrIHRoZSBicm93c2VyIHBvbHlmaWxsIGluIGB3aW5kb3dgIGlmIHdlIHdhbnQgdGhlIGBleGVjYFxuICAgIC8vIGNhbGwgdG8gYmUgYWJsZSB0byBmaW5kIGl0IG9uIENocm9tZVxuICAgIGJyb3dzZXIsXG4gICAgY2xvc2VPd25UYWI6IChzZW5kZXI6IGFueSkgPT4gYnJvd3Nlci50YWJzLnJlbW92ZShzZW5kZXIudGFiLmlkKSxcbiAgICBleGVjOiAoXzogYW55LCBhcmdzOiBhbnkpID0+IGFyZ3MuZnVuY05hbWUucmVkdWNlKChhY2M6IGFueSwgY3VyOiBzdHJpbmcpID0+IGFjY1tjdXJdLCB3aW5kb3cpKC4uLihhcmdzLmFyZ3MpKSxcbiAgICBnZXRFcnJvcixcbiAgICBnZXROZW92aW1JbnN0YW5jZTogKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBwcmVsb2FkZWRJbnN0YW5jZTtcbiAgICAgICAgcHJlbG9hZGVkSW5zdGFuY2UgPSBjcmVhdGVOZXdJbnN0YW5jZSgpO1xuICAgICAgICAvLyBEZXN0cnVjdHVyaW5nIHJlc3VsdCB0byByZW1vdmUga2lsbCgpIGZyb20gaXRcbiAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKCh7IHBhc3N3b3JkLCBwb3J0IH0pID0+ICh7IHBhc3N3b3JkLCBwb3J0IH0pKTtcbiAgICB9LFxuICAgIGdldE52aW1QbHVnaW5WZXJzaW9uOiAoKSA9PiBudmltUGx1Z2luVmVyc2lvbixcbiAgICBnZXRPd25GcmFtZUlkOiAoc2VuZGVyOiBhbnkpID0+IHNlbmRlci5mcmFtZUlkLFxuICAgIGdldE93bkNvbXBvc2VEZXRhaWxzOiAoc2VuZGVyOiBhbnkpID0+IChicm93c2VyIGFzIGFueSkuY29tcG9zZS5nZXRDb21wb3NlRGV0YWlscyhzZW5kZXIudGFiLmlkKSxcbiAgICBnZXRUYWI6IChzZW5kZXI6IGFueSkgPT4gc2VuZGVyLnRhYixcbiAgICBnZXRUYWJWYWx1ZTogKHNlbmRlcjogYW55LCBhcmdzOiBhbnkpID0+IGdldFRhYlZhbHVlKHNlbmRlci50YWIuaWQsIGFyZ3NbMF0pLFxuICAgIGdldFRhYlZhbHVlRm9yOiAoXzogYW55LCBhcmdzOiBhbnkpID0+IGdldFRhYlZhbHVlKGFyZ3NbMF0sIGFyZ3NbMV0pLFxuICAgIGdldFdhcm5pbmcsXG4gICAgbWVzc2FnZUZyYW1lOiAoc2VuZGVyOiBhbnksIGFyZ3M6IGFueSkgPT4gYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKHNlbmRlci50YWIuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmcmFtZUlkOiBhcmdzLmZyYW1lSWQgfSksXG4gICAgbWVzc2FnZVBhZ2U6IChzZW5kZXI6IGFueSwgYXJnczogYW55KSA9PiBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2Uoc2VuZGVyLnRhYi5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzKSxcbiAgICBwdWJsaXNoRnJhbWVJZDogKHNlbmRlcjogYW55KSA9PiB7XG4gICAgICAgIGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZShzZW5kZXIudGFiLmlkLCB7XG4gICAgICAgICAgICBhcmdzOiBbc2VuZGVyLmZyYW1lSWRdLFxuICAgICAgICAgICAgZnVuY05hbWU6IFtcInJlZ2lzdGVyTmV3RnJhbWVJZFwiXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzZW5kZXIuZnJhbWVJZDtcbiAgICB9LFxuICAgIHNldFRhYlZhbHVlOiAoc2VuZGVyOiBhbnksIGFyZ3M6IGFueSkgPT4gc2V0VGFiVmFsdWUoc2VuZGVyLnRhYi5pZCwgYXJnc1swXSwgYXJnc1sxXSksXG4gICAgdGh1bmRlcmJpcmRTZW5kOiAoc2VuZGVyOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIChicm93c2VyIGFzIGFueSkuY29tcG9zZS5zZW5kTWVzc2FnZShzZW5kZXIudGFiLmlkLCB7IG1vZGU6ICdkZWZhdWx0JyB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZURpc2FibGVkOiAoKSA9PiB0b2dnbGVEaXNhYmxlZCgpLFxuICAgIHVwZGF0ZVNldHRpbmdzOiAoKSA9PiB1cGRhdGVTZXR0aW5ncygpLFxuICAgIG9wZW5Ucm91Ymxlc2hvb3RpbmdHdWlkZTogKCkgPT4gYnJvd3Nlci50YWJzLmNyZWF0ZSh7IGFjdGl2ZTogdHJ1ZSwgdXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9nbGFjYW1icmUvZmlyZW52aW0vYmxvYi9tYXN0ZXIvVFJPVUJMRVNIT09USU5HLm1kXCIgfSksXG59IGFzIGFueSk7XG5cbmJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoYXN5bmMgKHJlcXVlc3Q6IGFueSwgc2VuZGVyOiBhbnksIF9zZW5kUmVzcG9uc2U6IGFueSkgPT4ge1xuICAgIGNvbnN0IGZuID0gcmVxdWVzdC5mdW5jTmFtZS5yZWR1Y2UoKGFjYzogYW55LCBjdXI6IHN0cmluZykgPT4gYWNjW2N1cl0sIHdpbmRvdyk7XG4gICAgLy8gQ2FuJ3QgYmUgdGVzdGVkIGFzIHRoZXJlJ3Mgbm8gd2F5IHRvIGZvcmNlIGFuIGluY29ycmVjdCBjb250ZW50IHJlcXVlc3QuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoIWZuKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3I6IHVuaGFuZGxlZCBjb250ZW50IHJlcXVlc3Q6ICR7SlNPTi5zdHJpbmdpZnkocmVxdWVzdCl9LmApO1xuICAgIH1cbiAgICByZXR1cm4gZm4oc2VuZGVyLCByZXF1ZXN0LmFyZ3MgIT09IHVuZGVmaW5lZCA/IHJlcXVlc3QuYXJncyA6IFtdKTtcbn0pO1xuXG5icm93c2VyLnRhYnMub25BY3RpdmF0ZWQuYWRkTGlzdGVuZXIodGFiID0+IHtcbiAgICB1cGRhdGVJY29uKHRhYi50YWJJZCk7XG59KTtcbmJyb3dzZXIud2luZG93cy5vbkZvY3VzQ2hhbmdlZC5hZGRMaXN0ZW5lcihhc3luYyAod2luZG93SWQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIHdpbmRvd0lkIH0pO1xuICAgIGlmICh0YWJzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgIHVwZGF0ZUljb24odGFic1swXS5pZCk7XG4gICAgfVxufSk7XG5cbnVwZGF0ZUljb24oKTtcblxuLy8gYnJvd3Nlci5jb21tYW5kcyBkb2Vzbid0IGV4aXN0IGluIHRodW5kZXJiaXJkLiBFbHNlIGJyYW5jaCBjYW4ndCBiZSBjb3ZlcmVkXG4vLyBzbyBkb24ndCBpbnN0cnVtZW50IHRoZSBpZi5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoIWlzVGh1bmRlcmJpcmQoKSkge1xuICAgIGJyb3dzZXIuY29tbWFuZHMub25Db21tYW5kLmFkZExpc3RlbmVyKGFjY2VwdENvbW1hbmQpO1xuICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2VFeHRlcm5hbC5hZGRMaXN0ZW5lcihhc3luYyAocmVxdWVzdDogYW55LCBzZW5kZXI6IGFueSwgX3NlbmRSZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBhY2NlcHRDb21tYW5kKHJlcXVlc3QuY29tbWFuZCk7XG4gICAgICAgIF9zZW5kUmVzcG9uc2UocmVzcCk7XG4gICAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUlmUG9zc2libGUoKSB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7fSk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSB0YWJzLm1hcCh0YWIgPT4gYnJvd3NlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50YWJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNlbmRNZXNzYWdlKHRhYi5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogW1wiZ2V0QWN0aXZlSW5zdGFuY2VDb3VudFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmcmFtZUlkOiAwIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IDApKTtcbiAgICBjb25zdCBpbnN0YW5jZXMgPSBhd2FpdCAoUHJvbWlzZS5hbGwobWVzc2FnZXMpKTtcbiAgICAvLyBDYW4ndCBiZSBjb3ZlcmVkIGFzIHJlbG9hZCgpIHdvdWxkIGRlc3Ryb3kgd2Vic29ja2V0cyBhbmQgdGh1cyBjb3ZlcmFnZVxuICAgIC8vIGRhdGEuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoaW5zdGFuY2VzLmZpbmQobiA9PiBuID4gMCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBicm93c2VyLnJ1bnRpbWUucmVsb2FkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCh1cGRhdGVJZlBvc3NpYmxlLCAxMDAwICogNjAgKiAxMCk7XG4gICAgfVxufVxuKHdpbmRvdyBhcyBhbnkpLnVwZGF0ZUlmUG9zc2libGUgPSB1cGRhdGVJZlBvc3NpYmxlO1xuYnJvd3Nlci5ydW50aW1lLm9uVXBkYXRlQXZhaWxhYmxlLmFkZExpc3RlbmVyKHVwZGF0ZUlmUG9zc2libGUpO1xuXG4vLyBDYW4ndCB0ZXN0IG9uIHRoZSBiaXJkIG9mIHRodW5kZXJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoaXNUaHVuZGVyYmlyZCgpKSB7XG4gICAgKGJyb3dzZXIgYXMgYW55KS5jb21wb3NlLm9uQmVmb3JlU2VuZC5hZGRMaXN0ZW5lcihhc3luYyAodGFiOiBhbnksIGRldGFpbHM6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBsaW5lcyA9IChhd2FpdCBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7IGFyZ3M6IFtdLCBmdW5jTmFtZTogW1wiZ2V0X2J1Zl9jb250ZW50XCJdIH0pKSBhcyBzdHJpbmdbXTtcbiAgICAgICAgLy8gTm8gbmVlZCB0byByZW1vdmUgdGhlIGNhbnZhcyB3aGVuIHdvcmtpbmcgd2l0aCBwbGFpbnRleHQsXG4gICAgICAgIC8vIHRodW5kZXJiaXJkIHdpbGwgZG8gdGhhdCBmb3IgdXMuXG4gICAgICAgIGlmIChkZXRhaWxzLmlzUGxhaW5UZXh0KSB7XG4gICAgICAgICAgICAvLyBGaXJlbnZpbSBoYXMgdG8gY2FuY2VsIHRoZSBiZWZvcmVpbnB1dCBldmVudCBvbiB0aGUgY29tcG9zZVxuICAgICAgICAgICAgLy8gd2luZG93J3MgZG9jdW1lbnRFbGVtZW50IGluIG9yZGVyIHRvIHByZXZlbnQgdGhlIGNhbnZhcyBmcm9tXG4gICAgICAgICAgICAvLyBiZWluZyBkZXN0cm95ZWQuIEhvd2V2ZXIsIHRodW5kZXJiaXJkIGhhcyBhIGJ1ZyB3aGVyZSBjYW5jZWxsaW5nXG4gICAgICAgICAgICAvLyB0aGlzIGV2ZW50IHdpbGwgcHJldmVudCBvbkJlZm9yZVNlbmQgZnJvbSBzZXR0aW5nIHRoZSBjb21wb3NlXG4gICAgICAgICAgICAvLyB3aW5kb3cncyBjb250ZW50IHdoZW4gZWRpdGluZyBwbGFpbnRleHQgZW1haWxzLlxuICAgICAgICAgICAgLy8gV2Ugd29yayBhcm91bmQgdGhpcyBieSB0ZWxsaW5nIHRoZSBjb21wb3NlIHNjcmlwdCB0byB0ZW1wb3JhcmlseVxuICAgICAgICAgICAgLy8gc3RvcCBjYW5jZWxsaW5nIGV2ZW50cy5cbiAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHsgYXJnczogW10sIGZ1bmNOYW1lOiBbXCJwYXVzZV9rZXloYW5kbGVyXCJdIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgY2FuY2VsOiBmYWxzZSwgZGV0YWlsczogeyBwbGFpblRleHRCb2R5OiBsaW5lcy5qb2luKFwiXFxuXCIpIH0gfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJodG1sXCIpO1xuICAgICAgICBjb25zdCBib2QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtcbiAgICAgICAgZG9jLmFwcGVuZENoaWxkKGJvZCk7XG5cbiAgICAgICAgLy8gVHVybiBgPmAgaW50byBhcHByb3ByaWF0ZSBibG9ja3F1b3RlIGVsZW1lbnRzLlxuICAgICAgICBsZXQgcHJldmlvdXNRdW90ZUxldmVsID0gMDtcbiAgICAgICAgbGV0IHBhcmVudCA6IEhUTUxFbGVtZW50ID0gYm9kO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgbGluZXMpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UXVvdGVMZXZlbCA9IDA7XG5cbiAgICAgICAgICAgIC8vIENvdW50IG51bWJlciBvZiBcIj5cIiBzeW1ib2xzXG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICB3aGlsZSAobFtpXSA9PT0gXCIgXCIgfHwgbFtpXSA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobFtpXSA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFF1b3RlTGV2ZWwgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbC5zbGljZShpKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdW90ZUxldmVsID4gcHJldmlvdXNRdW90ZUxldmVsKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHByZXZpb3VzUXVvdGVMZXZlbDsgaSA8IGN1cnJlbnRRdW90ZUxldmVsOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYmxvY2txdW90ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImNpdGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGJsb2NrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFF1b3RlTGV2ZWwgPCBwcmV2aW91c1F1b3RlTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gcHJldmlvdXNRdW90ZUxldmVsOyBpID4gY3VycmVudFF1b3RlTGV2ZWw7IC0taSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsaW5lKSk7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcblxuICAgICAgICAgICAgcHJldmlvdXNRdW90ZUxldmVsID0gY3VycmVudFF1b3RlTGV2ZWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgY2FuY2VsOiBmYWxzZSwgZGV0YWlsczogeyBib2R5OiBkb2Mub3V0ZXJIVE1MIH0gfTtcbiAgICB9KTtcbiAgICAvLyBJbiB0aHVuZGVyYmlyZCwgcmVnaXN0ZXIgdGhlIHNjcmlwdCB0byBiZSBsb2FkZWQgaW4gdGhlIGNvbXBvc2Ugd2luZG93XG4gICAgKGJyb3dzZXIgYXMgYW55KS5jb21wb3NlU2NyaXB0cy5yZWdpc3Rlcih7XG4gICAgICAgIGpzOiBbe2ZpbGU6IFwiY29tcG9zZS5qc1wifV0sXG4gICAgfSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=