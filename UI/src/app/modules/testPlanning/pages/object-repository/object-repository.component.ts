import { Component, OnInit } from '@angular/core';
import { ObjectServiceComponent } from '../../../../core/services/object.service';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { Post } from '../../../../post';
import 'rxjs/add/operator/map';
import { roleService } from '../../../../core/services/roleService';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { ObjrepoService } from '../../../../core/services/objrepo.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../../../core/services/dialog.service';


@Component({
	selector: 'app-object-repository',
	templateUrl: './object-repository.component.html',
	styleUrls: ['./object-repository.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
	providers: [DecoratorService, roleService, ObjectServiceComponent, ProjectDetailServiceComponent, apiServiceComponent, ObjrepoService]

})
export class ObjectRepositoryComponent implements OnInit {
	pageName = [];
	clearMenu: boolean = false;
	displayObjectName: string;
	hideData: any;
	dd: any;
	pageNamemodel: string;
	image: string;
	clearHtml: boolean;
	displayPageName = [];
	hiddenImage: string;
	projectName: string;
	projectNameData = [];
	projectId: string;
	styleObjectName: string;
	activeObject: any;
	openPerticularPage: boolean;
	openPage: string;
	showObjects: boolean;
	treeObject = [];
	ind: number;
	a: boolean = true;
	everyTime: any;
	selectedItem: number;
	openObjMenu = false;
	clickedObjectName: string;
	displayPage: boolean;
	updatePage = false;
	locators: any;
	tableData = [];
	seletedRow: number;
	deleteData = [];
	name: string;
	value: string;
	url: string;
	objectName: string;
	selectedPageName: string;
	displayNewObject = [];
	hideObjectData: any;
	openObjectName: string;
	splitData: string;
	clickObject: any;
	clearObject: any;
	tableRow = [
		{
			locators: "relXpath",
			value: "",
		},
		{
			locators: "AbsXpath",
			value: "",
		},
		{
			locators: "CssSelector",
			value: "",
		},
		{
			locators: "linkText",
			value: "",
		},
		{
			locators: "partialLinkText",
			value: "",
		}

	];
	updateObjectButton = false;
	displayObject: boolean;
	activePage: string;
	locatorsDetails: any;
	pageNameNew: any;
	displayNewObjectt = [];
	newRole: any;
	createobt: boolean;
	updateobt: boolean;
	isChecked: boolean;
	pageRoles: Object = {};
	page: Object = {
		projectId: "",
		pageName: '',
		image: ""
	};
	attributeArr = [
		{
			locators: "tagName",
			value: "",
			locatorsDisplay: "TagName"
		},
		{
			locators: "text",
			value: "",
			locatorsDisplay: "Text"
		},
		{
			locators: "id",
			value: "",
			locatorsDisplay: "Id"
		},
		{
			locators: "name",
			value: "",
			locatorsDisplay: "Name"
		},
		{
			locators: "className",
			value: "",
			locatorsDisplay: "Class Name"
		}
	];

	displayCreateObject: boolean;
	search: boolean;
	displaySelectedPage = false;
	sPage;
	displayEditPage: boolean;
	displayObjects = [];

	objName: string;
	selectedKey: string;
	selectedValue: string;
	previousObjName: any;
	selectRadio: any;
	createSelectRadio: any;
	filesToUpload: Array<File>;
	angForm: FormGroup;
	UpdateForm: FormGroup;
	ObjNameValidate: FormGroup;
	editupdateName: any;
	objNameCreate: any;
	objType: any;
	objSeq: any;
	objTy = ['Textarea', 'Button', 'Checkbox', 'Label', 'RadioButton', 'Link', 'Image', 'Frame', 'List Of WebElements', 'DropDown']
	objectType;
	objectSeq;
	savedObjInfo;//this variable is being used in checking object name duplication and sequence uniqueness
	savedPomInfo;//this variable contains all page and its object info 
	previousObjSeq: any;

	constructor(private dialogService: DialogService, private fb: FormBuilder, private sendObject: ObjectServiceComponent, private data: ProjectDetailServiceComponent, private api: apiServiceComponent, private roles: roleService,
		private objrep: ObjrepoService, private decoratorServiceKey: DecoratorService) { }

	ngOnInit() {


		this.pageNameNew = "ObjectRepository"
		this.newRole = sessionStorage.getItem('newRoleName');
		this.pageRoles = {
			pageName: this.pageNameNew,
			roleName: this.newRole
		}
		this.createForm();
		this.getRolesPermissions(this.pageRoles);
		let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');//projectname is coming from here
		this.projectName = dataFromProjectSelectionDropdown;
		this.data.projectId(this.projectName).subscribe(project => {
			this.projectNameData = project;
			this.projectId = this.projectNameData[0].projectId;
			this.repository();
		});

		this.savedObjInfo = [];

	}

	///////////////////////////////New MVC Code Starts Here/////////////////////////////

	createForm() {
		this.angForm = this.fb.group({
			'pageName': ['', [Validators.required, ValidationserviceService.objrepoCreatePage, Validators.minLength(1),
			Validators.maxLength(20)]]
		});

		this.UpdateForm = this.fb.group({
			'editupdateName': ['', [Validators.required, ValidationserviceService.objrepoCreatePage, Validators.minLength(1),
			Validators.maxLength(20)]]
		});

		this.ObjNameValidate = this.fb.group({
			'objNameCreate': ['', [Validators.required, ValidationserviceService.objrepoCreatePage, Validators.minLength(1),
			Validators.maxLength(20)]],
			'objType': ['', [Validators.required]],
			'objSeq': ['', [Validators.required]]
		});

	}

	permissions = [];
	edit: boolean;
	read: boolean;
	delete: boolean;
	create: boolean;
	disableButton: boolean;
	getRolesPermissions(pageRoles) {
		this.roles.getPermissions(pageRoles).subscribe(
			Data => {
				this.permissions = Data;
				this.edit = this.permissions[0].edit;
				this.read = this.permissions[0].read;
				this.delete = this.permissions[0].delete;
				this.create = this.permissions[0].create;
				this.disableButton = this.permissions[0].disableButton;
			})
	}

	landCreatePage() {
		this.clearMenu = false;
		this.openObjMenu = false;
		this.displayEditPage = false;
		this.displayPage = true;
		this.displayObject = false;
		this.pageNamemodel = '';
		this.image = '';
		this.search = false;
		this.displaySelectedPage = false;
	}

	selectedPageOpen(page) {
		if (this.impMultiObjUI) {
			this.dialogService.openConfirmDialog('Are you sure you dont want to save any objects?')
				.afterClosed().subscribe(res => {
					if (res) {
						this.impMultiObjUI = false;
						this.displayObjTableUI = true;
						this.displayPage = false;
						this.displaySelectedPage = true;
						this.displayEditPage = false;
						this.sPage = page
						this.selectedPage(page)
					}
				})
		}
		else {
			this.displayObjTableUI = true;
			this.displayPage = false;
			this.displaySelectedPage = true;
			this.displayEditPage = false;
			this.sPage = page
			this.selectedPage(page)
		}

	}

	selectedPage(page) {
		this.displayPage = false;
		this.displaySelectedPage = true;
		this.displayEditPage = false;
		this.impCampareUI = false;
		this.campareUI = false;
		this.sPage = page;

		let parameters = {
			'projectId': this.projectId,
			'pageName': page
		}
		this.objrep.getPageDetails(parameters).subscribe(res => {
			this.displayObjects = res[0].objectName;
			if (res[0].objectName === undefined) {//when object is created for the first time, res[0].objectName will be undefined
				this.savedObjInfo = [];
			} else {
				this.savedObjInfo = res[0].objectName
			}
		});
	}

	editPage1(PageNameToEdit) {
		this.displayPage = false;
		this.displayEditPage = true;
		this.displaySelectedPage = false;
		this.objrep.getPageDetails({ 'pageName': PageNameToEdit, 'projectId': this.projectId }).subscribe((data) => {
			this.page['pageName'] = data[0].pageName;
			this.page['image'] = data[0].image;
			this.upObj['oldName'] = data[0].pageName;
			this.editupdateName = PageNameToEdit;
		});
	}

	upObj = {};
	updatePageDetail() {
		this.upObj['projectId'] = this.projectId;
		this.upObj['pageId'] = '1';
		this.upObj['pageName'] = this.UpdateForm.value.editupdateName
		this.upObj['image'] = this.page['image'];
		if (this.objrep.checkingDuplicatePageWhileUpdating(this.savedPomInfo, this.upObj)) {
			this.objrep.updatePageDetail(this.upObj).subscribe((data) => {
				this.decoratorServiceKey.update_Snackbar('Updated Successfully', '', 'update-snackbar');//by shivakumar
				this.repository();
				this.displayEditPage = false;
			});
		} else {
			alert('Duplicate Page name not Allowed')
		}
		this.page['pageName'] = '';
		this.page['image'] = '';
	}

	deletePage1(deletePagee) {
		// check if Page contains objects 
		this.objrep.checkIfPageContainsObj({ 'projectId': this.projectId, 'pageName': deletePagee }).subscribe((result) => {
			if (result['status']) {
				this.objrep.deleteConfirm('Are you sure to delete  ?')
					.afterClosed().subscribe(res => {
						if (res) {
							this.objrep.deletePage({ 'projectId': this.projectId, 'pageName': deletePagee }).subscribe((data) => {
								this.displaySelectedPage = false;
								this.repository();
							})
						}
					})
			} else {
				this.objrep.warningMsg("You need to delete Objects of the Page before deleting Page!!!")
					.afterClosed().subscribe(res => { })
			}
		})
	}

	createPageDetails() {
		document.getElementById("btnCreatePage").setAttribute("disabled", "disabled");//to avoid user from double clicking create button,we are disabling it after single click
		this.page['projectId'] = this.projectId;
		this.page['pageId'] = '1';
		this.page['pageName'] = this.angForm.value.pageName;
		this.objrep.duplicatePage(this.page).subscribe((data) => {
			if (data && data instanceof Array && !data.length) //to check object is empty or not
			{
				this.objrep.methodCreate(this.page)
					.subscribe((data) => {
						this.repository();
						this.cancelCS();
					})
			} else {
				this.dialogService.openAlert("Page Already exists with same name,Please change Page name");
			}
		})
	}

	clearPageName;//only used to clear Page name field

	cancelCS() {
		this.displayPage = false;
		this.search = false;
		this.displayEditPage = false;
		this.tableRow[0]['value'] = '';
		this.tableRow[1]['value'] = '';
		this.tableRow[2]['value'] = '';
		this.tableRow[3]['value'] = '';
		this.tableRow[4]['value'] = '';
		this.attributeArr[0]['value'] = '';
		this.attributeArr[1]['value'] = '';
		this.attributeArr[2]['value'] = '';
		this.attributeArr[3]['value'] = '';
		this.attributeArr[4]['value'] = '';
		this.objName = "";
		this.clearPageName = '';
		this.objectType = '';
		this.objectSeq = '';
		this.page['image'] = '';
		this.page['pageName'] = '';
		this.isChecked = false;
		this.createSelectRadio = "";
		this.createForm(); // This will reset the Forms
		window.removeEventListener("message", this.myFunction);
	}

	dataSource: MatTableDataSource<any>;
	displayedColumns: string[] = ['Sl.No', 'Object Name', 'Selected Type', 'Selected Value', 'delete/Edit'];
	multiObjColumns: string[] = ['Sl.No', 'Object Name', 'Selected Type', 'Selected Value'];
	compareObjColumns: string[] = ['Sl.No', 'Existing Object', 'New Object', 'Matching %', 'Object Status', 'Object Properties Changed'];

	saveData() {
		let result = this.objrep.unique(this.savedObjInfo, this.objName, this.objectSeq);//to check for duplicate object name and sequence 
		if (result['state']) {
			if (result['name']) {
				this.dialogService.openAlert('Object with same name already exits, Please change object name');
			} else {
				this.dialogService.openAlert('Object sequence Should be Unique');
			}
		} else {
			if (this.selectedKey === "") {
				this.dialogService.openAlert("Please select any one selector ");

			}
			else if (this.selectedValue === "") {
				this.dialogService.openAlert("Selector Value cannot be empty");
			}
			else {
				document.getElementById("btnCreate").setAttribute("disabled", "disabled");//to avoid user from double clicking create button,we are disabling it after single click 
				document.getElementById("cancelModal").click();
				let insertObj = {
					"pageName": this.sPage,
					"projectId": this.projectId,
					"objectName": this.objName,
					"objectType": this.objectType,
					"objectSequence": this.objectSeq,
					"attributes": this.attributeArr,
					"xpath": this.tableRow,
					"selectedKey": this.selectedKey,
					"selectedRadio": this.selectedKey,
					"selectedValue": this.selectedValue,
					"exportConfigInfo": this.projectNameData[0].exportConfigInfo
				}
				this.objrep.savePageObject(insertObj).subscribe((data) => {
					let parameters = {
						'projectId': this.projectId,
						'pageName': this.sPage
					}
					this.objrep.getPageDetails(parameters).subscribe(res => {
						this.savedObjInfo = res[0].objectName;
						this.displayObjects = res[0].objectName;
						this.tableRow[0]['value'] = '';
						this.tableRow[1]['value'] = '';
						this.tableRow[2]['value'] = '';
						this.tableRow[3]['value'] = '';
						this.tableRow[4]['value'] = '';
						this.attributeArr[0]['value'] = '';
						this.attributeArr[1]['value'] = '';
						this.attributeArr[2]['value'] = '';
						this.attributeArr[3]['value'] = '';
						this.attributeArr[4]['value'] = '';
						this.selectRadio = "";
						this.createSelectRadio = "";
						this.objName = '';
						this.objectType = ''
						this.objectSeq = ''
						this.isChecked = false;
						this.selectedKey = "";
						this.selectedValue = "";
						this.createForm() // This Will reset the Form
						window.removeEventListener("message", this.myFunction);

					});
				})
			}
		}
	}

	myFunction = (event) => {
		if (event.data.relXpath !== undefined) {
			this.tableRow[0]["value"] = event.data.relXpath;
		}
		if (event.data.AbsXpath !== undefined) {
			this.tableRow[1]["value"] = event.data.AbsXpath;
		}
		if (event.data.CssSelector !== undefined) {
			this.tableRow[2]["value"] = event.data.CssSelector;
		}
		if (event.data.linkText !== undefined) {
			this.tableRow[3]["value"] = event.data.linkText;
		}
		if (event.data.partialLinkText !== undefined) {
			this.tableRow[4]["value"] = event.data.partialLinkText;
		}
		if (event.data.attributes.tagName !== undefined) {
			this.attributeArr[0]["value"] = event.data.attributes.tagName;
		}
		if (event.data.attributes.className !== undefined) {
			this.attributeArr[4]["value"] = event.data.attributes.className;
		}
		if (event.data.attributes.id !== undefined) {
			this.attributeArr[2]["value"] = event.data.attributes.id;
		}
		if (event.data.attributes.name !== undefined) {
			this.attributeArr[3]["value"] = event.data.attributes.name;
		}
		if (event.data.attributes.text !== undefined) {
			this.attributeArr[1]["value"] = event.data.attributes.text;
		}
	}

	onFilterChange(e) {
		if (e.target.checked) {
			let url = e.srcElement.baseURI;
			this.isChecked = true;
			var data = { type: "startExtension", nature: "Single" };
			/**
				The below line will Start the extension and also the starting point of plugin.
				The message sent below will hit "window.addEventListener("message", function(event) {"
				line in inspect1.js file in plugin.
				*/
			window.postMessage(data, url + "projectdetail/testplanning/ObjRepo")

			window.addEventListener("message", this.myFunction);

		} else {
			window.removeEventListener("message", this.myFunction);
		}
	}

	createobjt() {
		this.createobt = true;
		this.tableRow = [
			{
				locators: "relXpath",
				value: "",
			},
			{
				locators: "AbsXpath",
				value: "",
			},
			{
				locators: "CssSelector",
				value: "",
			},
			{
				locators: "linkText",
				value: "",
			},
			{
				locators: "partialLinkText",
				value: "",
			}


		];
		this.attributeArr = [
			{
				locators: "tagName",
				value: "",
				locatorsDisplay: "TagName"
			},
			{
				locators: "text",
				value: "",
				locatorsDisplay: "Text"
			},
			{
				locators: "id",
				value: "",
				locatorsDisplay: "Id"
			},
			{
				locators: "name",
				value: "",
				locatorsDisplay: "Name"
			},
			{
				locators: "className",
				value: "",
				locatorsDisplay: "Class Name"
			}
		]
		this.objName = "";
		this.objectSeq = "";
		this.objectType = "";
		this.selectedKey = "";
		this.selectedValue = "";
	}

	updateObjDetail() {
		let result = this.objrep.checkingUniqueWhileUpdating(this.savedObjInfo, this.objName, this.objectSeq, this.previousObjName, this.previousObjSeq);//to check for duplicate object name and sequence 
		if (result['state']) {
			if (result['name']) {
				this.dialogService.openAlert('Object with same name already exits, Please change object name');
			} else {
				this.dialogService.openAlert('Object sequence Should be Unique');
			}
		}
		else if (this.selectedValue === "") {
			this.dialogService.openAlert("Selector Value cannot be empty");
		}
		else {
			document.getElementById("cancelModal01").click();
			let insertObj = {
				"pageName": this.sPage,
				"projectId": this.projectId,
				"objectName": this.objName,
				"objectType": this.objectType,
				"objectSequence": this.objectSeq,
				"attributes": this.attributeArr,
				"xpath": this.tableRow,
				"selectedKey": this.selectedKey,
				"selectedRadio": this.selectedKey,
				"selectedValue": this.selectedValue,
				"previousObjectName": this.previousObjName,
				"exportConfigInfo": this.projectNameData[0].exportConfigInfo
			}
			this.objrep.updatePageObject(insertObj).subscribe((data) => {
				let parameters = {
					'projectId': this.projectId,
					'pageName': this.sPage
				}
				this.objrep.getPageDetails(parameters).subscribe(res => {
					this.decoratorServiceKey.update_Snackbar('Updated Successfully', '', 'update-snackbar');//by shivakumar
					this.displayObjects = res[0].objectName;
					this.savedObjInfo = res[0].objectName;
					this.tableRow[0]['value'] = '';
					this.tableRow[1]['value'] = '';
					this.tableRow[2]['value'] = '';
					this.tableRow[3]['value'] = '';
					this.tableRow[4]['value'] = '';
					this.attributeArr[0]['value'] = '';
					this.attributeArr[1]['value'] = '';
					this.attributeArr[2]['value'] = '';
					this.attributeArr[3]['value'] = '';
					this.attributeArr[4]['value'] = '';
					this.objName = "";
					this.objectSeq = "";
					this.objectType = "";
					this.selectedKey = "";
					this.selectedValue = "";
					this.selectRadio = "";
				});
			})
		}
	}

	selectedobject(data) {
		this.selectedKey = data.locators;
		this.selectedValue = data.value;
	}

	radiocheck(data) {
		if (this.selectRadio === data.locators || this.selectedKey === data.locators) {
			this.selectedValue = data.value;
		}
	}


	getSelectedObjectDetail(i) {
		let parameters = {
			'projectId': this.projectId,
			'pageName': this.sPage
		}
		this.objrep.getPageDetails(parameters).subscribe(res => {

			this.displayObjects = res[0].objectName;
			this.savedObjInfo = res[0].objectName;
		});
		this.objName = i.objectName;
		this.objectType = i.objectType;
		this.objectSeq = i.objectSequence;
		this.attributeArr = [...i.attributes];//cloning array of objects
		this.tableRow = [...i.xpath];//cloning array of objects
		this.selectedKey = i.selectedRadio;
		this.selectedValue = i.selectedValue;
		this.selectRadio = i.selectedRadio;
		this.previousObjName = i.objectName;
		this.previousObjSeq = i.objectSequence;
	}

	testscrUsingObj;
	reuseUsingObj;
	objNameOfTable
	deleteSelectedObj(i) {
		console.log(i)
		this.objNameOfTable = i
		let parameters = {
			'projectId': this.projectId,
			'pageName': this.sPage,
			'obj': this.objNameOfTable.objectName
		}
		this.objrep.checkIfObjBeingUsedInScripts(parameters).subscribe((data) => {
			if (data["scrLst"].length == 0 && data["reuseLst"].length == 0) {
				this.objrep.deleteConfirm('Are you sure to delete  ?')
					.afterClosed().subscribe(res => {
						if (res) {
							this.objrep.deleteObj(parameters).subscribe((data) => {
								this.objrep.getPageDetails(parameters).subscribe(res => {
									this.displayObjects = res[0].objectName;
									this.savedObjInfo = res[0].objectName;
								});
							})
						}

					})
			} else {
				this.testscrUsingObj = Array.from(new Set(data["scrLst"]));
				this.reuseUsingObj = Array.from(new Set(data["reuseLst"]));
				document.getElementById("delWarnModal").click();
			}
		})
	}

	/////////////////////////////Multi object Capture code starts from here///////////////////////////////////// 

	Tags = ["TextField", "RadioButton", "CheckBox", "Button", "DropDown", "Image", "Link"];
	url1;
	capturedInfoFromPlugin;
	@ViewChildren("multiObjCheckBox") multiObjCheckBox: QueryList<ElementRef>;
	@ViewChildren("selectCheckBox") selectCheckBox: QueryList<ElementRef>;


	checkedbox(e) {
		let val = true;
		this.multiObjCheckBox.forEach((element) => {
			if (!element.nativeElement.checked) {
				val = false;
			}
		});
		if (val) {
			this.selectCheckBox.first.nativeElement.checked = true;
		}
		else {
			this.selectCheckBox.first.nativeElement.checked = false;
		}

		this.url1 = e.srcElement.baseURI;
		this.objrep.captureSelectedTags(e);
	}

	uncheckMultiObject() {// This function is to uncheck all  Multi Object checkbox .
		this.multiObjCheckBox.forEach((element) => {
			element.nativeElement.checked = false;
		});
		this.selectCheckBox.first.nativeElement.checked = false;
	}

	selectAll(event) {
		this.multiObjCheckBox.forEach((element) => {
			element.nativeElement.checked = event.target.checked;
		});
		this.url1 = event.srcElement.baseURI
		this.objrep.captureAllTags(event, this.multiObjCheckBox);
	}

	inputAttr = [];
	multiObjUserInfo() {
		let filterTags = [];
		this.inputAttr = this.objrep.selectedTags();
		filterTags = this.objrep.filterSelectedTags();
		if (filterTags.length === 0) {
			this.dialogService.openAlert('please select a tag');
		} else {
			document.getElementById("multiObjDismiss").click();
			var data = { type: "startExtension", nature: "Multi", tags: filterTags };
			console.log(data)
			console.log(this.url1)
			/**
				The below line will Start the extension and also the starting point of plugin.
				The message sent below will hit "window.addEventListener("message", function(event) {"
				line in inspect1.js file in plugin.
				*/
			window.postMessage(data, this.url1 + "projectdetail/testplanning/ObjRepo");
			filterTags = [];

			/**
			The below line will start listening,to capture any incoming info from plugin.
			If there is any incoming info ,'this.receiver' will be triggered.
			*/
			window.addEventListener("message", this.receiver);
		}
	}

	filterCapturedInfo = {
		'info': []
	}
	receiver = (event) => {
		this.filterCapturedInfo.info = [];
		this.capturedInfoFromPlugin = event.data
		console.log(this.capturedInfoFromPlugin)
		/**
			* The 'in' operator in the below line will check if left operand(i,e particular or certain key) 
			* of the operator is present in right operand(i,e particular or certain object).
			*/
		if ('info' in this.capturedInfoFromPlugin) {
			this.filterCapturedTags();  //Here we are filtering the objects based on input tag type. eg:text, checkbox, radio
			// The below code will remove the listener.
			window.removeEventListener("message", this.receiver);
			this.filterCapturedInfo['pageName'] = this.sPage;
			this.filterCapturedInfo['projectId'] = this.projectId;
			this.filterCapturedInfo['exportConfigInfo'] = this.projectNameData[0].exportConfigInfo;
			this.sendCapturedInfoToBackend()
		}
	}

	selectObjects(obj) {
		console.log(this.inputAttr)
		console.log(obj.attributes.tagName)
		if (obj.attributes.tagName == 'input') {
			if (obj.attributes.type === 'checkbox' || obj.attributes.type === 'radio') {
				if (this.inputAttr.indexOf(obj.attributes.type) !== -1) {
					return true;
				}
			}
			else {
				if (this.inputAttr.indexOf('text') !== -1) {
					return true;
				}
			}
		}
		else {
			return true;
		}
	}

	finalUltimateArr1 = [];
	userSelectedObj1(object, event) {
		if (event.target.checked) {
			this.finalUltimateArr1.push(object)
		} else {
			var index = this.finalUltimateArr1.indexOf(object);
			if (index !== -1) {
				this.finalUltimateArr1.splice(index, 1);
			}
		}
	}

	filterCapturedTags() {
		this.filterCapturedInfo.info = [];
		this.capturedInfoFromPlugin.info.forEach((element, i) => {
			if (element.attributes.tagName == 'input') {
				if (element.attributes.type === 'checkbox' || element.attributes.type === 'radio') {
					if (this.inputAttr.indexOf(element.attributes.type) !== -1) {
						this.filterCapturedInfo.info.push(element)
					}
				}
				else {
					if (this.inputAttr.indexOf('text') !== -1) {
						this.filterCapturedInfo.info.push(element)
					}
				}
			}
			else {
				this.filterCapturedInfo.info.push(element)
			}
		})
	}

	showObjFormedToUser;
	impMultiObjUI: boolean = false;
	sendCapturedInfoToBackend() {
		console.log("first", this.filterCapturedInfo);
		this.objrep.sendCapturedMultiobjectToBackend(this.filterCapturedInfo).subscribe(data => {
			console.log(data)
			this.showObjFormedToUser = data["value"];
			this.displayObjTableUI = false;
			this.impMultiObjUI = true;
		})
	}

	sendMultiObjToSave() {
		console.log("second", this.finalUltimateArr1);
		if (this.finalUltimateArr1.length == 0) {
			this.dialogService.openAlert("Please select atleast one object!!!!");
		} else {
			this.objrep.sendMultiObjSaveFinalToBackend(this.finalUltimateArr1, this.sPage, this.projectId, this.projectNameData[0].exportConfigInfo).subscribe(data => {
				let parameters = {
					'projectId': this.projectId,
					'pageName': this.sPage
				}
				this.displayObjTableUI = true;
				this.impMultiObjUI = false;
				this.finalUltimateArr1 = [];
				this.objrep.getPageDetails(parameters).subscribe(res => {
					this.savedObjInfo = res[0].objectName;
					this.displayObjects = res[0].objectName;
				})
			})
		}
	}

	cancelMultiObjectUI() {
		this.impMultiObjUI = false;//To make Multi Object UI disappear.
		this.displayObjTableUI = true;//To display objects table back.
	}

	/////////////////////////////Multi object Capture code ends here/////////////////////////////////////	


	/////////////////////////////Compare Object Code Starts Here////////////////////////////////////////


	@ViewChildren("compareObjCheckBox") compareObjCheckBox: QueryList<ElementRef>;

	compareCheckedBox(e) {
		this.url1 = e.srcElement.baseURI;
		this.objrep.captureSelectedTags(e);
	}

	uncheckCompareObject() {// This function is to uncheck all  Multi Object checkbox .
		this.compareObjCheckBox.forEach((element) => {
			element.nativeElement.checked = false;
		});
	}

	compareObjUserInfo() {
		let comparefilterTags = [];
		this.inputAttr = this.objrep.selectedTags();
		comparefilterTags = this.objrep.filterSelectedTags();
		if (comparefilterTags.length === 0) {
			this.dialogService.openAlert('please select a tag');
		} else {
			document.getElementById("compareObjDismiss").click();
			var data = { type: "startExtension", nature: "Multi", tags: comparefilterTags };
			/**
				The below line will Start the extension and also the starting point of plugin.
				The message sent below will hit "window.addEventListener("message", function(event) {"
				line in inspect1.js file in plugin.
				*/
			window.postMessage(data, this.url1 + "projectdetail/testplanning/ObjRepo");
			comparefilterTags = [];

			/**
			The below line will start listening,to capture any incoming info from plugin.
			If there is any incoming info ,'this.receiver' will be triggered.
			*/
			window.addEventListener("message", this.compareReceiver);
		}
	}

	compareReceiver = (event) => {
		this.filterCapturedInfo.info = [];
		this.capturedInfoFromPlugin = event.data
		/**
			* The 'in' operator in the below line will check if left operand(i,e particular or certain key) 
			* of the operator is present in right operand(i,e particular or certain object).
			*/
		if ('info' in this.capturedInfoFromPlugin) {
			this.filterCapturedTags();  //Here we are filtering the objects based on input tag type. eg:text, checkbox, radio
			// The below code will remove the listener.
			window.removeEventListener("message", this.compareReceiver);
			this.filterCapturedInfo['pageName'] = this.sPage;
			this.filterCapturedInfo['projectId'] = this.projectId;
			this.filterCapturedInfo['exportConfigInfo'] = this.projectNameData[0].exportConfigInfo;
			this.sendCapturedCompareInfoToBackend();
		}
	}
	compareObjInfoFromBackend;
	sendCapturedCompareInfoToBackend() {
		this.objrep.sendCapturedCompareobjectToBackend(this.filterCapturedInfo).subscribe(data => {
			this.compareObjInfoFromBackend = data;
			this.matchLength = this.compareObjInfoFromBackend.matched.length;
			this.newLength = this.compareObjInfoFromBackend.New.length;
			this.removeLength = this.compareObjInfoFromBackend.Removed.length;
			this.impCampareUI = true;
			this.impCapturedData = "All";
			this.filterSelected(this.impCapturedData);
			this.displayObjTableUI = false;
		})
	}
	matchLength;
	newLength;
	removeLength;
	displayObjTableUI: boolean = true;
	campareUI: boolean;
	selectedData: any;
	capturedData
	SelectMerge: boolean;
	SelectAdd: boolean;
	SelectRemove: boolean;
	displayCompareObjResults = [];
	matchTable: boolean = false;
	newTable: boolean = false;
	removedTable: boolean = false;
	infoMessage;

	finalUltimateArr = [];
	userSelectedObj(object, event) {
		if (event.target.checked) {
			this.finalUltimateArr.push(object)
		} else {
			var index = this.finalUltimateArr.indexOf(object);
			if (index !== -1) {
				this.finalUltimateArr.splice(index, 1);
			}
		}
	}

	checkForAnyObjectSelected() {
		if (this.finalUltimateArr.length == 0) {
			this.dialogService.openAlert("Please select any one object!!!")
		} else {
			document.getElementById("comWarMod").click();
		}
	}

	sendfinalUltimateArr() {
		let formObj = {
			'pageName': this.sPage,
			'projectId': this.projectId,
			'exportConfigInfo': this.projectNameData[0].exportConfigInfo,
			'actualInfo': this.finalUltimateArr
		}

		this.objrep.sendfinalUltimateArrToBackend(formObj).subscribe(data => {
			this.impCampareUI = false;// to disable compare Ui
			this.displayObjTableUI = true;// to enable object Table 
			this.displayCompareObjResults = [];
			this.finalUltimateArr = [];
			this.selectedPage(this.sPage);
		})

	}

	impCampareUI: boolean;
	impCapturedData;

	filterSelected(filterValue) {
		let temArray1 = this.compareObjInfoFromBackend.matched;
		for (const iterator of temArray1) {
			iterator.newObj.matchPercent = Math.round(iterator.newObj.matchPercent)
		}
		let temArray2 = this.compareObjInfoFromBackend.New;
		let temArray3 = this.compareObjInfoFromBackend.Removed;
		let finaltempArray = temArray1.concat(temArray2, temArray3)
		this.infoMessage = "Please Select required object, you wish to add/remove/update ."
		this.displayCompareObjResults = finaltempArray;
	}

	displayChangedPropertiesinfo = [];

	async showChangedProperties(obj) {

		this.displayChangedPropertiesinfo = await this.objrep.processToGetChangedProperties(obj);

		document.getElementById("openpropertiesChangeInfoModal").click();

	}

	cancelCompareUI() {
		this.impCampareUI = false;//To make compare UI disappear.
		this.displayObjTableUI = true;//To display objects table back.
	}

	////////////////////////////Compare Object Code Ends Here/////////////////////////////////////////


	//////////////////////////////// tree structure //////////////////////////////

	activeModule: any;
	clickIndex: any;
	clickedModule: any;

	repository() {
		this.clearMenu = true;
		this.openObjMenu = false;
		this.displayCreateObject = false;
		this.objrep.getObjectDetails({ 'projectId': this.projectId }).subscribe(res => {
			this.displayModuleForTree = res;
			this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
			this.pageName = res;
			this.savedPomInfo = res;
		});
	}

	openFeatureMenu(selectedModule, i) {
		this.activeModule = selectedModule;
		this.clickIndex = i
		this.clickedModule = selectedModule
	}

	displayModuleForTree: Post[];
	items: { label: string; command: (event: any) => void; }[];
	async nodeSelect(file) {
		if (file.node != undefined) {
			if (file.node.data == "pageName") {
				this.pageName = file.node.label;
				for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
					if (file.node.label === this.displayModuleForTree[index]['label']) {
						this.openFeatureMenu(this.pageName, index);
						break;
					}
				}
				this.selectedPageOpen(file.node.label)
				if (this.newRole == 'Automation Engineer') {
                    this.items = [
						//{ label: 'Open Page', command: (event) => this.selectedPageOpen(file.node.label) },
						{ label: 'Edit', command: (event) => this.editPage1(file.node.label) },
	
					];
                }
                else if (this.newRole == 'Lead') {
                    this.items = [
						//{ label: 'Open Page', command: (event) => this.selectedPageOpen(file.node.label) },
						{ label: 'Edit', command: (event) => this.editPage1(file.node.label) },
						{ label: 'Delete', command: (event) => this.deletePage1(file.node.label) },
	
					];
                }
                else {
                    this.items = [];
                }
			}
			else { }
		}
	}
	//////////////////////////////// tree structure ends //////////////////////////////
}
