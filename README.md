# What does it do?

Adds, multiplies the currency _amounts,_ and calculates percentages of _amounts._ The result of
each of those operations is also an _amount_: a string, strictly matching the `/^\-?\d+\.\d\d$/`
pattern, like "0.25", "1000.00", or "-42.10".

_Amounts_ on input and output are arbitrary large and precise:

    99999999999999999999999999999999999999999999999999999999999999999999999999999999.99
    +
    0.01
    =
    100000000000000000000000000000000000000000000000000000000000000000000000000000000.00

However, in cases when the division is involved — like for percentage calculation — the result is
rounded to the whole cent.

    money.percent("0.50", "33.00")  // is "0.17" instead of "0.165"

As a bonus feature, there's a simple formatting function for _amounts_ in CHF, EUR, USD, GBP, and
JPY.

    money.format("EUR", "-1560.00") // "-1.560,00"

# Why does it exist?

Because storing currency amounts in floats [is a really bad idea](http://stackoverflow.com/questions/3730019/why-not-use-double-or-float-to-represent-currency)

# How to use it?

    $ npm install money-math

And then

    var money = require("money-math");

    money.add("16.11", "17.07");        // "33.18"
    money.mul("24.00", "0.25");         // "6.00"
    money.percent("200.00", "3.25");    // "6.50"

    money.format("JPY", "236800.00");   // "236,800"
    money.floatToAmount(56.345);        // "56.35"
