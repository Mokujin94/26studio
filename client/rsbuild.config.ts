import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  source: {
    define: publicVars,
  },
	output: {
		distPath: {
			root: "build"
		}
	}
});
