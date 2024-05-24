/** @type {import('next').NextConfig} */


const stylexPlugin = require("@stylexjs/nextjs-plugin");
const nextConfig = {
  output:"expert",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
}

module.exports = stylexPlugin({
  rootDir: __dirname,
  presets: ["next/babel"],
  plugins: ["@stylexjs/babel-plugin"],
})(nextConfig);




