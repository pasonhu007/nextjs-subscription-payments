/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true
  },
  webpack: (config, { isServer }) => {
    // Only run on server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(nodeExternals({ allowlist: [/^@?/], additionalModuleDirs: ['./node_modules'] }));
    }
    
    // Ignore canvas during bundling
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^canvas$/ })
    );

    return config;
  }
};

module.exports = nextConfig;
