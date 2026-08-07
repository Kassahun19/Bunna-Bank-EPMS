// @ts-ignore
import serverModule from '../dist/server.cjs';

// Extract the Express app instance, handling both ES module default and direct CommonJS export
const app = (serverModule && (serverModule.default || serverModule)) || serverModule;

export default app;
