![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Image Tool

Image Block for the [Editor.js](https://editorjs.io).

![](https://capella.pics/63a03d04-3816-45b2-87b2-d85e556f0066.jpg)

## Features

- Uploading file from the device
- Pasting copied content from the web
- Pasting images by drag-n-drop
- Pasting files and screenshots from Clipboard
- Allows adding a border, and a background
- Allows stretching an image to the container's full-width

**Notes**

This Tool requires server-side implementation for the file uploading. See [backend response format](#server-format) for more details.

This Tool is also capable of uploading & displaying video files using the <video> element. To enable this, specify video mime-types via the 'types' config param.


## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @editorjs/image
```

Include module at your application

```javascript
import ImageTool from '@editorjs/image';
```

### Other methods

#### Manual downloading and connecting

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

#### Loading from CDN

You can load a specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/image).

`https://cdn.jsdelivr.net/npm/@editorjs/image@2.3.0`

Then require this script on page with Editor.js through the `<script src=""></script>` tag.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
import ImageTool from '@editorjs/image';

// or if you inject ImageTool via standalone script
const ImageTool = window.ImageTool;

var editor = EditorJS({
  ...

  tools: {
    ...
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        }
      }
    }
  }

  ...
});
```

## Config Params

Image Tool supports these configuration parameters:

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| endpoints | `{byFile: string, byUrl: string}` | Endpoints for file uploading. <br> Contains 2 fields: <br> __byFile__ - for file uploading <br> __byUrl__ - for uploading by URL |
| field | `string` | (default: `image`) Name of uploaded image field in POST request |
| types | `string` | (default: `image/*`) Mime-types of files that can be [accepted with file selection](https://github.com/codex-team/ajax#accept-string).|
| additionalRequestData | `object` | Object with any data you want to send with uploading requests |
| additionalRequestHeaders | `object` | Object with any custom headers which will be added to request. [See example](https://github.com/codex-team/ajax/blob/e5bc2a2391a18574c88b7ecd6508c29974c3e27f/README.md#headers-object) |
| captionPlaceholder | `string` | (default: `Caption`) Placeholder for Caption input |
| buttonContent | `string` | Allows to override HTML content of «Select file» button |
| uploader | `{{uploadByFile: function, uploadByUrl: function}}` | Optional custom uploading methods. See details below. |
| actions | `array` | Array with custom actions to show in the tool's settings menu. See details below. |

Note that if you don't implement your custom uploader methods, the `endpoints` param is required.

## Tool's settings

![](https://capella.pics/c74cdeec-3405-48ac-a960-f784188cf9b4.jpg)

1. Add border

2. Stretch to full-width

3. Add background

Add extra setting-buttons by adding them to the `actions`-array in the configuration:
```js
actions: [
    {
        name: 'new_button',
        icon: '<svg>...</svg>',
        title: 'New Button',
        action: (name) => {
            alert(`${name} button clicked`);
            return false;
        }
    }
]
```
By adding `return true` or `return false` at the end of your custom actions, you can determine wether the icon in the tool's settings is toggled or not. This is helpfull for actions that do not toggle between states, but execute a different action.
If toggling is enabled, an `image-tool--[button name]` class will be appended and removed from the container.

## Output data

This Tool returns `data` with following format

| Field          | Type      | Description                     |
| -------------- | --------- | ------------------------------- |
| file           | `object`  | Uploaded file data. Any data got from backend uploader. Always contain the `url` property |
| caption        | `string`  | image's caption                 |
| withBorder     | `boolean` | add border to image             |
| withBackground | `boolean` | need to add background          |
| stretched      | `boolean` | stretch image to screen's width |


```json
{
    "type" : "image",
    "data" : {
        "file": {
            "url" : "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg"
        },
        "caption" : "Roadster // tesla.com",
        "withBorder" : false,
        "withBackground" : false,
        "stretched" : true
    }
}
```

## Backend response format <a name="server-format"></a>

This Tool works by one of the following schemes:

1. Uploading files from the device
2. Uploading by URL (handle image-like URL's pasting)
3. Uploading by drag-n-drop file
4. Uploading by pasting from Clipboard

### Uploading files from device <a name="from-device"></a>

Scenario:

1. User select file from the device
2. Tool sends it to **your** backend (on `config.endpoint.byFile` route)
3. Your backend should save file and return file data with JSON at specified format.
4. Image tool shows saved image and stores server answer

So, you can implement backend for file saving by your own way. It is a specific and trivial task depending on your
environment and stack.

Response of your uploader **should** cover following format:

```json5
{
    "success" : 1,
    "file": {
        "url" : "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
    }
}
```

**success** - uploading status. 1 for successful, 0 for failed

**file** - uploaded file data. **Must** contain an `url` field with full public path to the uploaded image.
Also, can contain any additional fields you want to store. For example, width, height, id etc.
All additional fields will be saved at the `file` object of output data.

### Uploading by pasted URL

Scenario:

1. User pastes an URL of the image file to the Editor
2. Editor pass pasted string to the Image Tool
3. Tool sends it to **your** backend (on `config.endpoint.byUrl` route) via 'url' POST-parameter
3. Your backend should accept URL, **download and save the original file by passed URL** and return file data with JSON at specified format.
4. Image tool shows saved image and stores server answer

Response of your uploader should be at the same format as described at «[Uploading files from device](#from-device)» section


### Uploading by drag-n-drop or from Clipboard

Your backend will accept file as FormData object in field name, specified by `config.field` (by default, «`image`»).
You should save it and return the same response format as described above.

## Providing custom uploading methods

As mentioned at the Config Params section, you have an ability to provide own custom uploading methods.
It is a quite simple: implement `uploadByFile` and `uploadByUrl` methods and pass them via `uploader` config param.
Both methods must return a Promise that resolves with response in a format that described at the [backend response format](#server-format) section.


| Method         | Arguments | Return value | Description |
| -------------- | --------- | -------------| ------------|
| uploadByFile   | `File`    | `{Promise.<{success, file: {url}}>}` | Upload file to the server and return an uploaded image data |
| uploadByUrl    | `string`  | `{Promise.<{success, file: {url}}>}` | Send URL-string to the server, that should load image by this URL and return an uploaded image data |

Example:

```js
import ImageTool from '@editorjs/image';

var editor = EditorJS({
  ...

  tools: {
    ...
    image: {
      class: ImageTool,
      config: {
        /**
         * Custom uploader
         */
        uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByFile(file){
            // your own uploading logic here
            return MyAjax.upload(file).then(() => {
              return {
                success: 1,
                file: {
                  url: 'https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg',
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              };
            });
          },

          /**
           * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
           * @param {string} url - pasted image URL
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByUrl(url){
            // your ajax request for uploading
            return MyAjax.upload(file).then(() => {
              return {
                success: 1,
                file: {
                  url: 'https://codex.so/upload/redactor_images/o_e48549d1855c7fc1807308dd14990126.jpg',,
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              }
            })
          }
        }
      }
    }
  }

  ...
});
```
