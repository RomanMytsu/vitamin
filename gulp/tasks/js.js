import webpack from "webpack-stream";
import WebpackModule from "webpack";
import dotenv from "dotenv";

// Загрузить переменные окружения из .env файла
dotenv.config();

export const js = () => {
  return app.gulp
    .src(app.path.src.js, { sourcemaps: true })
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "main.min.js",
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: /node_modules/,
              use: "ts-loader",
              // use: {
              //   loader: "babel-loader",
              //   options: {
              //     presets: ["@babel/preset-env"],
              //   },
              // },
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
          ],
        },
        resolve: {
          extensions: [".ts", ".js"],
        },
        devtool: "source-map",
        plugins: [
          new WebpackModule.DefinePlugin({
            "process.env.FIREBASE_API_KEY": JSON.stringify(
              process.env.FIREBASE_API_KEY,
            ),
            "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(
              process.env.FIREBASE_AUTH_DOMAIN,
            ),
            "process.env.FIREBASE_PROJECT_ID": JSON.stringify(
              process.env.FIREBASE_PROJECT_ID,
            ),
            "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(
              process.env.FIREBASE_STORAGE_BUCKET,
            ),
            "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
              process.env.FIREBASE_MESSAGING_SENDER_ID,
            ),
            "process.env.FIREBASE_APP_ID": JSON.stringify(
              process.env.FIREBASE_APP_ID,
            ),
          }),
        ],
      }),
    )
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browsersync.stream());
};
