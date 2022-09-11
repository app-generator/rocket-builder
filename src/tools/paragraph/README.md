![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Paragraph Tool for Editor.js

Basic text Tool for the [Editor.js](https://ifmo.su/editor).

## Installation

### Install via NPM

Get the package

```shell
npm i --save @editorjs/paragraph
```

Include module at your application

```javascript
const Paragraph = require('@editorjs/paragraph');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can also load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/paragraph).

`https://cdn.jsdelivr.net/npm/@editorjs/paragraph@2.0.2`

Then require this script on page with Editor.js.

```html
<script src="..."></script>
```

## Usage

The Paragraph tool is included at editor.js by default. So you don't need to connect it manually.
If you want to connect your customized version of this tool, do not forget to use the [`defaultBlock`](https://editorjs.io/configuration#change-the-default-block)
option of the editor config.

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
  }

  ...
});
```

## Config Params

The Paragraph Tool supports these configuration parameters:

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| placeholder | `string` | The placeholder. Will be shown only in the first paragraph when the whole editor is empty.  |
| preserveBlank | `boolean` | (default: `false`) Whether or not to keep blank paragraphs when saving editor data |

## Output data

| Field  | Type     | Description      |
| ------ | -------- | ---------------- |
| text   | `string` | paragraph's text |


```json
{
    "type" : "paragraph",
    "data" : {
        "text" : "Check out our projects on a <a href=\"https://github.com/codex-team\">GitHub page</a>.",
    }
}
```

