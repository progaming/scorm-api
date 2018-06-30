import {errorString} from './config';

class Scorm {
    constructor(commitHandler) {
        this.cmi = {};
        this.errorCode = '0';
        this.commitHandler = commitHandler;
    }

    LMSInitialize = () => {
        this.errorCode = '0';
        return 'true';
    }

    LMSFinish = () => {
        this.errorCode = '0';
        return 'true';
    }

    LMSGetValue = (element) => {
        this.errorCode = '0';

        const baseObject = this.getBase(element);
        const lastChild = element.split('.').pop();
        const value = baseObject[lastChild];

        return value ? value : '';
    }

    LMSSetValue = (element, value) => {
        this.errorCode = '0';

        // setting the root element is not allowed
        if (element.split('.').length < 2) {
            this.errorCode = '201';
            return 'false';
        }

        const baseObject = this.getBase(element);
        const lastNode = element.split('.').pop();
        baseObject[lastNode] = value;

        return "true";
    }

    LMSCommit = () => {
        this.commitHandler(JSON.stringify(this.flatten({ cmi: this.cmi })));
    }

    LMSGetLastError = () => {
        return this.errorCode;
    }

    LMSGetErrorString = (param) => {
        return param !== '' ? errorString[param] : '';
    }

    LMSGetDiagnostic = () => {
        return '';
    }

    init = (cmi) => {
        this.cmi = cmi;
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
        let toReturn = {};

        for (let i in o) {
            if (!o.hasOwnProperty(i)) continue;

            if ((typeof o[i]) == 'object') {
                let flatObject = this.flatten(o[i]);
                for (let x in flatObject) {
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