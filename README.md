# serve-static-nginx
Express middleware to serve static files through nginx and x-accel-redirect

This is useful for production environments to offload serving of static files to nginx instead of nodejs. It replaces `express.static` or `serveStatic`.

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install serve-static-nginx
```

## Usage

With express, instead of `express.static` or `serveStatic` use `serveStaticNginx`:
```js
app.use('/static', serveStaticNginx(path.join(__dirname, 'static'), '/static'));
```

This will serve all files in the `static` folder from a `/static` url and through a `/static` internal location configured on nginx.

On nginx, the configuration would be:
```
server {
    ....
    location /static {
        internal;
        alias /pathtoproject/static;
    }
    ....
}
```
(pathtoproject being the value of __dirname in this example)

### In a project
In a project configuration, you'll likely want to use something like to be able to switch to nginx serving in production and nodejs serving in development:
```
if (nginx) {
	app.use('/static', serveStaticNginx(path.join(__dirname, 'static'), '/static'));
} else {
	app.use('/static', express.static(path.join(__dirname, 'static')));
}
```

## API

### serveStaticNginx(root, nginxLocation, options)

Create a new middleware function to serve files from within a given root directory.
The file to serve will be determined by combining `req.url` with the provided root directory.
The X-Accel-Redirect header sent to nginx will be made of the nginx location combined with `req.url`.
When a file is not found, instead of sending a 404 response, this module will instead call `next()` to move on to the next middleware, allowing for stacking and fall-backs.

#### Options

##### setHeaders

Function to set custom headers on response. Alterations to the headers need to
occur synchronously. The function is called as `fn(res, path, stat)`, where
the arguments are:

  - `res` the response object
  - `path` the file path that is being sent
  - `stat` the stat object of the file that is being sent

## Going further

Check express' serve-static docs: https://github.com/expressjs/serve-static

## License

[MIT](LICENSE)
