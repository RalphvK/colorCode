var exports = module.exports = {};

exports.file = function (path) {
    (1, eval)(require('fs').readFileSync(__dirname + '/' + path) + '');
};