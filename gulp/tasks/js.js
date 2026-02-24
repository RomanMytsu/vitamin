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
      }),
    )
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browsersync.stream());
};
