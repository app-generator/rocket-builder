![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Code Tool for Editor.js

Code Tool for the [Editor.js](https://ifmo.su/editor) allows to include code examples in your articles.

![](https://capella.pics/8df022f5-b4d5-4d30-a527-2a0efb63f291.jpg)

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @editorjs/code
```

Include module at your application

```javascript
const CodeTool = require('@editorjs/code');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/code).

`https://cdn.jsdelivr.net/npm/@editorjs/code@2.0.0`

Require this script on a page with Editor.js.

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
    code: CodeTool,
  }
  
  ...
});
```

## Config Params

| Field       | Type     | Description                    |
| ----------- | -------- | -------------------------------|
| placeholder | `string` | Code Tool's placeholder string |

## Output data

This Tool returns code.

```json
{
    "type" : "code",
    "data" : {
        "code": "body {\n font-size: 14px;\n line-height: 16px;\n}",
    }
}
```

