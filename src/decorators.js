/**
 * @module decorators
 */
/**
 * Class decorator to define a custom element
 *
 * @exports
 * @param {*} name tag name of the custom element
 * @param {*} [options] options parameter that is passed to the define function
 * @returns {Function} the actual decorator
 */
export function defineElement(name, options) {
	return function (classDescriptor) {
		classDescriptor.finisher = function finisher(classConstructor) {
			customElements.define(name, classConstructor, options);
		};
		return classDescriptor;
	};
}

/**
 * Property decorator that augments the property with accessors and asignes some lifecycle options
 *
 * @exports
 * @param {module:utility.PropertyDeclaration} propertyDeclaration lifecycle options
 * @returns {Function} the actual decorator
 */
export function property(propertyDeclaration) {
	// TC39 descriptor. see https://github.com/tc39/proposal-decorators/blob/master/NEXTBUILTINS.md
	return function (propertyDescriptor) {

		// If the decorator is invoked on an field property it generates accessors with that name
		// and a somewhat hidden storage property.
		// The accessors are necessary to react on property changes with an render update.
		if (propertyDescriptor.kind === 'field') {
			const propertyKey = `__${propertyDescriptor.key}`;
			propertyDescriptor.extras = [
				{
					key: propertyKey
					, kind: propertyDescriptor.kind
					, placement: propertyDescriptor.placement
					, initializer: propertyDescriptor.initializer
					, descriptor: {
						configurable: true
						, enumerable: true
						, writable: true
					}
				}
			];

			propertyDescriptor.kind = 'method';
			propertyDescriptor.placement = 'prototype';
			delete propertyDescriptor.initializer;
			propertyDescriptor.descriptor = {
				get() { return this[propertyKey]; }
				, set(val) {
					const oldVal = this[propertyKey];
					this[propertyKey] = val;
					this.requestUpdate(propertyDescriptor.key, oldVal, val);
				}
				, configurable: true
				, enumerable: true
			};
		}
		propertyDescriptor.finisher = function finisher(classConstructor) {
			classConstructor.addClassProperty(propertyDescriptor.key, propertyDeclaration);
		};
		return propertyDescriptor;
	};
}
