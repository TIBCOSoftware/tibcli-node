var cli = require('commander');

cli
    .version('0.0.1')
    .description('Help developers with Node.js code on TIBCO Cloud Integration')
    .command('generate','Generation of apps and deployment artifacts')
    .command('manifest','Manage manifest.json properties')
    .parse(process.argv);