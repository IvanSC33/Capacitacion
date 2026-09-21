const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

// Extract all <script> blocks
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let fullScript = '';

while ((match = scriptRegex.exec(html)) !== null) {
    fullScript += match[1] + '\n';
}

const dummyJQuery = function() {
    return {
        ready: function(cb) {},
        on: function() {},
        append: function() {},
        html: function() {},
        attr: function() {},
        addClass: function() {},
        removeClass: function() {},
        val: function() { return ''; }
    };
};
dummyJQuery.ready = function() {};

const mockStorage = {};
const localStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

const bootstrap = {
    Toast: function() {
        return { show: function() {} };
    }
};

function makeSimulatedElement(tagName = 'DIV') {
    let htmlContent = '';
    return {
        tagName: tagName.toUpperCase(),
        get innerHTML() { return htmlContent; },
        set innerHTML(val) { htmlContent = String(val); },
        get textContent() {
            return htmlContent.replace(/<[^>]*>/g, '');
        },
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

const locationObj = { hash: '#/dashboard' };

const context = {
    console,
    $: dummyJQuery,
    jQuery: dummyJQuery,
    location: locationObj,
    window: { location: locationObj },
    document: {
        readyState: 'complete',
        getElementById: function() { return null; },
        createElement: function(tag) { return makeSimulatedElement(tag); },
        location: locationObj
    },
    localStorage,
    bootstrap,
    setTimeout: () => {},
    clearTimeout: () => {}
};
context.window.location = locationObj;
context.document.defaultView = context.window;

vm.createContext(context);
vm.runInContext(fullScript, context);

console.log("--- EXECUTING DOMAIN SERVICES & FASE III.5 QA TESTS ---");
const domainTests = context.runDomainServicesAndEventBusQA();

let passCount = 0;
let failCount = 0;

domainTests.forEach((test, idx) => {
    if (test.pass) {
        passCount++;
        console.log(`[PASS] Test ${idx + 1}: ${test.name}`);
    } else {
        failCount++;
        console.error(`[FAIL] Test ${idx + 1}: ${test.name} - ${test.error || test.detail || 'Failed'}`);
    }
});

console.log(`\nSUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${domainTests.length} total tests.`);

const hcScan = context.runHardcodingScanQA();
console.log(`HARDCODING SCAN VIOLATIONS: ${hcScan.businessCount}`);
if (!hcScan.pass) {
    console.error("Hardcoding Scan Violations List:", hcScan.violations);
}

const qaRes = context.runPrototypeQA();
console.log(`\nOVERALL PROTOTYPE QA RESULT: ${qaRes.overallPassed ? 'PASS' : 'FAIL'}`);
console.log(`ROUTES: ${qaRes.routesCount} / 36 | ORPHANS: ${qaRes.orphanCount} | HARDCODING: ${qaRes.hcScan.businessCount}`);
