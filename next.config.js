/** @type {import('next').NextConfig} */



const nextConfig = {
  output:"expert",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

module.exports = stylexPlugin({
  rootDir: __dirname,
  presets: ["next/babel"],
  plugins: ["@stylexjs/babel-plugin"],
});




