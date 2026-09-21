const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let fullScript = '';
while ((match = scriptRegex.exec(html)) !== null) { fullScript += match[1] + '\n'; }

const dummyJQuery = function() { return { ready: function() {}, on: function() {}, append: function() {}, html: function() {}, attr: function() {}, addClass: function() {}, removeClass: function() {}, val: function() { return ''; } }; };
dummyJQuery.ready = function() {};
const mockStorage = {};
const localStorage = { getItem: (k) => mockStorage[k] || null, setItem: (k, v) => { mockStorage[k] = String(v); }, removeItem: (k) => { delete mockStorage[k]; }, clear: () => {} };
const bootstrap = { Toast: function() { return { show: function() {} }; } };
const locationObj = { hash: '#/dashboard' };

function makeSimulatedElement(tagName = 'DIV') {
    let htmlContent = '';
    return {
        tagName: tagName.toUpperCase(),
        get innerHTML() { return htmlContent; },
        set innerHTML(val) { htmlContent = String(val); },
        get textContent() { return htmlContent.replace(/<[^>]*>/g, ''); },
        getAttribute(attrName) {
            const regex = new RegExp(attrName + '=["\']([^"\']*)["\']', 'i');
            const m = htmlContent.match(regex);
            return m ? m[1] : null;
        },
        querySelector(selector) {
            const list = this.querySelectorAll(selector);
            return list.length > 0 ? list[0] : null;
        },
        querySelectorAll(selector) {
            const results = [];
            if (selector.startsWith('.')) {
                const className = selector.substring(1);
                const regex = new RegExp('<([a-z0-9]+)[^>]*class=["\'][^"\']*\\b' + className + '\\b[^"\']*["\'][^>]*>([\\s\\S]*?)</\\1>', 'gi');
                let m;
                while ((m = regex.exec(htmlContent)) !== null) {
                    const tagStr = m[0];
                    const bodyStr = m[2];
                    results.push({
                        tagName: m[1].toUpperCase(),
                        textContent: bodyStr.replace(/<[^>]*>/g, ''),
                        innerHTML: bodyStr,
                        getAttribute(attr) {
                            const r = new RegExp(attr + '=["\']([^"\']*)["\']', 'i');
                            const match = tagStr.match(r);
                            return match ? match[1] : null;
                        }
                    });
                }
            } else if (selector.startsWith('[')) {
                const attrName = selector.replace(/[\[\]]/g, '').split('=')[0];
                const regex = new RegExp('<([a-z0-9]+)[^>]*\\b' + attrName + '=["\']([^"\']*)["\'][^>]*>([\\s\\S]*?)</\\1>', 'gi');
                let m;
                while ((m = regex.exec(htmlContent)) !== null) {
                    const tagStr = m[0];
                    const attrVal = m[2];
                    const bodyStr = m[3];
                    results.push({
                        tagName: m[1].toUpperCase(),
                        textContent: bodyStr.replace(/<[^>]*>/g, ''),
                        innerHTML: bodyStr,
                        getAttribute(attr) {
                            if (attr === attrName) return attrVal;
                            const r = new RegExp(attr + '=["\']([^"\']*)["\']', 'i');
                            const match = tagStr.match(r);
                            return match ? match[1] : null;
                        }
                    });
                }
            } else if (selector.startsWith('#')) {
                const idVal = selector.substring(1);
                const regex = new RegExp('<([a-z0-9]+)[^>]*id=["\']' + idVal + '["\'][^>]*>([\\s\\S]*?)</\\1>', 'gi');
                let m;
                while ((m = regex.exec(htmlContent)) !== null) {
                    const tagStr = m[0];
                    const bodyStr = m[2];
                    results.push({
                        tagName: m[1].toUpperCase(),
                        textContent: bodyStr.replace(/<[^>]*>/g, ''),
                        innerHTML: bodyStr,
                        getAttribute(attr) {
                            const r = new RegExp(attr + '=["\']([^"\']*)["\']', 'i');
                            const match = tagStr.match(r);
                            return match ? match[1] : null;
                        }
                    });
                }
            }
            return results;
        }
    };
}

const context = { console, $: dummyJQuery, jQuery: dummyJQuery, location: locationObj, document: { readyState: 'complete', getElementById: () => null, createElement: (t) => makeSimulatedElement(t) }, localStorage, bootstrap, setTimeout: () => {}, clearTimeout: () => {} };
context.window = context;

vm.createContext(context);
vm.runInContext(fullScript, context);

const secTests = context.runSecurityNegativeTests();
secTests.forEach(t => console.log(t.name.padEnd(70) + ': ' + (t.pass ? 'PASS' : 'FAIL')));
