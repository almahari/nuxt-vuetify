import * as _nuxt_schema from '@nuxt/schema';
import { VuetifyOptions } from 'vuetify';

type TVuetifyOptions = Partial<VuetifyOptions> & {
    ssr: boolean;
    treeshaking: boolean;
};
interface ModuleOptions {
    moduleOptions: {
        useIconCDN?: boolean;
        treeshaking?: boolean;
        autoImport?: boolean;
        importLabComponents?: boolean;
        styles?: true | 'none' | 'expose' | 'sass' | {
            configFile: string;
        };
    };
    vuetifyOptions?: VuetifyOptions;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { ModuleOptions, TVuetifyOptions, _default as default };
