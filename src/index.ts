import { Context } from '@qpoint/router'
import { Router } from 'itty-router'

interface SpaConfig {
  entryPoint: string,
  assetsPath: string,
  origins: {
    [name: string]: string
  }
}

// adapter registration
export default function proxy(config: SpaConfig) {

  // create a router
  const router = Router()

  // setup routes
  router
    // proxy assets
    .get(`${config.assetsPath}/*`, async (req) => {
      // fetch the origin
      const origin = config.origins[req.headers.get("Host")]

      // build the full url
      const destination = `${origin}${new URL(req.url).pathname}`

      // fetch the asset
      const asset = await fetch(destination)

      // create a response that we can modify
      const res = new Response(asset.body, asset)

      // set a cache header if it's not a 404
      if (asset.status !== 404)
        res.headers.set("Cache-Control", "public, max-age=86400")

      // return the response
      return res
    })

    // send everything else to the entrypoint
    .get('*', async (req) => {
      // fetch the origin
      const origin = config.origins[req.headers.get("Host")]

      // build the full url
      const destination = `${origin}${config.entryPoint}`

      // fetch the asset
      const asset = await fetch(destination)

      // create a response that we can modify
      const res = new Response(asset.body, asset)

      // set a cache header if it's not a 404
      if (asset.status !== 404)
        res.headers.set("Cache-Control", "public, max-age=0, must-revalidate0")

      // return the response
      return res
    })

  // return middleware
  return async function run(ctx: Context, next: Function) {
    // defer to the router
    ctx.res = await router.handle(ctx.req)

    // let the rest of the stack run
    return next()
  }
}