"use strict";
const { exec } = require("child_process");
const terminal = (command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return console.log(`error: ${error.message}`);
        }
        if (stderr) {
            return console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
};
exports.terminal = terminal;
