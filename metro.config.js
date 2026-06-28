const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Supabase and the URL polyfill access `window` at module-init time, which
// crashes the Node-based SSR renderer that Expo Router uses for web.
// The SSR pass only generates the HTML shell — auth/data is always client-side —
// so it's safe to return empty modules in the node environment.
const SSR_BLOCKED = [
  '@supabase/',
  'react-native-url-polyfill',
];

const originalResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    context.customResolverOptions?.environment === 'node' &&
    SSR_BLOCKED.some(prefix => moduleName.includes(prefix))
  ) {
    return { type: 'empty' };
  }
  return originalResolve
    ? originalResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
