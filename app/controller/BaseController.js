'use strict'

class APIController {
    constructor(child, model) {
        this.bindingMethods = this.bindingMethods.bind(this);
        this.bindingMethods(child);
        this.model = model;
    }

    bindingMethods(obj) {
        let methods = Object.getOwnPropertyNames(obj.prototype);
        methods = methods.filter(x => x !== 'constructor');
        for (let method of methods) {
            this[method] = this[method].bind(this);
        }
    }
}

module.exports = APIController;