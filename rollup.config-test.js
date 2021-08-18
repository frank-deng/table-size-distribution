import babel from 'rollup-plugin-babel';
export default{
    input: 'src/test.js',
    output:{
        file:"__test__.js",
        format:'commonjs',
        sourcemap:false
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        })
    ]
};
