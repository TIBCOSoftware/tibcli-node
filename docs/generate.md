## Generate
Creating code from scratch can be a difficult task, so this tool helps you to create a completely new Node.js app. Optionally you can specify `-g` to initialize the directory as an empty repository or speficy `-G` to also create a GitHub repo for the app (you'll be prompted for your GitHub access token). To deploy to TIBCO Cloud Integration you'll need to package your code up into a zipfile and this tool helps to speed up deployment by creating the zip and moving that file, together with the manifest.json file, into a deployment folder.

## Usage
```
Usage: tibcli-node-generate [command] [options]

Options:

  -N, --name <name>           The name of the app
  -v, --appversion <version>  The version of the app
  -g, --git                   Initialize an empty git repo
  -G, --github                Create a new GitHub repo (you'll be promted for a token)
  -h, --help                  output usage information

Commands:

  app   Generate a new Node.js application
  zip   Generates a deployment folder with manifest.json and app.zip
```

## Generate a new Node.js app
If you want to generate a new app called **MyApp** and the version you want to give it is **1.0.0** you can use the below command
```
$ tibcli-node generate app -N MyApp -v 1.0.0
```

### Creating a git repo
To make sure the code is safely stored in a git repo, you can specify the `-g` flag which will create an empty repository in your current directory where your app is created as well.
```
$ tibcli-node generate app -N MyApp -v 1.0.0 -g
$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        MyApp/
        manifest.json

nothing added to commit but untracked files present (use "git add" to track)
```

### Adding to GitHub
You can also make use of GitHub to safely store your code, you can specify the `-G` flag which will create an empty repository in your current directory as well as create a new GitHub repository to store your app. It will register the GitHub repository with the name `origin` so all the usual GitHub command will work perfectly
```
$ tibcli-node generate app -N MyApp -v 1.0.0 -G
Please paste the access key of your GitHub account: xxxxx
https://github.com/USER/MyApp

# To validate that the URL is indeed correct you can use
$ git remote get-url origin
https://github.com/USER/MyApp
```

## Generate a deployment folder
To deploy your app to TIBCO Cloud Integration you’ll need a zip containing the code you have and a manifest file. To help you create the zip you can use the command below.
```
$ tibcli-node generate zip
```
