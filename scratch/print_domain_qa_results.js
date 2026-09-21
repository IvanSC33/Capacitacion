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
            const isClass = selector.startsWith('.');
            const isAttr = selector.startsWith('[');
            const target = selector.substring(1).replace(/[\[\]]/g, '');
            const targetAttrName = target.split('=')[0];
            const targetAttrVal = target.includes('=') ? target.split('=')[1].replace(/["\']/g, '') : null;

            const tagRegex = /<([a-z0-9]+)\b([^>]*)>/gi;
            let m;
            while ((m = tagRegex.exec(htmlContent)) !== null) {
                const tag = m[1].toUpperCase();
                const attrStr = m[2];
                let isMatch = false;

                if (isClass) {
                    const cMatch = attrStr.match(/class=["\']([^"\']*)["\']/i);
                    if (cMatch && cMatch[1].split(/\s+/).includes(target)) isMatch = true;
                } else if (isAttr) {
                    const aMatch = attrStr.match(new RegExp(targetAttrName + '=["\']([^"\']*)["\']', 'i'));
                    if (aMatch) {
                        if (!targetAttrVal || aMatch[1] === targetAttrVal) isMatch = true;
                    }
                }

                if (isMatch) {
                    const endTag = `</${tag.toLowerCase()}>`;
                    const startPos = m.index + m[0].length;
                    const endPos = htmlContent.toLowerCase().indexOf(endTag, startPos);
                    const innerHtml = endPos !== -1 ? htmlContent.substring(startPos, endPos) : '';
                    results.push({
                        tagName: tag,
                        textContent: innerHtml.replace(/<[^>]*>/g, '').trim(),
                        innerHTML: innerHtml,
                        getAttribute(attr) {
                            const r = new RegExp(attr + '=["\']([^"\']*)["\']', 'i');
                            const val = attrStr.match(r);
                            return val ? val[1] : null;
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

const tests = context.runDomainServicesAndEventBusQA();
tests.forEach(t => {
    if (!t.pass) {
        console.log('FAIL:', t.name, t.error || t.detail || '');
    }
});
console.log('TOTAL:', tests.length, '| PASSED:', tests.filter(t => t.pass).length, '| FAILED:', tests.filter(t => !t.pass).length);
