const fs = require('fs');
const readline = require('readline');

async function parseTrace() {
    const fileStream = fs.createReadStream('test-results/tests-addProgram-Add-New-Program-Test/trace-extracted/0-trace.trace');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const data = JSON.parse(line);
            if (data.type === 'before' || data.type === 'action') {
                const method = data.method;
                const clazz = data.class;
                const params = JSON.stringify(data.params);
                console.log(`[API Call] ${clazz}.${method}: ${params}`);
            }
        } catch (e) {
            console.error('Error parsing line:', e);
        }
    }
}

parseTrace();
