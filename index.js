import Scorm from './lib/scorm';    

let scorm = new Scorm(data => {console.log(data)});
let errorCode = "0";
let errorString = "";

scorm.setup(JSON.parse('[{"element": "cmi.suspend_data","value":"Hello world"},{"element":"cmi.core.score.raw","value":50}]'));
scorm.LMSInitialize();
scorm.LMSSetValue('cmi', 'test');
errorCode = scorm.LMSGetLastError();
errorString = scorm.LMSGetErrorString(errorCode);

scorm.LMSSetValue('cmi.suspend_data', 'Hello world');
scorm.LMSSetValue('cmi.core.score.raw', 50);
scorm.LMSSetValue('cmi.core.score.max', 100);
scorm.LMSSetValue('cmi.core.score.min', 0);
scorm.LMSSetValue('cmi.interaction.0.count', 1);

let suspend = scorm.LMSGetValue('cmi.suspend_data');
let raw = scorm.LMSGetValue('cmi.core.score.raw');
let pass = scorm.LMSGetValue('cmi.core.score.pass');
errorCode = scorm.LMSGetLastError();

scorm.LMSCommit();
scorm.LMSFinish();