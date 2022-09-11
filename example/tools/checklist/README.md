![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Checklist Tool for Editor.js

This Tool for the [Editor.js](https://editorjs.io) allows you to add  checklists to your texts.

![](https://capella.pics/f099dd9b-1321-47f6-b9e1-97fc1ef40b6a.jpg)

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @editorjs/checklist
```

Include module at your application

```javascript
const Checklist = require('@editorjs/checklist');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/checklist).

`https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest`

Then require this script on page with Editor.js.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
  }
  
  ...
});
```

## Config Params

This Tool has no config params


## Output data

| Field | Type       | Description                            |
| ----- | ---------- | -------------------------------------- |
| items | `object[]` | array of checklist's items             |


```json
{
    "type" : "checklist",
    "data" : {
        "items" : [
            {
              "text" : "This is a block-styled editor",
              "checked" : true
            },
            {
              "text" : "Clean output data",
              "checked" : false
            },
            {
              "text" : "Simple and powerful API",
              "checked" : true
            }
        ]
    }
}
```

