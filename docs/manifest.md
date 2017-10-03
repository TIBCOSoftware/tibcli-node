## Manifest
The manifest.json file describes what kind of app this is and is used by TIBCO Cloud Integration to carry out building and deploying your app. As with all code it can have multiple deployments (production, staging, development, etc.) and although your code must stay the same, certain configuration muse be different (e.g. the username for a database login). With this tool you can add and remove environment variables from the manifest.json file so you can use them with `process.env` in your Node.js code

## Usage
```
Usage: tibcli-node manifest [command] [options]

Options:

  -N, --name <name>    The name of the variable to add or remove
  -T, --type <type>    The type of the variable to add
  -V, --value <value>  The default value for the variable in the manifest, you still need to explicitly set the value in your code
  -f --file [file]     The full path of the manifest file, if no file is given we assume the file is in this folder
  -h, --help           output usage information

Commands:

  add-var   Add an environment variable to the manifest.json
  rem-var   Removes an environment variable from the manifest.json
```

## Add a new variable
To add a new environmnt variable you can use the command
```
$ tibcli-node manifest add-var -N DB_USER -T string -V admin
```
Now you can use the variable `DB_USER` in your code and change it during or after deployment so you don't have to change all your code. In your code you can use
```
const user = process.env.DB_USER || 'admin';
```
This code will look to see if your environment variable has been set and will use the vaue `admin` if it hasn't. Note that even though a default value has been provided in your manifest, the default value doesn't carry across into the runtime. You explicitly need to set your default value (for example using the code above) to make sure it gets used properly. The default value is used to show in the TIBCO Cloud Integation Web UI. 

## Remove a variable
If you no longer want to use the environment variable you can remove it from the manifest with the below command
```
$ tibcli-node manifest rem-var -N DB_USER
```

## Using the file flag
If you want to add or remove variables from a manifest file that isn't in the current directory, you can use the `-f` flag and specify the full path to the file. The **add a new variable** could have looked like
```
$ tibcli-node manifest add-var -N DB_USER -T string -V admin -f /home/user/downloads/myapp/manifest.json
```