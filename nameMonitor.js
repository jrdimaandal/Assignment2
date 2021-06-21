const EventEmitter = require('events');
const fs = require('fs');
const watch = require('node-watch');
const notifier = require('node-notifier');

var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -name [string] -path [string]')
    .demandOption(['name','path'])
    .argv;

console.log(`Watcing path: ${argv.path}`);

class FileWatcher extends EventEmitter {
    findName = (name, path) => {
        this.emit('nameFoundOnFile', name, path);
    };
}

const openToastNotification = (name, path) => {
    watch(path, { recursive: true }, function(_evt, fileName) {
        fs.readFile(fileName, function (err,data) {
            if(data?.includes(name)){
                notifier.notify({
                    title: 'File Watcher',
                    message: `Your name was mentioned on file: ${fileName}!`,
                    sound: true,
                    timeout: 10
                  });
                }
            });
        });
};

const printToConsole = (name, path) => {
    watch(path, { recursive: true }, function(_evt, fileName) {
        fs.readFile(fileName, function (err,data) {
            if(data?.includes(name)){
                console.log(`Your name was mentioned on file: ${fileName}!`);
                }
            });
        });
};

const fileWatcher = new FileWatcher();

fileWatcher.on('nameFoundOnFile', openToastNotification);
fileWatcher.on('nameFoundOnFile', printToConsole);

fileWatcher.findName(argv.name, argv.path);