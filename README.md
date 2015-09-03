[![Build Status](https://travis-ci.org/ikr/money-math.svg?branch=master)](https://travis-ci.org/ikr/money-math)

# What does it do?

Adds, multiplies the currency _amounts,_ and calculates percentages of _amounts._ The result of
each of those operations is also an _amount:_ a string, strictly matching the `/^\-?\d+\.\d\d$/`
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

Works both on Node and in the browser.

    $ npm install --save money-math

Then

    var money = require("money-math");

    money.add("16.11", "17.07");        // "33.18"
    money.subtract("16.00", "7.00");    // "9.00"
    money.mul("24.00", "0.25");         // "6.00"
    money.div("64.00", "2.00");         // "32.00"
    money.percent("200.00", "3.25");    // "6.50"

    money.format("JPY", "236800.00");   // "236,800"
    money.floatToAmount(56.345);        // "56.35"

And last, but not least :)

    money.roundUpTo5Cents("42.02");     // "42.05"
    money.roundTo5Cents("442.26");      // "442.25"

Which we use for bills in CHF that are required by law to be 0 (mod 5).

# An important note on the amount "data type"

The _amount_ strings are expected to strictly adhere to the format described by the regular
expression noted [above](#what-does-it-do). Thus, for example, it must be:

* `"10.10"`, not `"10.1"`, not `"10.100"`;
* `"10.00"`, not `10`, not `"10"`, not `"10.0"`.

That's a precondition for any of the API functions accepting _amount_ arguments to work correctly. I
understand that it may be confusing to some of new users; but I believe that's an optimally
pragmatic way to mimic, by convention, an algebraic data type in idiomatic JavaScript -- a (very)
dynamically typed language.

Luckily, you can always move your arbitrary float value into the _amounts field_ with
`money.floatToAmount(...)`. Once all the values are _amounts,_ money-math guarantees that all the
_field_ operations keep the results withing the _field._ Classic algebra.
