const path = require('path');

module.exports = {
  entry: './src/index.tsx', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file name
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'
    ], // Extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // TypeScript files
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader', // Use ts-loader for TypeScript files
        },
      },
      // Add more loaders if needed for other file types (e.g., CSS)
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // Serve files from the dist directory
    compress: true,
    port: 9000, // Port for webpack-dev-server
  },
};
