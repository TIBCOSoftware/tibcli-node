## env
The manifest.json file describes what kind of app this is and is used by TIBCO Cloud Integration to carry out building and deploying your app. As with all code it can have multiple deployments (production, staging, development, etc.) and although your code must stay the same, certain configuration muse be different (e.g. the username for a database login). With this command you can add and remove environment variables from the manifest.json file so you can use them with `process.env` in your Node.js code

### options
* `--varname <name>` the name of the environment variable (**required**)
* `--type <type>` the type of the environment variable (**required _only for addvar_**)
* `--value <value>` the default value for the variable in the manifest

### examples
```
tibcli-node env addvar --varname DB_USER --type string --value admin
```
This will add a new environment variable called **DB_USER** of type **string** with a default value of **admin** to your manifest.json. To use this command the `manifest.json` has to exist in the current directory.

Now you can use the variable `DB_USER` in your code and change it during or after deployment so you don't have to change all your code. In your code you can use
```
const user = process.env.DB_USER || 'admin';
```
This code will look to see if your environment variable has been set and will use the vaue `admin` if it hasn't. Note that even though a default value has been provided in your manifest, the default value doesn't carry across into the runtime. You explicitly need to set your default value (for example using the code above) to make sure it gets used properly. The default value is used to show in the TIBCO Cloud Integation Web UI. 

If you no longer want to use the environment variable you can remove it from the manifest with the below command
```
$ tibcli-node env delvar -N DB_USER
```
