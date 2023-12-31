import { Portal } from "@angular/cdk/portal";

export interface Post {
  [x: string]: any;
    children: any;
    label: any;
	screenshot: any;
	video: any;
	time: any;
	statusId: any;
	severityId: any;
	releaseId: any;
	qaContact: any;
	priorityId: any;
	osId: any;
	deviceId: any;
	date: any;
	browserVersion: any;
	browserName: any;
	assignedTo: any;
	featureId: any;
	defectId: any;
	description: any;
	summary(summary: any);
	inputType: any;
	datatype: any;
	Email: any;
	password: any;
	image: any;
	startingTime: any;
	ToTime: any;
	returnValue: any;
	inputField2: any;
	inputField3: any;
	object: any;
	moduleName: any;
	moduleChild: any[];
	unitedFM: any[];
	moduleId: number;
	testScriptsData: any;
	version: any[];
	actionList: any;
	matchingMethodName: any;
	allActitons: any;
	compeleteArray: any;
	featureNames: any[];
	objectName: any[];
	length: number;
	ProjectSelection: string;
	indexvalue: any[];
	scriptId: any;
	typeScenario: string;
	priorityScenario: string;
	types: any;
	actions: any;
	testNgKey: any;
	objectCreation: any;
	reuseableClass: any;
	reuseableParams: any;
	scriptVariableArray: any;
	status: any;
	ip;
	port;
	nModified;

}