(function () {
    "use strict";

    var assert = require("assert"),
        money = require("../money");

    describe("money.amountToCents()", function () {
        it("works on positive amount", function () {
            assert.strictEqual(money.amountToCents("126.99"), "12699");
        });

        it("works on negative amount", function () {
            assert.strictEqual(money.amountToCents("-10001.00"), "-1000100");
        });

        it("works on just cents, removes 0 from start", function () {
            assert.strictEqual(money.amountToCents("0.99"), "99");
        });
    });

    describe("money.centsToAmount()", function () {
        it("works on positive amount", function () {
            assert.strictEqual(money.centsToAmount("2000010"), "20000.10");
        });

        it("works on negative amount", function () {
            assert.strictEqual(money.centsToAmount("-1000100"), "-10001.00");
        });

        it("works on a negative fraction", function () {
            assert.strictEqual(money.centsToAmount("-32"), "-0.32");
        });

        it("works on a tiny negative fraction", function () {
            assert.strictEqual(money.centsToAmount("-1"), "-0.01");
        });

        it("works for zero", function () {
            assert.strictEqual(money.centsToAmount("0"), "0.00");
        });

        it("works for one", function () {
            assert.strictEqual(money.centsToAmount("1"), "0.01");
        });

        it("works for ten", function () {
            assert.strictEqual(money.centsToAmount("10"), "0.10");
        });

        it("is undefined on undefined", function () {
            assert.strictEqual(typeof money.centsToAmount(), "undefined");
        });
    });

    describe("money.integralPart", function () {
        it("returns the value before the decimal separator for a positive amount", function () {
            assert.strictEqual(money.integralPart("12.00"), "12");
        });

        it("returns the value before the decimal separator for a negative amount", function () {
            assert.strictEqual(money.integralPart("-55.10"), "-55");
        });

        it("returns zero for zero", function () {
            assert.strictEqual(money.integralPart("0.00"), "0");
        });
    });

    describe("money.format()", function () {
        it("works for CHF", function () {
            assert.strictEqual(money.format("CHF", "560.05"), "560.05");
            assert.strictEqual(money.format("CHF", "-1560.00"), "-1,560.00");
        });

        it("works for JPY", function () {
            assert.strictEqual(money.format("JPY", "560.00"), "560");
            assert.strictEqual(money.format("JPY", "236800.00"), "236,800");
            assert.strictEqual(money.format("JPY", "-1000000000.00"), "-1,000,000,000");
            assert.strictEqual(money.format("JPY", "-100000000000.00"), "-100,000,000,000");
        });

        it("works for EUR", function () {
            assert.strictEqual(money.format("EUR", "560.00"), "560,00");
            assert.strictEqual(money.format("EUR", "-1560.00"), "-1.560,00");
            assert.strictEqual(money.format("EUR", "-100000000000.00"), "-100.000.000.000,00");
        });

        it("works for SEK", function () {
            assert.strictEqual(money.format("SEK", "560.00"), "560,00");
            assert.strictEqual(money.format("SEK", "-1560.00"), "-1 560,00");
            assert.strictEqual(money.format("SEK", "-100000000000.00"), "-100 000 000 000,00");
        });
    });

    describe("money.add()", function () {
        it("sums positive decimals 1", function () {
            assert.strictEqual(money.add("16.11", "17.07"), "33.18");
        });

        it("sums positive decimals 2", function () {
            assert.strictEqual(money.add("65535.79", "1024.85"), "66560.64");
        });

        it("sums positive decimals 3", function () {
            assert.strictEqual(money.add("1.99", "0.02"), "2.01");
        });

        it("sums positive decimals 4", function () {
            assert.strictEqual(money.add("1.90", "0.10"), "2.00");
        });

        it("sums positive decimals 5", function () {
            assert.strictEqual(money.add("1.09", "0.01"), "1.10");
        });

        it("sums two zeroes", function () {
            assert.strictEqual(money.add("0.00", "0.00"), "0.00");
        });

        it("sums negative decimals", function () {
            assert.strictEqual(money.add("-1.99", "-0.02"), "-2.01");
        });

        it("sums mixed decimals 1", function () {
            assert.strictEqual(money.add("-1.99", "1.99"), "0.00");
        });

        it("sums mixed decimals 2", function () {
            assert.strictEqual(money.add("-1.99", "0.98"), "-1.01");
        });

        it("chain-sums decimals", function () {
            assert.strictEqual(
                money.add("194.00", money.add("23.30", money.add("210.00", "355.00"))), "782.30");
        });

        it("is commutative", function () {
            assert.strictEqual(money.add("194.00", "23.30"), money.add("23.30", "194.00"));
        });

        it("works on huge number", function () {
            assert.strictEqual(
                money.add(
                    "99999999999999999999999999999999999999999999999999999999999999999999999999999999.99",
                    "0.01"
                ),

                "100000000000000000000000000000000000000000000000000000000000000000000000000000000.00"
            );
        });
    });

    describe("money.subtract()", function () {
        it("calculates difference 1", function () {
            assert.strictEqual(
                money.subtract("700000000000000000000.00", "700000000000000000000.00"), "0.00");
        });

        it("calculates difference 2", function () {
            assert.strictEqual(money.subtract("-10.00", "5.00"), "-15.00");
        });
    });

    describe("money.mul()", function () {
        it("multiplies two decimals 1", function () {
            assert.strictEqual(money.mul("-2.00", "2.00"), "-4.00");
        });

        it("multiplies two decimals 2", function () {
            assert.strictEqual(money.mul("24.00", "0.25"), "6.00");
        });

        it("does the rounding right", function () {
            assert.strictEqual(money.mul("2090.50", "8.61"), "17999.21");
        });
    });

    describe("money.div()", function () {
        it("basically works", function () {
            assert.strictEqual(money.div("64.00", "2.00"), "32.00");
        });

        it("rounds stuff up 1", function () {
            assert.strictEqual(money.div("1.00", "3.00"), "0.33");
        });

        it("rounds stuff up 2", function () {
            assert.strictEqual(money.div("0.50", "3.00"), "0.17");
        });

        it("works for negative dividend, with rounding up", function () {
            assert.strictEqual(money.div("-1.00", "3.00"), "-0.33");
        });

        it("works for small fractions", function () {
            assert.strictEqual(money.div("0.02", "0.03"), "0.67");
        });
    });

    describe("money.percent()", function () {
        it("calcualtes the [2nd argument] percent of the [1st argument] 1", function () {
            assert.strictEqual(money.percent("100.00", "7.45"), "7.45");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 2", function () {
            assert.strictEqual(money.percent("100.00", "0.01"), "0.01");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 3", function () {
            assert.strictEqual(money.percent("100.00", "110.00"), "110.00");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 4", function () {
            assert.strictEqual(money.percent("-200.00", "3.25"), "-6.50");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 5", function () {
            assert.strictEqual(money.percent("0.50", "33.00"), "0.17");
        });
    });

    describe("money.floatToAmount()", function () {
        it("it converts a positive float with 2-digit fractional part to string", function () {
            assert.strictEqual(money.floatToAmount(11.12), "11.12");
        });

        it("it appends '.00' to a whole positive number", function () {
            assert.strictEqual(money.floatToAmount(56), "56.00");
        });

        it("it appends '.0' to a positive number with 1-digit fraction", function () {
            assert.strictEqual(money.floatToAmount(56.3), "56.30");
        });

        it("it converts a negative float with 2-digit fractional part to string", function () {
            assert.strictEqual(money.floatToAmount(-11.12), "-11.12");
        });

        it("it appends '.00' to a whole negative number", function () {
            assert.strictEqual(money.floatToAmount(-56), "-56.00");
        });

        it("it appends '.0' to a negative number with 1-digit fraction", function () {
            assert.strictEqual(money.floatToAmount(-56.3), "-56.30");
        });

        it("rounds half up a long-fraction number A", function () {
            assert.strictEqual(money.floatToAmount(56.3411111), "56.34");
        });

        it("rounds half up a long-fraction number B", function () {
            assert.strictEqual(money.floatToAmount(56.345), "56.35");
        });

        it("rounds half up a long-fraction number C", function () {
            assert.strictEqual(money.floatToAmount(0.3499), "0.35");
        });

        it("rounds half up a long-fraction number D", function () {
            assert.strictEqual(money.floatToAmount(-0.345), "-0.34");
        });

        it("rounds half up a long-fraction number E", function () {
            assert.strictEqual(money.floatToAmount(-0.346), "-0.35");
        });

        it("rounds the -0.235 to -0.23", function () {
            assert.strictEqual(money.floatToAmount(-0.235), "-0.23");
        });

        it("rounds the -100.996 to -101.00", function () {
            assert.strictEqual(money.floatToAmount(-100.996), "-101.00");
        });

        it("rounds the -999.995 to -999.99", function () {
            assert.strictEqual(money.floatToAmount(-999.995), "-999.99");
        });

        it("rounds the -999.996 to -1000.00", function () {
            assert.strictEqual(money.floatToAmount(-999.996), "-1000.00");
        });

        it("rounds 8.175 to 8.18", function () {
            assert.strictEqual(money.floatToAmount(8.175), "8.18");
        });

        it("rounds 8.165 to 8.17", function () {
            assert.strictEqual(money.floatToAmount(8.165), "8.17");
        });
    });

    describe("money.roundUpTo5Cents()", function () {
        it("is identical for zero", function () {
            assert.strictEqual(money.roundUpTo5Cents("0.00"), "0.00");
        });

        it("rounds 02 to 05", function () {
            assert.strictEqual(money.roundUpTo5Cents("1.02"), "1.05");
        });

        it("rounds 06 to 10", function () {
            assert.strictEqual(money.roundUpTo5Cents("156.06"), "156.10");
        });
    });

    describe("money.roundTo5Cents()", function () {
        it("is identical for one", function () {
            assert.strictEqual(money.roundTo5Cents("1.00"), "1.00");
        });

        it("rounds 01 to 00", function () {
            assert.strictEqual(money.roundTo5Cents("2.01"), "2.00");
        });

        it("rounds 04 to 05", function () {
            assert.strictEqual(money.roundTo5Cents("2.04"), "2.05");
        });

        it("rounds 26 to 25", function () {
            assert.strictEqual(money.roundTo5Cents("442.26"), "442.25");
        });

        it("rounds 97 to 95", function () {
            assert.strictEqual(money.roundTo5Cents("1.97"), "1.95");
        });

        it("rounds 88 to 90", function () {
            assert.strictEqual(money.roundTo5Cents("1.88"), "1.90");
        });
    });

    describe("money.isNegative()", function () {
        it("-100.00 is negative", function () {
            assert.strictEqual(money.isNegative("-100.00"), true);
        });

        it("100.00 is not negative", function () {
            assert.strictEqual(money.isNegative("100.00"), false);
        });

        it("0 is not negative", function () {
            assert.strictEqual(money.isNegative("0.00"), false);
        });
    });

    describe("money.isPositive()", function () {
        it("-100.00 is not positive", function () {
            assert.strictEqual(money.isPositive("-100.00"), false);
        });

        it("100.00 is positive", function () {
            assert.strictEqual(money.isPositive("100.00"), true);
        });

        it("0 is not positive", function () {
            assert.strictEqual(money.isPositive("0.00"), false);
        });
    });

    describe("money.isZero()", function () {
        it("-100.00 is not zero", function () {
            assert.strictEqual(money.isZero("-100.00"), false);
        });

        it("100.00 is not zero", function () {
            assert.strictEqual(money.isZero("100.00"), false);
        });

        it("0 is zero", function () {
            assert.strictEqual(money.isZero("0.00"), true);
        });
    });

    describe("money.cmp()", function () {
        it("big and small", function () {
            assert.strictEqual(money.cmp("55.00", "6.00") > 0, true);
        });

        it("small and big", function () {
            assert.strictEqual(money.cmp("8.00", "11.00") < 0, true);
        });

        it("equal", function () {
            assert.strictEqual(money.cmp("8.00", "8.00"), 0);
        });

        it("big cents and small cents", function () {
            assert.strictEqual(money.cmp("0.10", "0.05") > 0, true);
        });

        it("small cents and big cents", function () {
            assert.strictEqual(money.cmp("0.01", "0.20") < 0, true);
        });

        it("equal with cents", function () {
            assert.strictEqual(money.cmp("8.16", "8.16"), 0);
        });

        it("long amount big and small", function () {
            assert.strictEqual(
                money.cmp(
                    "5999999999999999999999999999999999999999999999999999999999999999999999999.00",
                    "599999999999999999999999999999999999999999999999999999999999999999999999.00"
                ) > 0,
                true
            );
        });

        it("long amount small and big", function () {
            assert.strictEqual(
                money.cmp(
                    "5999999999999999999999999999999999999999999999999999999999999999999999991.00",
                    "5999999999999999999999999999999999999999999999999999999999999999999999999.00"
                ) < 0,
                true
            );
        });

        it("long amount equal", function () {
            assert.strictEqual(
                money.cmp(
                    "5999999999999999999999999999999999999999999999999999999999999999999999999.00",
                    "5999999999999999999999999999999999999999999999999999999999999999999999999.00"
                ),
                0
            );
        });

        it("long amount with cents", function () {
            assert.strictEqual(
                money.cmp(
                    "5999999999999999999999999999999999999999999999999999999999999999999999999.10",
                    "5999999999999999999999999999999999999999999999999999999999999999999999999.02"
                ) > 0,
                true
            );
        });
    });

    describe("money comparison helpers", function () {
        it("-100.00 not equal 100.00", function () {
            assert.strictEqual(money.isEqual("-100.00", "100.00"), false);
        });

        it("1.00 equals 1.00", function () {
            assert.strictEqual(money.isEqual("1.00", "1.00"), true);
        });

        it("isLessThan", function () {
            assert.strictEqual(money.isLessThan("1.00", "1.00"), false);
        });

        it("isGreaterThan", function () {
            assert.strictEqual(money.isGreaterThan("1.00", "1.00"), false);
        });

        it("isLessOrEqualTo", function () {
            assert.strictEqual(money.isLessOrEqualTo("1.00", "1.00"), true);
        });

        it("isGreaterOrEqualTo", function () {
            assert.strictEqual(money.isGreaterOrEqualTo("1.00", "1.00"), true);
        });
    });
}());
