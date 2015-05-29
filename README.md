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

Which we use for bills in CHF that are required by law to be 0 (mod 5).

# License (MIT)

Copyright (c) 2012-2015 Ivan Krechetov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
