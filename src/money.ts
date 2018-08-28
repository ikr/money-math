import { BigInteger } from 'jsbn';

function separateThousands(inStr: string, withStr: string) {
	let sign = '';
	let src = inStr;
	let ret = '';
	let appendix;

	if (inStr[0] === '-') {
		sign = '-';
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
}

function integerValue(amount: string) {
	return (/^(\-?\d+)\.\d\d$/).exec(amount)[1];
}

function isString(obj: any) {
	return Object.prototype.toString.call(obj) === '[object String]';
}

function round(amount: string) {
	const fraction = parseInt(amount.substr(-2), 10);
	const wholeAmount = integerValue(amount) + '.00';

	return (
		fraction < 50 ?
			wholeAmount :
			add(wholeAmount, '1.00')
	);
}

export function amountToCents(amount: string) {
	return amount.replace('.', '');
}

export function centsToAmount(cents: string) {
	if (!isString(cents)) {
		return undefined;
	}

	const sign = (cents[0] === '-' ? '-' : '');
	let abs = (sign === '-' ? cents.substr(1) : cents);

	while (abs.length < 3) {
		abs = ['0', abs].join('');
	}

	return sign + abs.substr(0, abs.length - 2) + '.' + abs.substr(-2);
}

export function floatToAmount(f: number) {
	return ('' + (Math.round(f * 100.0) / 100.0))
		.replace(/^-(\d+)$/, '-$1.00')              // -xx
		.replace(/^(\d+)$/, '$1.00')                // xx
		.replace(/^-(\d+)\.(\d)$/, '-$1.$20')       // -xx.xx
		.replace(/^(\d+)\.(\d)$/, '$1.$20');        // xx.xx
}

export function integralPart(amount: string) {
	return integerValue(amount);
}

export function format(currency: 'CHF' | 'CNY' | 'EUR' | 'GBP' | 'JPY' | 'LTL' | 'PLN' | 'SEK' | 'SKK' | 'UAH' | 'USD' | string, amount: string) {
	switch (currency) {
		case 'JPY':
			return separateThousands(integerValue(amount), ',');

		case 'EUR':
		case 'GBP':
			return separateThousands(integerValue(amount), '.') + ',' + amount.substr(-2);

		case 'CHF':
		case 'USD':
			return separateThousands(integerValue(amount), ',') + '.' + amount.substr(-2);

		case 'SEK':
		case 'LTL':
		case 'PLN':
		case 'SKK':
		case 'UAH':
			return separateThousands(integerValue(amount), ' ') + ',' + amount.substr(-2);

		default:
			return amount;
	}
}

export function add(a: string, b: string) {
	return centsToAmount(
		new BigInteger(
			amountToCents(a)
		).add(
			new BigInteger(amountToCents(b))
		).toString()
	);
}

export function subtract(a: string, b: string) {
	return centsToAmount(
		new BigInteger(
			amountToCents(a)
		).subtract(
			new BigInteger(amountToCents(b))
		).toString()
	);
}

export function mul(a: string, b: string) {
	const hundredthsOfCents = new BigInteger(
		amountToCents(a)
	).multiply(
		new BigInteger(amountToCents(b))
	);

	const remainder = parseInt(hundredthsOfCents.toString().substr(-2), 10);

	return centsToAmount(
		hundredthsOfCents.divide(
			new BigInteger('100')
		).add(
			new BigInteger(remainder >= 50 ? '1' : '0')
		).toString()
	);
}

export function div(a: string, b: string) {
	const hundredthsOfCents = new BigInteger(
		amountToCents(a)
	).multiply(
		new BigInteger('10000')
	).divide(
		new BigInteger(amountToCents(b))
	);

	const remainder = parseInt(hundredthsOfCents.toString().substr(-2), 10);

	return centsToAmount(
		hundredthsOfCents.divide(
			new BigInteger('100')
		).add(
			new BigInteger(remainder >= 50 ? '1' : '0')
		).toString()
	);
}

export function percent(value: string, percnt: string) {
	const p = new BigInteger(
		amountToCents(value)
	).multiply(
		new BigInteger(amountToCents(percnt))
	);

	const q = p.divide(new BigInteger('10000'));
	const r = p.mod(new BigInteger('10000'));

	return centsToAmount(
		(r.compareTo(new BigInteger('4999')) > 0 ? q.add(new BigInteger('1')) : q).toString()
	);
}

export function roundUpTo5Cents(amount: string) {
	const lastDigit = parseInt(amount.substr(-1), 10);
	let additon = '0.00';

	if ((lastDigit % 5) !== 0) {
		additon = '0.0' + (5 - (lastDigit % 5));
	}

	return add(amount, additon);
}

export function roundTo5Cents(amount: string) {
	return div(
		round(mul(amount, '20.00')),
		'20.00'
	);
}

export function cmp(a: string, b: string) {
	return new BigInteger(a.replace('.', '')).compareTo(new BigInteger(b.replace('.', '')));
}

export function isEqual(a: string, b: string) {
	return cmp(a, b) === 0;
}

export function isZero(a: string) {
	return isEqual(a, '0.00');
}

export function isNegative(a: string) {
	return cmp(a, '0.00') < 0;
}

export function isPositive(a: string) {
	return cmp(a, '0.00') > 0;
}
