import svgSprite from "gulp-svg-sprite";
import cheerio from "gulp-cheerio";

export const svgSprive = () => {
  return app.gulp
    .src(app.path.src.svg)
    .pipe(
      cheerio({
        run: ($) => {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: `../sprite.svg`,
            example: true,
          },
        },
      })
    )

    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browsersync.stream());
};
