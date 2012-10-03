(function (exports) {
    "use strict";

    var bignum = require("bignum"),

        Currency = function (code) {
            this.code = code;
        },

        separateThousands = function (in_str, with_str) {
            var sign = "",
                src = in_str,
                ret = "",
                appendix;

            if ("-" === in_str[0]) {
                sign = "-";
                src = src.substr(1);
            }


            while (src.length > 0) {
                if (ret.length > 0) {
                    ret = with_str + ret;
                }

                if (src.length <= 3) {
                    ret = src + ret;
                    break;
                }

                appendix =  src.substr(src.length - 3, 3);
                ret = appendix + ret;
                src =  src.substr(0, src.length - 3);
            }

            return sign + ret;
        },

        integerValue = function (amount) {
            return (/^(\-?\d+)\.\d\d$/).exec(amount)[1];
        },

        isString = function (obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        };

    Currency.prototype.format = function (amount) {
        switch (this.code) {
        case "JPY":
            return separateThousands(integerValue(amount), ",");

        case 'EUR':
        case 'GBP':
            return separateThousands(integerValue(amount), ".") + "," + amount.substr(-2);

        case 'CHF':
        case 'USD':
            return separateThousands(integerValue(amount), ",") + "." + amount.substr(-2);

        default:
            return amount;
        }
    };

    exports.amountToCents = function (amount) {
        return amount.replace(".", "");
    };

    exports.centsToAmount = function (cents) {
        if (!isString(cents)) {
            return;
        }

        while (cents.length < 3) {
            cents = ["0", cents].join("");
        }

        return cents.substr(0, cents.length - 2) + "." + cents.substr(-2);
    };

    exports.floatToAmount = function (f) {
        return ("" + Math.round(f * 100.0) / 100.0)
            .replace(/^(\d+)$/, "$1.00")
            .replace(/^(\d+)\.(\d)$/, "$1.$20");
    };

    exports.integralPart = function (amount) {
        return integerValue(amount);
    };

    exports.format = function (currency, amount) {
        return new Currency(currency).format(amount);
    };

    exports.add = function (a, b) {
        return exports.centsToAmount(
            bignum(exports.amountToCents(a)).add(exports.amountToCents(b)).toString()
        );
    };

    exports.subtract = function (a, b) {
        return exports.centsToAmount(
            bignum(exports.amountToCents(a)).sub(exports.amountToCents(b)).toString()
        );
    };

    exports.mul = function (a, b) {
        return exports.centsToAmount(
            bignum(exports.amountToCents(a)).mul(exports.amountToCents(b)).div("100").toString()
        );
    };

    exports.percent = function (value, percent) {
        var p = bignum(exports.amountToCents(value)).mul(exports.amountToCents(percent)),
            q = p.div("10000"),
            r = p.mod("10000");

        return exports.centsToAmount(
            (r.gt("4999") ? q.add(1) : q).toString()
        );
    };
}(exports));
