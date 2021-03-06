/**
 * @module utility
 */
// eslint-disable-next-line
export function noop() { }

/**
 * Returns the value
 *
 * @exports
 * @param {*} val any value
 * @returns {*} the exat same value
 */
export function identity(val) { return val; }

/**
 * Converts an attribute string value to boolean
 *
 * @exports
 * @param {string} val attribute value
 * @returns {boolean} boolean interpretation of attribute
 */
export function attr2bool(val) { return val !== null; }

/**
 * Converts a boolean value to a boolean attribute value
 *
 * @exports
 * @param {boolean} val a boolean
 * @returns {(string | null)} empty strign if attribute should exist, else null
 */
export function bool2attr(val) { return val ? '' : null; }

/**
 * Wrapper around Object.is
 *
 * @exports
 * @param {*} oldValue old value
 * @param {*} newValue new value
 * @returns {boolean} true if old and new are NOT the same value
 */
export function isDifferent(oldValue, newValue) { return !Object.is(oldValue, newValue); }

export const debounce = (func, wait, immediate = false) => {
	if (typeof func !== 'function') { throw new TypeError('Expected a function'); }

	let timeout;

	return function debounced(...args) {
		const later = () => {
			timeout = null;
			if (!immediate) { func.apply(this, args); }
		};

		const callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) { func.apply(this, args); }
	};
};

export const throttle = (func, wait, immediate = false) => {
	if (typeof func !== 'function') { throw new TypeError('Expected a function'); }

	let timeout;

	return function throttled(...args) {
		const later = () => {
			timeout = null;
			if (!immediate) { func.apply(this, args); }
		};
		const callNow = immediate && !timeout;

		if (!timeout) { timeout = setTimeout(later, wait); }
		if (callNow) { func.apply(this, args); }
	};
};

export const rAFthrottle = (func, immediate = false) => {
	if (typeof func !== 'function') { throw new TypeError('Expected a function'); }

	let rAFid;

	return function throttled(...args) {
		const later = () => {
			rAFid = null;
			if (!immediate) { func.apply(this, args); }
		};
		const callNow = immediate && !rAFid;

		if (!rAFid) { rAFid = requestAnimationFrame(later); }
		if (callNow) { func.apply(this, args); }
	};
};

/**
 * PropertyDeclaration
 *
 * @typedef PropertyDeclaration
 * @type {object}
 * @property {boolean} [observe] Flag indicating that this property will be monitored for changes
 * @property {boolean} [reflect] Flag indicatin that this property will be reflected as attribute
 * @property {Function} [prop2attr] Converts the property to an attribute
 * @property {Function} [attr2prop] Converts the attribute to a property
 * @property {Function} [modified] Tells if the value was modified
 */
/**
 * @exports
 * @type {PropertyDeclaration}
 * @property {boolean} [observe=true]
 * @property {boolean} [reflect=false]
 * @property {Function} [prop2attr=identity]
 * @property {Function} [attr2prop=identity]
 * @property {Function} [modified=isDifferent]
 */
export const defaultPropertyDeclaration = {
	observe: true
	, reflect: false
	, prop2attr: identity
	, attr2prop: identity
	, modified: isDifferent
};
