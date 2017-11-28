## package
To deploy to TIBCO Cloud Integration you'll need to package your code up into a zip file and this commands helps to speed up deployment by creating the zip and moving that file, together with the manifest.json file, into a deployment folder.

To help you create the zip you can use the command below.
```
$ tibcli-node package
```

This command has to be run in the folder that contains the `package.json` file