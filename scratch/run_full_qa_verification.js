const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlContent = fs.readFileSync('f:/PortalCapacitacion/ADRYAN_Learning_Functional_Prototype.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: 'http://localhost/#/course?id=COURSE-101',
    runScripts: 'dangerously',
    resources: 'usable'
});

const window = dom.window;

setTimeout(() => {
    try {
        console.log('--- RUNNING QA SUITE ---');
        const results = window.runPrototypeQA();
        let passCount = 0;
        let failCount = 0;

        results.forEach(r => {
            if (r.pass) {
                passCount++;
            } else {
                failCount++;
                console.error('FAIL:', r.name);
            }
        });

        console.log(`QA RESULTS: ${passCount} PASSED, ${failCount} FAILED out of ${results.length} total tests.`);

        const hcScan = window.runHardcodingScanQA();
        console.log('HARDCODING SCAN VIOLATIONS:', hcScan.violations ? hcScan.violations.length : 0);

    } catch (e) {
        console.error('Execution Error:', e);
    }
}, 1000);
