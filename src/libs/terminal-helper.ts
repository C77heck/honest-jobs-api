const { exec } = require("child_process");

const terminal = (command: string) => {
    exec(command, (error: any, stdout: string, stderr: string) => {
        if (error) {
            return console.log(`error: ${error.message}`);
        }
        if (stderr) {
            return console.log(`stderr: ${stderr}`);
        }

        console.log(`stdout: ${stdout}`);
    });
    // to call it recursively.
    // setTimeout(() => terminal(command), 4000)
};

exports.terminal = terminal;
