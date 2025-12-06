const { exec } = require('child_process');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const command = `curl "https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}" | grep "name"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(stdout);
});
