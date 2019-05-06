const {series, concurrent, copy} = require("nps-utils");

const version = "v0.1.0"; // TODO: Replace e.g. __VERSION__ in .ts files with variable

const uuid = "dozenalclock@nicoviii.eu";
const tarName = "dozenal-clock-gnome-shell-extension";

module.exports = {
  scripts: {
    /* Main tasks */
    build: {
      script: series.nps("compile", /*"uglify", */"copy"),
    },
    publish: {
      script: series.nps("build", "pack"),
    },

    /* Subtasks: Build */
    compile: {
      script: series.nps("compileCode", "compileSchema"),
    },
    compileCode: {
      script: "tsc -p src/ts --outDir out/",
    },
    compileSchema: {
      script: "glib-compile-schemas --targetdir=./out/schemas/ ./src/schemas/",
    },
    copy: {
      script: copy("src/metadata.json out/") + " && " + copy("src/schemas/* out/schemas/"),
    },
    uglify: {
      script: "uglifyjs -m -o out/extension.js --comments -- out/extension.js",
    },

    /* Subtasks: Publish */
    pack: {
      script: series.nps("copyArtifacts", "createTar", "compress", "createGnomeExtensionArchive"),
    },
    copyArtifacts: {
      script: `mkdir -p publish/${uuid}/ && cp out/* publish/${uuid}/`,
    },
    createTar: {
      script: `cd publish && tar -czf '${tarName}.tar' -- ${uuid}/* && cd ..`,
    },
    compress: {
      script: series.nps("compressGz", "compressXz"),
    },
    compressGz: {
      script: `gzip -fk 'publish/${tarName}.tar'`
    },
    compressXz: {
      script: `xz -e9 --threads=0 -f 'publish/${tarName}.tar'`,
    },
    createGnomeExtensionArchive: {
      script: `cd publish/${uuid} && zip -FSq ../nameTBD.zip * && cd ../..`,
    },
    cleanupDeployFolder: {
      script: `rm -r publish/${uuid}`,
    }
  }
};
