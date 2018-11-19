/**
 * Created by chenxq on 2018/11/19.
 */
module.exports = (function() {
    var unique = 0;
    return function() {
        unique++;
        return "(key." + unique + ")";
    };
})();
