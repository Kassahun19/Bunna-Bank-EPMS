let app: any = null;
let initError: any = null;

async function loadApp() {
  if (app) return app;
  if (initError) throw initError;
  try {
    // @ts-ignore
    const serverModule = await import('../dist/server.cjs');
    app = (serverModule && (serverModule.default || serverModule)) || serverModule;
    return app;
  } catch (err: any) {
    initError = err;
    console.error('Failed to load server module:', err);
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const expressApp = await loadApp();
    return expressApp(req, res);
  } catch (err: any) {
    res.status(500).json({
      error: "Vercel serverless function crash",
      message: err.message || String(err),
      stack: err.stack || ""
    });
  }
}
