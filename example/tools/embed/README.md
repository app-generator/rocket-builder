![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Embed Tool

Provides Block tool for embedded content for the [Editor.js](https://editorjs.io).
Tool uses Editor.js pasted patterns handling and inserts iframe with embedded content.

## List of services supported

> `service` — is a service name that will be saved to Tool's [output JSON](#output-data)

- [Facebook](https://www.facebook.com) - `facebook` service
- [Instagram](https://www.instagram.com/codex_team/) - `instagram` service
- [YouTube](https://youtube.com) - `youtube` service
- [Twitter](https://twitter.com/codex_team) - `twitter` service. (https://twitframe.com used for render)
- [Twitch](https://twitch.tv) - `twitch-video` service for videos and `twitch-channel` for channels
- [Miro](https://miro.com) - `miro` service
- [Vimeo](https://vimeo.com) — `vimeo` service
- [Gfycat](https://gfycat.com) — `gfycat` service
- [Imgur](https://imgur.com) — `imgur` service
- [Vine](https://vine.co) - `vine` service. The project is in archive state now
- [Aparat](https://www.aparat.com) - `aparat` service
- [Yandex.Music](https://music.yandex.ru) - `yandex-music-track` service for tracks, `yandex-music-album` for albums and `yandex-music-playlist` for playlists
- [Coub](https://coub.com) — `coub` service
- [CodePen](https://codepen.io) — `codepen` service
- [Pinterest](https://www.pinterest.com) - `pinterest` service
- 👇 Any other [customized service](#add-more-services)



## Installation

### Install via NPM

Get the package

```shell
npm i --save @editorjs/embed
```

Include module at your application

```javascript
import Embed from '@editorjs/embed';
```

### Load from CDN
You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/embed).

`https://cdn.jsdelivr.net/npm/@editorjs/embed@latest`

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
    embed: Embed,
  },

  ...
});
```

## Available configuration

### Enabling / disabling services

Embed Tool supports some services by default (see above). You can specify services you would like to use:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true
        }
      }
    },
  },

  ...
});
```

> Note that if you pass services you want to use like in the example above, others will not be enabled.

### Add more services

You can provide your own services using simple configuration.

First, you should create a Service configuration object. It contains following fields:

| Field      | Type       | Description |
| ---------- | ---------- | ----------- |
| `regex`    | `RegExp`   | Pattern of pasted URLs. You should use regexp groups to extract resource id
| `embedUrl` | `string`   | Url of resource\`s embed page. Use `<%= remote_id %>` to substitute resource identifier
| `html`     | `string`   | HTML code of iframe with embedded content. `embedUrl` will be set as iframe `src`
| `height`   | `number`   | _Optional_. Height of inserted iframe
| `width`    | `number`   | _Optional_. Width of inserted iframe
| `id`       | `Function` | _Optional_. If your id is complex you can provide function to make the id from extraced regexp groups

Example:

```javascript
{
  regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
  embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
  html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
  height: 300,
  width: 600,
  id: (groups) => groups.join('/embed/')
}
```

When you create a Service configuration object, you can provide it with Tool\`s configuration:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true,
          codepen: {
            regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
            embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
            html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
            height: 300,
            width: 600,
            id: (groups) => groups.join('/embed/')
          }
        }
      }
    },
  },

  ...
});
```

#### Inline Toolbar
Editor.js provides useful inline toolbar. You can allow it\`s usage in the Embed Tool caption by providing `inlineToolbar: true`.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: Embed,
      inlineToolbar: true
    },
  },

  ...
});
```

## Output data

| Field   | Type     | Description
| ------- | -------- | -----------
| service | `string` | service unique name
| source  | `string` | source URL
| embed   | `string` | URL for source embed page
| width   | `number` | embedded content width
| height  | `number` | embedded content height
| caption | `string` | content caption


```json
{
  "type" : "embed",
  "data" : {
    "service" : "coub",
    "source" : "https://coub.com/view/1czcdf",
    "embed" : "https://coub.com/embed/1czcdf",
    "width" : 580,
    "height" : 320,
    "caption" : "My Life"
  }
}
```

# About CodeX

<img align="right" width="120" height="120" src="https://codex.so/public/app/img/codex-logo.svg" hspace="50">

CodeX is a team of digital specialists around the world interested in building high-quality open source products on a global market. We are [open](https://codex.so/join) for young people who want to constantly improve their skills and grow professionally with experiments in cutting-edge technologies.

| 🌐 | Join  👋  | Twitter | Instagram |
| -- | -- | -- | -- |
| [codex.so](https://codex.so) | [codex.so/join](https://codex.so/join) |[@codex_team](http://twitter.com/codex_team) | [@codex_team](http://instagram.com/codex_team) |
