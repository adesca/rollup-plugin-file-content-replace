"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fileContentReplace;

var _path = require("path");

var _util = require("util");

var _fs = require("fs");

function fileContentReplace() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        fileReplacements: [],
        root: ''
    };

    var normalizeFileNameToModuleName = function normalizeFileNameToModuleName(filename) {
        return filename.split('.').slice(0, -1).join('.');
    };

    var getReplacementObject = function getReplacementObject() {
        var targetReplaceImport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var fileReplacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var targetImportModule = targetReplaceImport.split('/').splice(1).join('/');
        return fileReplacements.find(function (replacement) {
            return targetImportModule === normalizeFileNameToModuleName(replacement.replace);
        });
    };

    var validateReplacementFiles = async function validateReplacementFiles() {
        var fileReplacements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var pluginContext = arguments[1];

        fileReplacements.forEach(async function (replacement) {
            try {

                await (0, _util.promisify)((0, _fs.access)((0, _path.resolve)(options.root, replacement.with)));
            } catch (e) {
                pluginContext.error('Could not find file: ' + replacement.with);
            }
        });
    };

    return {
        name: 'file-content-replace',
        buildStart: function buildStart() {
            try {
                return validateReplacementFiles(options.fileReplacements, this);
            } catch (e) {
                return Promise.reject();
            }
        },
        load: function load(id) {
            console.log('identification ', id);
        },
        resolveId: function resolveId(importee, importer) {
            console.log('importee ', importee);
            console.log('importer ', importer);

            // if ( /\0/.test( importee ) ) return null; // ignore IDs with null character, these belong to other plugins
            //
            // disregard entry module, unneeded but this makes the check explicit instead of implicit
            if (!importer) return null;

            // If this is an import relative to the parent dir of importer
            if (importee[0] === '.') {
                var replacementObject = getReplacementObject(importee, options.fileReplacements);
                if (replacementObject) {
                    return (0, _path.resolve)(importer, '..', replacementObject.with);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };
}