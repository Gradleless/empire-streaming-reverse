import createNextJsObfuscator from 'nextjs-obfuscator';

const withNextJsObfuscator = createNextJsObfuscator(
  {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0.75,
    disableConsoleOutput: false,
    identifierNamesCache: null,
    identifierNamesGenerator: 'mangled',
    optionsPreset: 'medium-obfuscation',
    rotateStringArray: true,
    seed: 0,
    shuffleStringArray: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayIndexesType: ['hexadecimal-number'],
    target: 'browser',
    sourceMap: true,
  },
  {
    log: true,
    obfuscateFiles: {
      buildManifest: true,
      ssgManifest: true,
      webpack: true,
      additionalModules: ['es6-object-assign'],
    },
  }
);

/** @type {import('next').NextConfig} */
const nextConfig = withNextJsObfuscator({
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
});

export default nextConfig;
