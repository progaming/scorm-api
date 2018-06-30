import Scorm from './index';    

let scorm = new Scorm(data => {console.log(data)});
let errorCode = "0";
let errorString = "";

// example of http response
const resp = [{"element": "cmi.suspend_data","value":"Hi"}];

scorm.init(scorm.parse(resp));
scorm.LMSInitialize();
scorm.LMSSetValue('cmi', 'test');
errorCode = scorm.LMSGetLastError();
errorString = scorm.LMSGetErrorString(errorCode);

scorm.LMSSetValue('cmi.suspend_data', 'Hello world');
scorm.LMSSetValue('cmi.core.score.raw', 80);
scorm.LMSSetValue('cmi.core.score.max', 100);
scorm.LMSSetValue('cmi.core.score.min', 0);
scorm.LMSSetValue('cmi.interaction.0.count', 1);

let suspend = scorm.LMSGetValue('cmi.suspend_data');
let raw = scorm.LMSGetValue('cmi.core.score.raw');
let pass = scorm.LMSGetValue('cmi.core.score.pass');
errorCode = scorm.LMSGetLastError();
errorString = scorm.LMSGetErrorString(errorCode);

scorm.LMSCommit();
scorm.LMSFinish();