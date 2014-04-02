(function () {
    "use strict";

    var money = require("../money");

    describe("money.amountToCents()", function () {
        it("works on positive amount", function () {
            expect(money.amountToCents("126.99")).toBe("12699");
        });

        it("works on negative amount", function () {
            expect(money.amountToCents("-10001.00")).toBe("-1000100");
        });
    });

    describe("money.centsToAmount()", function () {
        it("works on positive amount", function () {
            expect(money.centsToAmount("2000010")).toBe("20000.10");
        });

        it("works on negative amount", function () {
            expect(money.centsToAmount("-1000100")).toBe("-10001.00");
        });

        it("works on a negative fraction", function () {
            expect(money.centsToAmount("-32")).toBe("-0.32");
        });

        it("works on a tiny negative fraction", function () {
            expect(money.centsToAmount("-1")).toBe("-0.01");
        });

        it("works for zero", function () {
            expect(money.centsToAmount("0")).toBe("0.00");
        });

        it("works for one", function () {
            expect(money.centsToAmount("1")).toBe("0.01");
        });

        it("works for ten", function () {
            expect(money.centsToAmount("10")).toBe("0.10");
        });

        it("is undefined on undefined", function () {
            expect(money.centsToAmount()).not.toBeDefined();
        });
    });

    describe("money.integralPart", function () {
        it("returns the value before the decimal separator for a positive amount", function () {
            expect(money.integralPart("12.00")).toBe("12");
        });

        it("returns the value before the decimal separator for a negative amount", function () {
            expect(money.integralPart("-55.10")).toBe("-55");
        });

        it("returns zero for zero", function () {
            expect(money.integralPart("0.00")).toBe("0");
        });
    });

    describe("money.format()", function () {
        it("works for CHF", function () {
            expect(money.format("CHF", "560.05")).toBe("560.05");
            expect(money.format("CHF", "-1560.00")).toBe("-1,560.00");
        });

        it("works for JPY", function () {
            expect(money.format("JPY", "560.00")).toBe("560");
            expect(money.format("JPY", "236800.00")).toBe("236,800");
            expect(money.format("JPY", "-1000000000.00")).toBe("-1,000,000,000");
            expect(money.format("JPY", "-100000000000.00")).toBe("-100,000,000,000");
        });

        it("works for EUR", function () {
            expect(money.format("EUR", "560.00")).toBe("560,00");
            expect(money.format("EUR", "-1560.00")).toBe("-1.560,00");
            expect(money.format("EUR", "-100000000000.00")).toBe("-100.000.000.000,00");
        });
    });

    describe("money.add()", function () {
        it("sums positive decimals 1", function () {
            expect(money.add("16.11", "17.07")).toBe("33.18");
        });

        it("sums positive decimals 2", function () {
            expect(money.add("65535.79", "1024.85")).toBe("66560.64");
        });

        it("sums positive decimals 3", function () {
            expect(money.add("1.99", "0.02")).toBe("2.01");
        });

        it("sums positive decimals 4", function () {
            expect(money.add("1.90", "0.10")).toBe("2.00");
        });

        it("sums positive decimals 5", function () {
            expect(money.add("1.09", "0.01")).toBe("1.10");
        });

        it("sums two zeroes", function () {
            expect(money.add("0.00", "0.00")).toBe("0.00");
        });

        it("sums negative decimals", function () {
            expect(money.add("-1.99", "-0.02")).toBe("-2.01");
        });

        it("sums mixed decimals 1", function () {
            expect(money.add("-1.99", "1.99")).toBe("0.00");
        });

        it("sums mixed decimals 2", function () {
            expect(money.add("-1.99", "0.98")).toBe("-1.01");
        });

        it("chain-sums decimals", function () {
            expect(
                money.add("194.00", money.add("23.30", money.add("210.00", "355.00")))
            ).toBe("782.30");
        });

        it("is commutative", function () {
            expect(money.add("194.00", "23.30")).toBe(money.add("23.30", "194.00"));
        });

        it("works on huge number", function () {
            expect(
                money.add(
                    "99999999999999999999999999999999999999999999999999999999999999999999999999999999.99",
                    "0.01"
                )
            ).toBe("100000000000000000000000000000000000000000000000000000000000000000000000000000000.00");
        });
    });

    describe("money.subtract()", function () {
        it("calculates difference 1", function () {
            expect(
                money.subtract("700000000000000000000.00", "700000000000000000000.00")
            ).toBe("0.00");
        });

        it("calculates difference 2", function () {
            expect(money.subtract("-10.00", "5.00")).toBe("-15.00");
        });
    });

    describe("money.mul()", function () {
        it("multiplies two decimals 1", function () {
            expect(money.mul("-2.00", "2.00")).toBe("-4.00");
        });

        it("multiplies two decimals 2", function () {
            expect(money.mul("24.00", "0.25")).toBe("6.00");
        });
    });

    describe("money.div()", function () {
        it("basically works", function () {
            expect(money.div("64.00", "2.00")).toBe("32.00");
        });

        it("rounds stuff up 1", function () {
            expect(money.div("1.00", "3.00")).toBe("0.33");
        });

        it("rounds stuff up 2", function () {
            expect(money.div("0.50", "3.00")).toBe("0.17");
        });

        it("works for negative dividend, with rounding up", function () {
            expect(money.div("-1.00", "3.00")).toBe("-0.33");
        });
    });

    describe("money.percent()", function () {
        it("calcualtes the [2nd argument] percent of the [1st argument] 1", function () {
            expect(money.percent("100.00", "7.45")).toBe("7.45");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 2", function () {
            expect(money.percent("100.00", "0.01")).toBe("0.01");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 3", function () {
            expect(money.percent("100.00", "110.00")).toBe("110.00");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 4", function () {
            expect(money.percent("-200.00", "3.25")).toBe("-6.50");
        });

        it("calcualtes the [2nd argument] percent of the [1st argument] 5", function () {
            expect(money.percent("0.50", "33.00")).toBe("0.17");
        });
    });

    describe("money.floatToAmount()", function () {
        it("it converts a float with 2-digit fractional part to string", function () {
            expect(money.floatToAmount(11.12)).toBe("11.12");
        });

        it("it appends '.00' to a whole number", function () {
            expect(money.floatToAmount(56)).toBe("56.00");
        });

        it("it appends '.0' to a number with 1-digit fraction", function () {
            expect(money.floatToAmount(56.3)).toBe("56.30");
        });

        it("rounds up a long-fraction number A", function () {
            expect(money.floatToAmount(56.3411111)).toBe("56.34");
        });

        it("rounds up a long-fraction number B", function () {
            expect(money.floatToAmount(56.345)).toBe("56.35");
        });

        it("rounds up a long-fraction number C", function () {
            expect(money.floatToAmount(0.3499)).toBe("0.35");
        });

        it("rounds up a long-fraction number D", function () {
            expect(money.floatToAmount(-0.345)).toBe("-0.34");
        });

        it("rounds up a long-fraction number E", function () {
            expect(money.floatToAmount(-0.346)).toBe("-0.35");
        });
    });

    describe("money.roundUpTo5Cents()", function () {
        it("is identical for zero", function () {
            expect(money.roundUpTo5Cents("0.00")).toBe("0.00");
        });

        it("rounds 02 to 05", function () {
            expect(money.roundUpTo5Cents("1.02")).toBe("1.05");
        });

        it("rounds 06 to 10", function () {
            expect(money.roundUpTo5Cents("156.06")).toBe("156.10");
        });
    });
}());
