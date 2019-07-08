# AtBot Protype
This is a fork of the open source SpFx webpart avilable at https://github.com/MickH3/directline-bot-extension.  Codebase has been updated to run with SpFx 1.8.2 and React.

## withum-atbot-spfx-extension

A starting point SPFx extension to add a DirectLine Bot Framework bot to your SharePoint pages.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

## Files generated during build
* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources

## Files to be added to SharePoint
* temp/deploy/* - all resources which should be uploaded to a CDN.
* sharepoint/solution/withum-atbot-spfx-extension.sppkg - the SharePoint app file to be uploaded to your App Catalog

## Test/Build options

### Starts the local server to host the extension.
gulp serve --nobrowser 

### Paste the following at the end of any SharePoint modern page in your tenant to test/debug
> Be sure to update the three properties noted in the JSON (DirectLineSecret, BotName)

?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"21d2dffd-4f4e-461c-99d4-047c10b21d19":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{"DirectLineSecret":"YOUR DIRECTLINE SECRET GOES HERE", "BotName": "YOUR BOT NAME GOES HERE"}}}

### Deployment
gulp bundle --ship

gulp package-solution --ship
