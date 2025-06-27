import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const logsFile = path.join(__dirname, './creds_logs.json');

const track = (req, res) => {
    if (fs.existsSync(logsFile)) {
        const data = fs.readFileSync(logsFile, 'utf-8');
        try {
            const jsonData = JSON.parse(data);
            res.status(200).json(jsonData);
        } catch (err) {
            res.status(500).send('Invalid JSON format in creds_logs.json');
        }
    } else {
        res.status(404).send('File not found');
    }
};

export default track;
