import fs from 'fs';
import path from 'path';

 const emailOpened = () => {
    return (req, res) => {
        const email = req.query.email || 'unknown';
        const time = new Date().toISOString();

        const logEntry = { email, time };

        console.log(`📧 [${time}] Email opened by: ${email}`);

        const logFile = path.join(process.cwd(), 'api', 'opened_log.json');

        let logs = [];

        if (fs.existsSync(logFile)) {
            const existingData = fs.readFileSync(logFile, 'utf8');
            try {
                logs = JSON.parse(existingData);
            } catch (err) {
                console.error('❌ Error parsing opened_log.json:', err.message);
            }
        }

        logs.push(logEntry);

        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

        const img = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9Sjmrc8AAAAASUVORK5CYII=',
            'base64'
        );

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
    };
};

export default emailOpened;
