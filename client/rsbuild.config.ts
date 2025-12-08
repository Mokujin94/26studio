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
			root: "build",
		},
	},
	server: {
		host: "0.0.0.0",
		port: 8080,
	},
});
