import fileContentReplace from "../src";
import assert from 'assert';


describe('Unit tests', function () {
    let randomOtherModule;
    let pluginSut = fileContentReplace({});
    beforeEach(() => {
        randomOtherModule = 'other.module.js' + new Date().getMilliseconds();
        pluginSut = fileContentReplace({
            fileReplacements: [
                {
                    replace: 'relative.module.js',
                    with: randomOtherModule
                }
            ]
        });
    });

    describe('should resolve primary file to alternate file when...', function () {
        it('a primary file is imported relatively' , function () {

            const newResolvePath = pluginSut.resolveId('./relative.module', '/root/somewhere/something.js');

            assert.equal(newResolvePath, '/root/somewhere/' + randomOtherModule)
        });

        it('a primary file is a full match with one of the replacement files', function () {
            assert.equal(pluginSut.resolveId('./other.relative.module', '/root/somewhere/something.js'), null);
        });

        it(' and it should output a path relative to primary file' , function () {
            const randomOtherModule = 'other.module.js' + new Date().getMilliseconds();
            const randomPath = '/root/somewhere/' + new Date().getMilliseconds();

            const newResolvePath = pluginSut.resolveId('./relative.module', randomPath + '/something.js');

            assert.equal(newResolvePath, randomPath + '/' + randomOtherModule)
        });
    });



    describe('shoud pass resolution to someone else when...', function () {
        it('not resolving an internal project path', function () {
            assert.equal(pluginSut.resolveId('@some-module/relative.module', '/root/somewhere/something.js'), null);
        });

        it('the file is not being replaced', function () {
            assert.equal(pluginSut.resolveId('./other.relative.module', '/root/somewhere/something.js'), null);
        });

        it('the file being imported is the entry module', function () {
            // Entry module is imported as the importee with an extension and with the importer undefined
            assert.equal(pluginSut.resolveId('./somewhere/relative.module.js', undefined), null);
        });
    });
});



