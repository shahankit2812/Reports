const { generateTemplate } = require('./htmlTemplate');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'results');

let result = {
    "passed": 0,
    "total": 0,
    "failed": 0,
    "skipped": 0,
    "name": "Feature Sample",
    "tests": [

    ],
};
fs.readdir(dir, (error, files) => {
    return new Promise((resolve, reject) => {
        if (error) reject(error);
        let failureCount = 0;
        files.forEach(file => {
            fileContent = fs.readFileSync(dir + "/" + file);
            const parsedJson = JSON.parse(fileContent);
            result.passed += parsedJson.passed;
            result.total += parsedJson.total;
            result.skipped += parsedJson.skipped;
            result.name = parsedJson.fixtures[0].meta.feature;
            const tests = parsedJson.fixtures[0].tests;
            tests.forEach(individualTest => {
                const test = {}
                test.name = individualTest.name;
                test.meta = individualTest.meta;
                test.errs = individualTest.errs;
                failureCount += individualTest.errs.length;
                test.durationMs = individualTest.durationMs;
                test.screenshotPath = individualTest.screenshotPath;
                test.skipped = individualTest.skipped
                test.userAgent = parsedJson.userAgents[0];
                result.tests.push(test);
            });
        });
        result['failed'] = failureCount;
        resolve(result);
    }).then(data => {
        fs.writeFileSync('./aggregated-results.json', JSON.stringify(data));
        let refinedTest = {
        };
        data.tests.forEach(test => {
            if (test.name in refinedTest) {
                refinedTest[test.name].userAgent = refinedTest[test.name].userAgent.concat(", " + test.userAgent);
            }
            else {
                refinedTest[test.name] = test;
            }
        })
        const reports = generateTemplate(data,refinedTest);
        fs.writeFileSync('./aggregated-results.html', reports);
    })
});