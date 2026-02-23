import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./docs`;
const srcFolder = `./src`;

export const path = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/css/`,
    html: `${buildFolder}/`,
    images: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`,
  },
  src: {
    js: `${srcFolder}/ts/main.ts`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
    svg: `${srcFolder}/img/**/*.svg`,
    scss: `${srcFolder}/scss/style.scss`,
    html: `${srcFolder}/pages/**/*.html`,
  },
  watch: {
    js: `${srcFolder}/ts/**/*.ts`,
    scss: `${srcFolder}/scss/**/*.scss`,
    html: `${srcFolder}/**/*.html`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
    svg: `${srcFolder}/img/**/*.svg`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
};
