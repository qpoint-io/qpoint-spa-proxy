import Router from "@qpoint/router";
import proxy from "@qpoint/spa-proxy";

const router = new Router()
  .use(proxy({
    entryPoint: '/index.html',
    assetsPath: '/assets',
    origins: {
      'localhost': 'http://127.0.0.1:8080',
      'acme.com': 'https://s3.amazonaws.com/acme'
    }
  }))

export default {
  fetch(request: Request, env: any, ctx: ExecutionContext) {
    return router.fetch(request, env, ctx)
  }
}
