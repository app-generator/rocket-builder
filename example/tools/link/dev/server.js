/**
 * Sample HTTP server for accept fetched links data
 * [!] Use it only for debugging purposes
 *
 * How to use [requires Node.js 10.0.0+ and npm install]:
 *
 * 1. $ node dev/server.js
 * 2. set 'endpoint' at the Link Tools 'config' in example.html
 *   endpoint : 'http://localhost:8008/fetchUrl'
 *
 */
const http = require('http');
const og = require('open-graph');

class ServerExample {
  constructor({port, fieldName}) {
    this.fieldName = fieldName;
    this.server = http.createServer((req, res) => {
      this.onRequest(req, res);
    }).listen(port);

    this.server.on('listening', () => {
      console.log('Server is listening ' + port + '...');
    });

    this.server.on('error', (error) => {
      console.log('Failed to run server', error);
    });
  }

  /**
   * Request handler
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  onRequest(req, res) {
    this.allowCors(res);

    const {method, url} = req;

    if (method.toLowerCase() !== 'get') {
      res.end();
      return;
    }

    const link = decodeURIComponent(url.slice('/fetchUrl?url='.length));

    /**
     * Get available open-graph meta-tags from page
     */
    og(link, function(err, meta) {
      if (meta) {
        res.end(JSON.stringify({
          success: 1,
          meta
        }));
      } else {
        res.end(JSON.stringify ({
          success: 0,
          meta: {}
        }));
        console.log(err);
      }
    });
  }

  /**
   * Allows CORS requests for debugging
   * @param response
   */
  allowCors(response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  }
}

new ServerExample({
  port: 8008,
  fieldName: 'link'
});
