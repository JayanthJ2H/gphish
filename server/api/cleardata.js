import fs from 'fs';

const clearData = (req, res) => {
    const file = 'creds_logs.json';

    fs.writeFile(file, '', 'utf8', (err) => {
        if (err) {
            console.error('Error clearing data:', err);
            return res.status(500).json({ message: 'Failed to clear data.' });
        }

        console.log('File cleared successfully.');
        res.json({ message: 'File cleared successfully.' });
    });
};

export default clearData;
