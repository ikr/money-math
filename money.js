(function () {
    "use strict";

    var BigInteger = require("jsbn");

    var Currency = function (code) {
            this.code = code;
        },

        separateThousands = function (inStr, withStr) {
            var sign = "",
                src = inStr,
                ret = "",
                appendix;

            if (inStr[0] === "-") {
                sign = "-";
                src = src.substr(1);
            }


            while (src.length > 0) {
                if (ret.length > 0) {
                    ret = withStr + ret;
                }

                if (src.length <= 3) {
                    ret = src + ret;
                    break;
                }

                appendix = src.substr(src.length - 3, 3);
                ret = appendix + ret;
                src = src.substr(0, src.length - 3);
            }

            return sign + ret;
        },

        integerValue = function (amount) {
            return (/^(\-?\d+)\.\d\d$/).exec(amount)[1];
        },

        isString = function (obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        },

        round = function (amount) {
            var fraction = parseInt(amount.substr(-2), 10),
                wholeAmount = integerValue(amount) + ".00";

            return (
                fraction < 50 ?
                wholeAmount :
                exports.add(wholeAmount, "1.00")
            );
        };

    Currency.prototype.format = function (amount) {
        switch (this.code) {
        case "JPY":
            return separateThousands(integerValue(amount), ",");

        case "EUR":
        case "GBP":
            return separateThousands(integerValue(amount), ".") + "," + amount.substr(-2);

        case "CHF":
        case "USD":
            return separateThousands(integerValue(amount), ",") + "." + amount.substr(-2);

        default:
            return amount;
        }
    };

    exports.amountToCents = function (amount) {
        return amount.replace(".", "");
    };

    exports.centsToAmount = function (cents) {
        var sign,
            abs;

        if (!isString(cents)) {
            return undefined;
        }

        sign = (cents[0] === "-" ? "-" : "");
        abs = (sign === "-" ? cents.substr(1) : cents);

        while (abs.length < 3) {
            abs = ["0", abs].join("");
        }

        return sign + abs.substr(0, abs.length - 2) + "." + abs.substr(-2);
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
            new BigInteger(
                exports.amountToCents(a)
            ).add(
                new BigInteger(exports.amountToCents(b))
            ).toString()
        );
    };

    exports.subtract = function (a, b) {
        return exports.centsToAmount(
            new BigInteger(
                exports.amountToCents(a)
            ).subtract(
                new BigInteger(exports.amountToCents(b))
            ).toString()
        );
    };

    exports.mul = function (a, b) {
        return exports.centsToAmount(
            new BigInteger(
                exports.amountToCents(a)
            ).multiply(
                new BigInteger(exports.amountToCents(b))
            ).divide(
                new BigInteger("100")
            ).toString()
        );
    };

    exports.div = function (a, b) {
        var hundredthsOfCents = new BigInteger(
                exports.amountToCents(a)
            ).multiply(
                new BigInteger("10000")
            ).divide(
                new BigInteger(exports.amountToCents(b))
            ),

            remainder = parseInt(hundredthsOfCents.toString().substr(-2), 10);

        return exports.centsToAmount(
            hundredthsOfCents.divide(
                new BigInteger("100")
            ).add(
                new BigInteger(remainder > 50 ? "1" : "0")
            ).toString()
        );
    };

    exports.percent = function (value, percent) {
        var p = new BigInteger(
                exports.amountToCents(value)
            ).multiply(
                new BigInteger(exports.amountToCents(percent))
            ),

            q = p.divide(new BigInteger("10000")),
            r = p.mod(new BigInteger("10000"));

        return exports.centsToAmount(
            (r.compareTo(new BigInteger("4999")) > 0 ? q.add(new BigInteger("1")) : q).toString()
        );
    };

    exports.roundUpTo5Cents = function (amount) {
        var lastDigit = parseInt(amount.substr(-1), 10),
            additon = "0.00";

        if ((lastDigit % 5) !== 0) {
            additon = "0.0" + (5 - (lastDigit % 5));
        }

        return exports.add(amount, additon);
    };

    exports.roundTo5Cents = function (amount) {
        return exports.div(
            round(exports.mul(amount, "20.00")),
            "20.00"
        );
    };
}());
