import _ from "lodash";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { packages } from './package-lock.json';
import _package from './package.json';

const isDev = process.env.NODE_ENV?.trim() !== 'production';

const importmap = (() => {
    const version = (name) => packages["node_modules/" + name].version;
    const nameAtVesrion = name => /.@/.test(name) ? name : `${name}@${version(name)}`;
    const unpkg = path => name => `https://unpkg.com/${nameAtVesrion(name)}/${path}`;
    const esmBundle = path => name => `https://unpkg.com/@esm-bundle/${nameAtVesrion(name)}/${path}`;
    const min = isDev ? "" : ".min";
    return {
        "imports": _.mapValues({
            "lodash": esmBundle(`esm/index.js`),
            "rxjs": esmBundle(`esm/es2015/rxjs.min.js`),
            "preact": unpkg(`dist/preact.mjs`),
            "preact/hooks": unpkg(`hooks/dist/hooks.mjs`)("preact"),
            "@emotion/css": esmBundle(`esm/emotion${min}.js`)("emotion@10.0.27"),
        }, (link, name) => _.isFunction(link) ? link(name) : link),
    }
})();

const renderIndexHtml = (bundle) => {
    const importmapStr = JSON.stringify(importmap, undefined, isDev ? "    " : undefined);
    const modulePreloadStr = Object.values(importmap.imports)
        .map(link => /*html*/`<link rel="modulepreload" href="${link}"/>`)
        .join("\n");
    return /*html*/`<!DOCTYPE html>
<html lang="en"><head><title>${_package.name}</title></head><body>
    <script async src="https://unpkg.com/es-module-shims@1.5.5/dist/es-module-shims.js"></script>
    <script type="importmap">${importmapStr}</script>
    ${modulePreloadStr}
    <script type="module">${bundle}</script>
</body></html>`;
}

const bundleName = `index.bundle.js`;
export default {
    input: './src/index.tsx',
    output: {
        file: bundleName,
        format: 'esm',
        sourcemap: isDev && "inline",
    },
    external: Object.keys(importmap.imports),
    plugins: [
        resolve({
            preferBuiltins: false,
            browser: true,
        }),
        commonjs(),
        typescript(isDev && {
            target: "ESNext",
        }),
        {
            generateBundle(outputOptions, bundleInfo) {
                this.emitFile({
                    type: 'asset',
                    fileName: "index.html",
                    source: renderIndexHtml(bundleInfo[bundleName].code),
                });
                delete bundleInfo[bundleName];
            }
        }
    ],
}