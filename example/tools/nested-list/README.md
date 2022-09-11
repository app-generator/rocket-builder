![](https://badgen.net/badge/Editor.js/v2.19.2/blue)

# Nested List Tool for Editor.js

Multi-leveled lists for the [Editor.js](https://editorjs.io).

Use `Tab` and `Shift+Tab` keys to create or remove sublist with a padding.

![](assets/example.gif)

## Installation

### Install via NPM

Get the package

```shell
npm i --save @editorjs/nested-list
```

Or

```shell
yarn add @editorjs/nested-list
```

Include module at your application

```javascript
import NestedList from '@editorjs/nested-list';
```

### Load from CDN

Load the script from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/nested-list) and connect to your page.

```html
<script src="https://cdn.jsdelivr.net/npm/@editorjs/nested-list@latest"></script>
```

## Usage

Add the NestedList Tool to the `tools` property of the Editor.js initial config.

```javascript
import EditorJS from '@editorjs/editorjs';
import NestedList from '@editorjs/nested-list';

var editor = EditorJS({
  // ...
  tools: {
    ...
    list: {
      class: NestedList,
      inlineToolbar: true,
    },
  },
});
```

## Config Params

This Tool has no config params

## Tool's settings

![](https://capella.pics/bf5a42e4-1350-499d-a728-493b0fcaeda4.jpg)

You can choose list`s type.

## Output data

| Field | Type      | Description                              |
| ----- | --------- | ---------------------------------------- |
| style | `string`  | type of a list: `ordered` or `unordered` |
| items | `Item[]`  | the array of list's items                |

Object `Item`:

| Field   | Type      | Description               |
| ------- | --------- | ------------------------- |
| content | `string`  | item's string content     |
| items   | `Item[]`  | the array of list's items |


```json
{
    "type" : "list",
    "data" : {
        "style" : "unordered",
        "items" : [
            {
              "content": "Apples",
              "items": [
                {
                  "content": "Red",
                  "items": []
                },
                {
                  "content": "Green",
                  "items": []
                },
              ]
            },
            {
              "content": "Bananas",
              "items": [
                {
                  "content": "Yellow",
                  "items": []
                },
              ]
            },
        ]
    }
},
```
