const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

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
const bootstrap = { Toast: function() { return { show: function() {} }; } };

const context = {
    console,
    $: dummyJQuery,
    jQuery: dummyJQuery,
    window: {},
    document: {
        readyState: 'complete',
        createElement: function() { return { getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [] }; },
        location: { hash: '#/dashboard' }
    },
    localStorage,
    bootstrap,
    setTimeout: () => {},
    clearTimeout: () => {}
};
context.window = context;
context.document.defaultView = context.window;

vm.createContext(context);
vm.runInContext(fullScript, context);

const hcRes = context.runHardcodingScanQA();
console.log('VIOLATIONS:', hcRes.violations);
