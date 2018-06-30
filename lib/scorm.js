import axios from 'axios';

class Scorm {
    constructor(commitHandler) {
        this.cmi = {};
        this.errorCode = "0";
        this.commitHandler = commitHandler;
    }

    LMSInitialize = () => {
        this.errorCode = "0";
        return "true";
    }

    LMSFinish = () => {
        this.errorCode = "0";
        return "true";
    }

    LMSGetValue = (element) => {
        this.errorCode = "0";

        const baseObject = this.getBase(element);
        const lastChild = element.split('.').pop();
        const value = baseObject[lastChild];

        return value ? value : '';
    }

    LMSSetValue = (element, value) => {
        this.errorCode = "0";

        // setting the root element is not allowed
        if (element.split('.').length < 2) {
            this.errorCode = "201";
            return "false";
        }

        const baseObject = this.getBase(element);
        const lastChild = element.split('.').pop();
        baseObject[lastChild] = value;

        return "true";
    }

    LMSCommit = () => {
        this.commitHandler(JSON.stringify(this.flatten({ cmi: this.cmi })));
    }

    LMSGetLastError = () => {
        return this.errorCode;
    }

    LMSGetErrorString = (param) => {
        if (param !== "") {
            var errorString = [];
            errorString["0"] = "No error";
            errorString["101"] = "General exception";
            errorString["201"] = "Invalid argument error";
            errorString["202"] = "Element cannot have children";
            errorString["203"] = "Element not an array - cannot have count";
            errorString["301"] = "Not initialized";
            errorString["401"] = "Not implemented error";
            errorString["402"] = "Invalid set value, element is a keyword";
            errorString["403"] = "Element is read only";
            errorString["404"] = "Element is write only";
            errorString["405"] = "Incorrect data type";
            return errorString[param];
        } else {
            return "";
        }
    }

    LMSGetDiagnostic = () => {
        return "";
    }

    setup = (data) => {
        data.forEach(entry => {
            this.LMSSetValue(entry.element, entry.value);
        });
    }

    // this returns non-null base object of the path given
    // e.g. cmi.core.score.raw -> non-null cmi.core.score
    getBase = (element) => {
        let nodes = element.split('.');
        // to get base, remove the last element
        nodes.pop();

        // make sure the return object is non-null
        return nodes.reduce((obj, key) => {
            obj[key] = obj[key] || {};
            return obj[key];
        }, this);
    }

    flatten = (o) => {
        var toReturn = {};

        for (var i in o) {
            if (!o.hasOwnProperty(i)) continue;

            if ((typeof o[i]) == 'object') {
                var flatObject = flattenObject(o[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;

                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = o[i];
            }
        }
        return toReturn;
    };
}

export default Scorm;