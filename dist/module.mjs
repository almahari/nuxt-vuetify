import { useLogger, defineNuxtModule, isNuxt3, getNuxtVersion, createResolver, addPluginTemplate } from '@nuxt/kit';
import defu from 'defu';
import vuetify from 'vite-plugin-vuetify';

const name = "@invictus.codes/nuxt-vuetify";
const version = "0.2.21";

const CONFIG_KEY = "vuetify";
const logger = useLogger("nuxt:vuetify");
const module = defineNuxtModule({
  // Default configuration options of the Nuxt module
  defaults: {
    moduleOptions: {
      // Nuxt-Vuetify module
      useIconCDN: true,
      treeshaking: false,
      importLabComponents: false,
      // Vite-plugin-vuetify
      styles: true,
      autoImport: true
    },
    vuetifyOptions: void 0
  },
  meta: {
    name,
    version,
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: "^3.0.0"
    }
  },
  setup({
    moduleOptions,
    vuetifyOptions: _vuetifyOptions
  }, nuxt) {
    var _a, _b;
    if (!isNuxt3(nuxt)) {
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`);
    }
    const {
      styles,
      autoImport,
      useIconCDN,
      treeshaking
    } = moduleOptions;
    const isSSR = nuxt.options.ssr;
    const vuetifyOptions = defu(_vuetifyOptions, {
      ssr: isSSR,
      treeshaking,
      importLabComponents: moduleOptions.importLabComponents
    });
    const resolver = createResolver(import.meta.url);
    const runtimeDir = resolver.resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push(CONFIG_KEY);
    (_a = nuxt.options).css ?? (_a.css = []);
    if (typeof styles === "string" && ["sass", "expose"].includes(styles)) {
      nuxt.options.css.unshift("vuetify/styles/main.sass");
    } else if (styles === true) {
      nuxt.options.css.unshift("vuetify/styles");
    } else if (isSSR && !treeshaking && typeof styles === "object" && styles?.configFile && typeof styles.configFile === "string") {
      nuxt.options.css.unshift(styles.configFile);
    }
    if (useIconCDN) {
      const iconCDNs = /* @__PURE__ */ new Map();
      iconCDNs.set("fa", "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css");
      iconCDNs.set("mdi", "https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css");
      iconCDNs.set("md", "https://fonts.googleapis.com/css?family=Material+Icons");
      (_b = nuxt.options.app.head).link || (_b.link = []);
      nuxt.options.app.head.link.push({
        rel: "stylesheet",
        type: "text/css",
        href: iconCDNs.get(vuetifyOptions.icons?.defaultSet || "mdi")
      });
    }
    nuxt.hook("vite:extendConfig", (config) => {
      config.optimizeDeps = defu(config.optimizeDeps, { exclude: ["vuetify"] });
      if (treeshaking) {
        config.plugins = [
          ...Array.isArray(config.plugins) ? config.plugins : [],
          vuetify({
            styles,
            autoImport
          })
        ];
      }
      config.ssr || (config.ssr = {});
      config.ssr.noExternal = [
        ...Array.isArray(config.ssr.noExternal) ? config.ssr.noExternal : [],
        CONFIG_KEY
      ];
    });
    addPluginTemplate({
      src: resolver.resolve(runtimeDir, "templates/plugin.mts"),
      options: vuetifyOptions
    });
  }
});

export { module as default };
