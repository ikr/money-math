(function (factory) {
    "use strict";

    var root = (typeof self === "object" && self.self === self && self) ||
                (typeof global === "object" && global.global === global && global);


    if (typeof exports !== "undefined") {
        var BigInteger = require("jsbn").BigInteger;
        factory(root, exports, BigInteger);
    } else {
        var BigInt = root.BigInteger ? root.BigInteger : root.jsbn.BigInteger;
        root.Money = factory(root, {}, BigInt);
    }
}(function (root, Money, BigInteger) {
    "use strict";

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
                    Money.add(wholeAmount, "1.00")
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

        case "SEK":
        case "LTL":
        case "PLN":
        case "SKK":
        case "UAH":
            return separateThousands(integerValue(amount), " ") + "," + amount.substr(-2);

        default:
            return amount;
        }
    };

    Money.amountToCents = function (amount) {
        return amount.replace(".", "");
    };

    Money.centsToAmount = function (cents) {
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

    Money.floatToAmount = function (f) {
        return ("" + (Math.round(f * 100.0) / 100.0))
            .replace(/^-(\d+)$/, "-$1.00")              //-xx
            .replace(/^(\d+)$/, "$1.00")                //xx
            .replace(/^-(\d+)\.(\d)$/, "-$1.$20")       //-xx.xx
            .replace(/^(\d+)\.(\d)$/, "$1.$20");        //xx.xx
    };

    Money.integralPart = function (amount) {
        return integerValue(amount);
    };

    Money.format = function (currency, amount) {
        return new Currency(currency).format(amount);
    };

    Money.add = function (a, b) {
        return Money.centsToAmount(
            new BigInteger(
                Money.amountToCents(a)
            ).add(
                new BigInteger(Money.amountToCents(b))
            ).toString()
        );
    };

    Money.subtract = function (a, b) {
        return Money.centsToAmount(
            new BigInteger(
                Money.amountToCents(a)
            ).subtract(
                new BigInteger(Money.amountToCents(b))
            ).toString()
        );
    };

    Money.mul = function (a, b) {
        var hundredthsOfCents = new BigInteger(
                Money.amountToCents(a)
            ).multiply(
                new BigInteger(Money.amountToCents(b))
            ),

            remainder = parseInt(hundredthsOfCents.toString().substr(-2), 10);

        return Money.centsToAmount(
            hundredthsOfCents.divide(
                new BigInteger("100")
            ).add(
                new BigInteger(remainder >= 50 ? "1" : "0")
            ).toString()
        );
    };

    Money.div = function (a, b) {
        var hundredthsOfCents = new BigInteger(
                Money.amountToCents(a)
            ).multiply(
                new BigInteger("10000")
            ).divide(
                new BigInteger(Money.amountToCents(b))
            ),

            remainder = parseInt(hundredthsOfCents.toString().substr(-2), 10);

        return Money.centsToAmount(
            hundredthsOfCents.divide(
                new BigInteger("100")
            ).add(
                new BigInteger(remainder >= 50 ? "1" : "0")
            ).toString()
        );
    };

    Money.percent = function (value, percent) {
        var p = new BigInteger(
                Money.amountToCents(value)
            ).multiply(
                new BigInteger(Money.amountToCents(percent))
            ),

            q = p.divide(new BigInteger("10000")),
            r = p.mod(new BigInteger("10000"));

        return Money.centsToAmount(
            (r.compareTo(new BigInteger("4999")) > 0 ? q.add(new BigInteger("1")) : q).toString()
        );
    };

    Money.roundUpTo5Cents = function (amount) {
        var lastDigit = parseInt(amount.substr(-1), 10),
            additon = "0.00";

        if ((lastDigit % 5) !== 0) {
            additon = "0.0" + (5 - (lastDigit % 5));
        }

        return Money.add(amount, additon);
    };

    Money.roundTo5Cents = function (amount) {
        return Money.div(
            round(Money.mul(amount, "20.00")),
            "20.00"
        );
    };

    Money.cmp = function (a, b) {
        return new BigInteger(a.replace(".", "")).compareTo(new BigInteger(b.replace(".", "")));
    };

    Money.isEqual = function (a, b) {
        return Money.cmp(a, b) === 0;
    };

    Money.isZero = function (a) {
        return Money.isEqual(a, "0.00");
    };

    Money.isNegative = function (a) {
        return Money.cmp(a, "0.00") < 0;
    };

    Money.isPositive = function (a) {
        return Money.cmp(a, "0.00") > 0;
    };

    return Money;
}));
