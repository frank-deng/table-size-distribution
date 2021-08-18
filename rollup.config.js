import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.js',
    output:{
        name:"SizeDistributor",
        file:"dist/index.js",
        format:'umd',
        sourcemap:false,
        compact:true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        terser()
    ]
};
