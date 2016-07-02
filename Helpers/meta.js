module.exports = {
    copy: function (origin, destiny) {

        var keys = Object.keys(origin);

        for (var i = 0; i < keys.length; i++) {
            destiny[keys[i]] = origin[keys[i]];
        }
    }
}