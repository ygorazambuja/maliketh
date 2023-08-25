import axios from 'axios';
import genSchema from 'generate-schema';
import path from 'path';
import { compile } from 'json-schema-to-typescript';
import { writeFileSync, mkdirSync } from 'fs';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _Maliketh_axios, _Maliketh_active;
class Maliketh {
    constructor(options = {}) {
        _Maliketh_axios.set(this, void 0);
        _Maliketh_active.set(this, false);
        __classPrivateFieldSet(this, _Maliketh_active, process.env.MALIKETH_ACTIVE === "true", "f");
        this.options = options;
        __classPrivateFieldSet(this, _Maliketh_axios, axios.create(this.options), "f");
    }
    create() { }
    get(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, config: { baseURL }, } = yield __classPrivateFieldGet(this, _Maliketh_axios, "f").get(url, config);
            if (!__classPrivateFieldGet(this, _Maliketh_active, "f")) {
                return data;
            }
            yield this.compileInterface(baseURL, url, data);
            return data;
        });
    }
    post(url, payload, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, config: { baseURL }, } = yield __classPrivateFieldGet(this, _Maliketh_axios, "f").post(url, payload, config);
            if (!__classPrivateFieldGet(this, _Maliketh_active, "f")) {
                return data;
            }
            yield this.compileInterface(baseURL, url, data);
            return data;
        });
    }
    put(url, payload, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, config: { baseURL }, } = yield __classPrivateFieldGet(this, _Maliketh_axios, "f").put(url, payload, config);
            if (!__classPrivateFieldGet(this, _Maliketh_active, "f")) {
                return data;
            }
            yield this.compileInterface(baseURL, url, data);
            return data;
        });
    }
    getAxios() {
        return __classPrivateFieldGet(this, _Maliketh_axios, "f");
    }
    getOptions() {
        return this.options;
    }
    setOptions(options) {
        this.options = options;
    }
    setHeader(key, value) {
        __classPrivateFieldGet(this, _Maliketh_axios, "f").defaults.headers.common[key] = value;
    }
    isActive() {
        return __classPrivateFieldGet(this, _Maliketh_active, "f");
    }
    getInterfaceNameBasedOnUrl(url) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname
            .split("/")
            .filter((part) => part.trim() !== "");
        const capitalizedParts = pathParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1));
        const name = capitalizedParts.join("");
        const ifHasNumber = /\d/.test(name);
        if (!ifHasNumber) {
            return "I" + name;
        }
        const removeLastNumber = name.slice(0, -1);
        const removeLastChar = removeLastNumber.slice(0, -1);
        return "I" + removeLastChar;
    }
    saveInterfaceOnDisk(folderPath, interfaceName, content) {
        writeFileSync(`${folderPath}/${interfaceName}.ts`, content);
    }
    createFolderPathBasedOnUrl(url) {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const pathname = urlObj.pathname;
        const domainParts = hostname.split(".");
        // @ts-ignore
        const pathParts = pathname.split("/").filter((part) => isNaN(part) && part);
        const folderStructure = [...domainParts, ...pathParts].join("/");
        const folderPath = path.join(__dirname, `./interfaces/${folderStructure}`);
        mkdirSync(folderPath, { recursive: true });
        return folderPath;
    }
    compileInterface(baseURL = "", url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const interfaceName = this.getInterfaceNameBasedOnUrl(baseURL + url);
            const schema = genSchema.json("", data);
            const result = yield compile(schema, interfaceName, {
                bannerComment: "",
                format: false,
            });
            const folder = this.createFolderPathBasedOnUrl(baseURL + url);
            this.saveInterfaceOnDisk(folder, interfaceName, result);
        });
    }
}
_Maliketh_axios = new WeakMap(), _Maliketh_active = new WeakMap();

export { Maliketh };
