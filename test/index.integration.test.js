import fileContentReplace from "../src/index";
import assert from 'assert';
import {rollup} from "rollup";
import requireFromString from 'require-from-string';
import {resolve} from "path";


describe('Integration test', function () {
    it('vacuous tests', async () => {
        assert.equal('foo', 'foo');
    });

    it('rollup should replace the content of a file with another file', async () => {
        const inputOptions = {
            input: 'test/resources/entry.js',
            plugins: [fileContentReplace({
                fileReplacements: [{
                    replace: 'external.module.js',
                    with: 'external-replacement.module.js'
                }],
                root: resolve(__dirname, 'resources')
            })]
        };

        const outputOptions = {
            format: 'umd',
            name: 'test-bundle'
        };

        const rollupBuilder = await rollup(inputOptions);

        const generatedBundle = await rollupBuilder.generate(outputOptions);
        const code = generatedBundle.code;

        const module = requireFromString(code);
        assert.equal(module.input, 'alternative content')
    });

    it('rollup should replace the content of a file with another file even when the files are not in root dir', async () => {
        const inputOptions = {
            input: 'test/resources/entry-with-subdir-imports.js',
            plugins: [fileContentReplace({
                fileReplacements: [{
                    replace: 'subdir/external.module.js',
                    with: 'subdir/external-replacement.module.js'
                }],
                root: resolve(__dirname, 'resources')
            })]
        };

        const outputOptions = {
            format: 'umd',
            name: 'test-bundle'
        };

        const rollupBuilder = await rollup(inputOptions);

        const generatedBundle = await rollupBuilder.generate(outputOptions);
        const code = generatedBundle.code;

        const module = requireFromString(code);
        assert.equal(module.input, 'alternative content')
    });

    it('should throw an error if any replacement files do not exist', async () => {
        console.log('dir ', resolve(__dirname, 'test'));
        const inputOptions = {
            input: 'test/resources/entry-with-subdir-imports.js',
            plugins: [fileContentReplace({
                fileReplacements: [{
                    replace: 'subdir/external.module.js',
                    with: 'subdir/external-replacement.module.blah.js',
                }],
                root: resolve(__dirname, 'resources')
            })]
        };

        try {
            await rollup(inputOptions);
            assert.fail('Rollup should have thrown a build error')
        } catch (e) {
            assert.ok(e.message.includes('Could not load'));
            assert.ok(true);
        }

    });

});