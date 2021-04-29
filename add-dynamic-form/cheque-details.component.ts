import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBarConfig, MatCheckboxChange, MatSnackBar } from '@angular/material';
import { DataSharingService } from '../../AuthGuard/DataSharingService';
import { MasterService } from '../../Shared/app.Masters.Service';
import { RequestModel } from '../../Shared/Models/app.MasterRequestModel';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { constantUrl } from '../../Shared/constantUrl';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LmsService } from '../services/lms.service';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-cheque-details',
  templateUrl: './cheque-details.component.html',
  styleUrls: ['./cheque-details.component.scss']
})
export class ChequeDetailsComponent implements OnInit {

  PdcRpdcForm: FormGroup;
  RpdcForm: FormGroup;

  SecurityPdcForm: FormGroup;
  ECSForm: FormGroup;
  NACHForm: FormGroup;

  items: FormArray;
  RpdcItems: FormArray;
  SecurityPDCitems: FormArray;
  ecsItems: FormArray;
  nachItems: FormArray;

  dataCSource: any;

  private data: any; private _MasterService; showSpinner: boolean = false;
  RequestModel: RequestModel = new RequestModel();
  ReportingManagerRequestModel: RequestModel = new RequestModel();
  CopyEmployeeRequestModel: RequestModel = new RequestModel();
  EmployeeProcessForCopyRequestModel: RequestModel = new RequestModel();
  SaveEmployeeDataRequestModel: RequestModel = new RequestModel();
  SaveEmployeeProfileRequestModel: RequestModel = new RequestModel();
  EmpDeleteAssBranchRequestModel: RequestModel = new RequestModel();
  EmpDeleteAssProcessRequestModel: RequestModel = new RequestModel();

  loading: boolean = false; CurrentDate: any = new Date();
  // register new role
  EmployeeId: any = 0;
  CustomerList: any = [];
  SelectRoleId: any = ''; FirstName: any = ''; LastName: any = '';
  SelectGender: any = ''; DateOfBirth: any = ''; PresentAddress: any = '';
  PermanentAddress: any = ''; PhoneNo: any = ''; AlternetPhoneNo: any = '';
  EnterEmail: any = ''; AadharNo: any = ''; EmployeeLoginId: any = '';
  EmployeePassword: any = ''; EmpManagerId: any = '';
  UploadImageBase64: any = '';
  UploadImageName: string = '';
  profilePicture: string = '';
  Int_Id: string = '';
  // save data array
  SelectedLoanProcessData: any = [];
  SelectedBranchesData: any = [];
  // bind data
  BranchesList: any = [];
  LoanProcessList: any = [];
  EmployeeDetailData: any = {};
  RolesDropdownData: any = [];
  ReportingManagerDropdown: any;
  // copy employee
  CopyEmployeeDropdown: any = [];
  CopyEmployeeId: any = ''; RepaymentMode: any = '';
  LoanAcNo: any;
  isShowCopyEmployee: boolean = false;
  IsUpdateButton: boolean = false;
  IsSaveButton: boolean = true;
  IsSPDC: boolean = true;
  IsNACH: boolean = true;
  IsRPDC: boolean = true;
  PDC_RPDC_DetailsForm: any; ECSDetailsForm: any;
  tab: any = 'SPDC';

  displayedCustomerColumns: string[] = ['Int_Id', 'Pdc Type', 'Customer Name', 'Bank Name', 'Branch', 'Acc Type', 'A/C No', 'ChFrom', 'ChTo', 'No of Chqs', 'EMI From', 'EMI To', 'Nach Code', 'Action'];

  constructor(
    private _Route: Router,
    private dataSharingService: DataSharingService,
    public snackBar: MatSnackBar,
    private MasterService: MasterService,
    private formBuilder: FormBuilder,
    private LmsService: LmsService,
    private activedRoute: ActivatedRoute,
  ) {
    this._MasterService = MasterService;
    this.data = JSON.parse(sessionStorage.getItem('currentUser'));

    this.PDCRPDCForm();
    this.RPDCForm();


    this.ecsForm();
    this.SecurityPDCForm();
    this.nachForm();
  }

  configSuccess: MatSnackBarConfig = {
    panelClass: 'style-success',
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  ngOnInit() {
    this.activedRoute.paramMap.subscribe((param: ParamMap) => {

      let type = decodeURIComponent(param.get("Type"));
      if (type == 'L' || type == 'A') {
        if (type == 'L') {
          this.LoanAcNo = param.get("LA-No");
        } else {
          //this.dataSharingService.LmsHeaderLoanOR_APP_No.next(param.get("LA-No"));
        }
      }

    })
    this.dataSharingService.getLmsHeaderLoanNo().subscribe(value => {
      if (value) {
        this.getChequeDetails(value);
        this.getCustomerList(value);

      }
    });


    //$('#kycModel').modal('show');
    //$("#kycModel").css("z-index", "1050");

  }
  goToUpdate(data: any) {
    console.log(data.Int_Id);
    this.Int_Id = data.Int_Id;
    this.LmsService.GetChequeDetailsById({ Int_Id: data.Int_Id }).subscribe((response: any) => {
      console.log('response', response);
      //this.dataCSource = new MatTableDataSource(response);
      this.IsUpdateButton = true;
      this.IsSaveButton = false;
      $('#kycModel').modal('show');
      $("#kycModel").css("z-index", "1050");
      this.tab = response[0].PdcType;
      if (this.tab == "SPDC") {

        this.items = this.PdcRpdcForm.get('items') as FormArray;
        this.items.push(this.EditPDCRPDItem(response[0]));
        this.removeNewPdc(0);
        this.IsNACH = false;
        this.IsRPDC = false;
        this.IsSPDC = true;
      }
      if (this.tab == "RPDC") {

        this.RpdcItems = this.RpdcForm.get('items') as FormArray;
        this.RpdcItems.push(this.EditRPDItem(response[0]));
        this.removeRPdc(0);
        this.IsNACH = false;
        this.IsRPDC = true;
        this.IsSPDC = false;
      }
      if (this.tab == "NACH") {
        this.nachItems = this.NACHForm.get('items') as FormArray;
        this.nachItems.push(this.EditNACHItem(response[0]));
        this.removeNach(0);
        this.IsNACH = true;
        this.IsRPDC = false;
        this.IsSPDC = false;
      }

    });
  }
  getCustomerList(LoanAcNo) {
    console.log(LoanAcNo);
    this.LmsService.GetCustomerByLoanNo({ LoanACNo: LoanAcNo }).subscribe((result) => {
      this.CustomerList = JSON.parse(JSON.stringify(result));
      console.log(this.CustomerList);
    });
  }

  UpdateChequeDetail() {
    let localUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.tab);
    let data;
    if (this.tab == "NACH") { data = this.NACHForm.value.items }
    if (this.tab == "RPDC") { data = this.RpdcForm.value.items }
    if (this.tab == "SPDC") { data = this.PdcRpdcForm.value.items }
    console.log(data);
    console.log(this.Int_Id);

    let updateDetails = {
      'Data': {
        "Int_Id": this.Int_Id,
        "LoanAcNo": this.LoanAcNo,
        "UpdatedAt": new Date(),
        "CreatedAt": new Date(),
        "ModifyBy": localUser.userId
      },
      'Detail': data
    }
    console.log(updateDetails);
    this.LmsService.SaveLMSChequeDetails({ JSON: JSON.stringify(updateDetails) }).subscribe((response) => {
      if (response[0].CODE == 0) {
        this.NACHForm.reset();
        this.RpdcForm.reset();
        this.PdcRpdcForm.reset();
        this.onCloseKYC();
        this.getChequeDetails(this.LoanAcNo);
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      }
    });
  }
  EditRPDItem(res): FormGroup {
    return this.formBuilder.group({
      PdcType: 'RPDC',
      CustomerName: res.CustomerName,
      Bankname: res.Bankname,
      Branch: res.Branch,
      AccType: res.AccType,
      Ac: res.Ac,
      ChFrom: res.ChFrom,
      ChTo: res.ChTo,
      NoOfChqs: res.NoOfChqs,
      EMIFrom: res.EMIFrom,
      EMITo: res.EMITo
    });
  }
  EditNACHItem(res): FormGroup {
    return this.formBuilder.group({
      PdcType: 'NACH',
      CustomerName: res.CustomerName,
      Bankname: res.Bankname,
      Branch: res.Branch,
      AccType: res.AccType,
      Ac: res.Ac,
      ChFrom: res.ChFrom,
      ChTo: res.ChTo,
      NoOfChqs: res.NoOfChqs,
      EMIFrom: res.EMIFrom,
      EMITo: res.EMITo,
      NachCode: res.NachCode
    });
  }
  EditPDCRPDItem(res): FormGroup {
    console.log(res);
    return this.formBuilder.group({
      PdcType: 'SPDC',
      CustomerName: res.CustomerName,
      Bankname: res.Bankname,
      Branch: res.Branch,
      AccType: res.AccType,
      Ac: res.Ac,
      ChFrom: res.ChFrom,
      ChTo: res.ChTo,
      NoOfChqs: res.NoOfChqs
    });
  }

  getChequeDetails(LoanNo) {
    console.log('LoanNo---', LoanNo);
    this.LoanAcNo = LoanNo;
    this.LmsService.GetChequeDetails({ LoanAcNo: LoanNo }).subscribe((response: any) => {
      console.log('response', response);
      this.dataCSource = new MatTableDataSource(response);
    });
  }

  PDCRPDCForm() {
    this.PdcRpdcForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createPDCRPDItem()])
    });
  }

  RPDCForm() {
    this.RpdcForm = this.formBuilder.group({
      items: this.formBuilder.array([this.RPDItem()])
    });
  }

  SecurityPDCForm() {
    this.SecurityPdcForm = this.formBuilder.group({
      securityitems: this.formBuilder.array([this.createSecurityPdcItem()])
    });
  }

  onCloseKYC() {
    $('#kycModel').modal('hide');
  }

  createPDCRPDItem(): FormGroup {
    return this.formBuilder.group({
      PdcType: 'SPDC',
      CustomerName: '',
      Bankname: '',
      Branch: '',
      AccType: '',
      Ac: '',
      ChFrom: '',
      ChTo: '',
      NoOfChqs: '',
    });
  }


  RPDItem(): FormGroup {
    return this.formBuilder.group({
      PdcType: 'RPDC',
      CustomerName: '',
      Bankname: '',
      Branch: '',
      AccType: '',
      Ac: '',
      ChFrom: '',
      ChTo: '',
      NoOfChqs: '',
      EMIFrom: '',
      EMITo: '',
    });
  }

  createSecurityPdcItem(): FormGroup {
    return this.formBuilder.group({
      Bankname: '',
      Branch: '',
      Ac: '',
      ChFrom: '',
      ChTo: '',
      NoOfChqs: ''
    });
  }

  addItem(): void {
    this.items = this.PdcRpdcForm.get('items') as FormArray;
    this.items.push(this.createPDCRPDItem());
  }

  RPDCaddItem(): void {
    this.RpdcItems = this.RpdcForm.get('items') as FormArray;
    this.RpdcItems.push(this.RPDItem());
  }
  removeNewPdc(i) {
    if (this.items.length == 1) {
    }
    else {
      this.items.removeAt(i);
    }
  }

  removeRPdc(i) {
    if (this.RpdcItems.length == 1) {
    }
    else {
      this.RpdcItems.removeAt(i);
    }
  }

  NachaddItem(): void {
    this.nachItems = this.NACHForm.get('items') as FormArray;
    this.nachItems.push(this.createNACHItem());
  }
  removeNach(i) {
    if (this.nachItems.length == 1) {
    }
    else {
      this.nachItems.removeAt(i);
    }
  }

  addSecurityPdcItem(): void {
    this.SecurityPDCitems = this.SecurityPdcForm.get('securityitems') as FormArray;
    this.SecurityPDCitems.push(this.createSecurityPdcItem());
  }
  removeSecurityPdcItem(i) {
    if (this.SecurityPDCitems.length == 1) {
    }
    else {
      this.SecurityPDCitems.removeAt(i);
    }
  }

  ecsForm() {
    this.ECSForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createECSItem()])
    });
  }

  nachForm() {
    this.NACHForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createNACHItem()])
    });
  }

  createNACHItem(): FormGroup {
    return this.formBuilder.group({
      PdcType: 'NACH',
      CustomerName: '',
      Bankname: '',
      Branch: '',
      AccType: '',
      Ac: '',
      ChFrom: '',
      ChTo: '',
      NoOfChqs: '',
      EMIFrom: '',
      EMITo: '',
      NachCode: ''
    });
  }

  createECSItem(): FormGroup {
    return this.formBuilder.group({
      Bankname: '',
      Branch: '',
      MCIRCode: '',
      AcType: '',
      AcNo: '',
      CustomerName: ''
    });
  }

  addECSItem(): void {
    this.ecsItems = this.ECSForm.get('items') as FormArray;
    this.ecsItems.push(this.createECSItem());
  }
  removeECSItem(i) {
    if (this.ecsItems.length == 1) {
    }
    else {
      this.ecsItems.removeAt(i);
    }
  }


  addNACHItem(): void {
    this.nachItems = this.NACHForm.get('items') as FormArray;
    this.nachItems.push(this.createNACHItem());
  }

  removeNACHItem(i) {
    if (this.nachItems.length == 1) {
    }
    else {
      this.nachItems.removeAt(i);
    }
  }

  selectRepaymentMode(event) {
    if (this.RepaymentMode) {
      this.PDC_RPDC_DetailsForm = this.RepaymentMode;
    } else {
      this.PDC_RPDC_DetailsForm = '';
      this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please select Repayment mode', ...this.configSuccess });
    }
  }

  calculateNoOfCheque(event, i) {
    var ChFromEle = document.getElementById('ChFrom' + i)["value"];
    var ChToEle = document.getElementById('ChTo' + i)["value"];

    if (ChToEle) {
      if (Number(ChFromEle) > Number(ChToEle)) {
        document.getElementById('ChFrom' + i)["value"] = 0;
        document.getElementById('ChTo' + i)["value"] = 0;
        this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please Ch. No To greater than Ch. No From', ...this.configSuccess });

      } else {
        //document.getElementById('NoOfChqs' + i)["value"] = Number(Number(ChToEle) - Number(ChFromEle)) + 1;
        this.PdcRpdcForm.value.items[i].NoOfChqs = Number(Number(ChToEle) - Number(ChFromEle)) + 1;
        $(function () {
          $("#NoOfChqs" + i).val(Number(Number(ChToEle) - Number(ChFromEle)) + 1);
        });
      }
    }

  }
  calculateNoOfEMIR(event, i) {
    var ChFromEle = document.getElementById('EMIFromR' + i)["value"];
    var ChToEle = document.getElementById('EMIToR' + i)["value"];
    console.log(Number(document.getElementById('NoOfChqsR' + i)["value"]));
    if (ChToEle) {
      if (Number(ChFromEle) > Number(ChToEle)) {
        document.getElementById('EMIFromR' + i)["value"] = '';
        document.getElementById('EMIToR' + i)["value"] = '';
        this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please EMI No To greater than EMI No From', ...this.configSuccess });

      }
      else if ((Number(ChFromEle) > 0) && ((Number(ChFromEle) < Number(ChToEle))) && ((Number(ChToEle) - Number(ChFromEle)) > (Number(document.getElementById('NoOfChqsR' + i)["value"])))) {
        document.getElementById('EMIFromR' + i)["value"] = '';
        document.getElementById('EMIToR' + i)["value"] = '';
        this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please No. of EMI  greater than No. Of Chqs', ...this.configSuccess });

      } else {

      }
    }
  }
  calculateNoOfEMIN(event, i) {
    var ChFromEle = document.getElementById('EMIFromN' + i)["value"];
    var ChToEle = document.getElementById('EMIToN' + i)["value"];
    console.log(Number(document.getElementById('NoOfChqsN' + i)["value"]));
    if (Number(ChFromEle) > Number(ChToEle)) {
      document.getElementById('EMIFromN' + i)["value"] = '';
      document.getElementById('EMIToN' + i)["value"] = '';
      this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please EMI No To greater than EMI No From', ...this.configSuccess });

    }
    else if ((Number(ChFromEle) > 0) && ((Number(ChFromEle) < Number(ChToEle))) && ((Number(ChToEle) - Number(ChFromEle)) > (Number(document.getElementById('NoOfChqsN' + i)["value"])))) {
      document.getElementById('EMIFromN' + i)["value"] = '';
      document.getElementById('EMIToN' + i)["value"] = '';
      this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please No. of EMI  greater than No. Of Chqs', ...this.configSuccess });

    } else {

    }
  }

  calculateNoOfChequeR(event, i) {
    var ChFromEle = document.getElementById('ChFromR' + i)["value"];
    var ChToEle = document.getElementById('ChToR' + i)["value"];
    var EMIFromEle = document.getElementById('EMIFromR' + i)["value"];
    var EMIToEle = document.getElementById('EMIToR' + i)["value"];
    if (ChToEle != null) {
      if (Number(ChFromEle) > Number(ChToEle)) {
        document.getElementById('ChFromR' + i)["value"] = '';
        document.getElementById('ChToR' + i)["value"] = '';
        this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please Ch. No To greater than Ch. No From', ...this.configSuccess });

      } else {
        //document.getElementById('NoOfChqsR' + i)["value"] = Number(Number(ChToEle) - Number(ChFromEle)) + 1;
        this.RpdcForm.value.items[i].NoOfChqs = Number(Number(ChToEle) - Number(ChFromEle)) + 1;
        $(function () {
          $("#NoOfChqsR" + i).val(Number(Number(ChToEle) - Number(ChFromEle)) + 1);
        });
      }
      if (EMIToEle != 0 && EMIFromEle != 0) {
        if ((Number(EMIToEle) - Number(EMIFromEle) > Number(document.getElementById('NoOfChqsR' + i)["value"]))) {
          document.getElementById('EMIFromR' + i)["value"] = '';
          document.getElementById('EMIToR' + i)["value"] = '';
          this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please EMI No To greater than EMI No From', ...this.configSuccess });

        }
      }
    }

  }

  calculateNoOfChequeN(event, i) {
    var ChFromEle = document.getElementById('ChFromN' + i)["value"];
    var ChToEle = document.getElementById('ChToN' + i)["value"];
    var EMIFromEle = document.getElementById('EMIFromN' + i)["value"];
    var EMIToEle = document.getElementById('EMIToN' + i)["value"];
    if (ChToEle != null) {
      if (Number(ChFromEle) > Number(ChToEle)) {
        document.getElementById('ChFromN' + i)["value"] = '';
        document.getElementById('ChToN' + i)["value"] = '';
        this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please Ch. No To greater than Ch. No From', ...this.configSuccess });

      } else {
        //document.getElementById('NoOfChqsN' + i)["value"] = Number(Number(ChToEle) - Number(ChFromEle)) + 1;
        this.NACHForm.value.items[i].NoOfChqs = Number(Number(ChToEle) - Number(ChFromEle)) + 1;
        $(function () {
          $("#NoOfChqsN" + i).val(Number(Number(ChToEle) - Number(ChFromEle)) + 1);
        });
      }
      if (EMIToEle != 0 && EMIFromEle != 0) {
        if ((Number(EMIToEle) - Number(EMIFromEle) > Number(document.getElementById('NoOfChqsN' + i)["value"]))) {
          document.getElementById('EMIFromN' + i)["value"] = '';
          document.getElementById('EMIToN' + i)["value"] = '';
          this.snackBar.openFromComponent(SnackbarComponent, { data: 'Please EMI No To greater than EMI No From', ...this.configSuccess });

        }
      }
    }
  }

  changeRDTab(tab: any) {
    this.tab = tab;
  }
  OpenModel() {
    $('#kycModel').modal('show');
    $("#kycModel").css("z-index", "1050");
    this.IsNACH = true;
    this.IsRPDC = true;
    this.IsSPDC = true;
    this.IsSaveButton = true;
    this.IsUpdateButton = false;
    this.PDCRPDCForm();
    this.RPDCForm();
    this.ecsForm();
    this.SecurityPDCForm();
    this.nachForm();
    this.tab = "SPDC"
  }

  SaveSPDC() {
    let localUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let saveDetails = {
      'Data': {
        "Int_Id": 0,
        "LoanAcNo": this.LoanAcNo,
        "UpdatedAt": new Date(),
        "CreatedAt": new Date(),
        "ModifyBy": localUser.userId
      },
      'SPDC': this.PdcRpdcForm.value.items
    }

    console.log('chFrom', saveDetails);
    this.LmsService.SaveLMSChequeDetails({ JSON: JSON.stringify(saveDetails) }).subscribe((response) => {
      if (response[0].CODE == 0) {
        this.NACHForm.reset();
        this.getChequeDetails(this.LoanAcNo);
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      }
    });
  }

  SaveRPDC() {
    let localUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let saveDetails = {
      'Data': {
        "Int_Id": 0,
        "LoanAcNo": this.LoanAcNo,
        "UpdatedAt": new Date(),
        "CreatedAt": new Date(),
        "ModifyBy": localUser.userId
      },
      'RPDC': this.RpdcForm.value.items
    }

    console.log('chFrom', { JSON: JSON.stringify(saveDetails) });
    this.LmsService.SaveLMSChequeDetails({ JSON: JSON.stringify(saveDetails) }).subscribe((response) => {
      if (response[0].CODE == 0) {
        this.NACHForm.reset();
        this.getChequeDetails(this.LoanAcNo);
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      }
    });
  }

  SaveNACH() {
    let localUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let saveDetails = {
      'Data': {
        "Int_Id": 0,
        "LoanAcNo": this.LoanAcNo,
        "UpdatedAt": new Date(),
        "CreatedAt": new Date(),
        "ModifyBy": localUser.userId
      },
      'NACH': this.NACHForm.value.items
    }

    this.LmsService.SaveLMSChequeDetails({ JSON: JSON.stringify(saveDetails) }).subscribe((response) => {
      if (response[0].CODE == 0) {
        this.NACHForm.reset();
        this.getChequeDetails(this.LoanAcNo);
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
      }
    });
  }

  saveChequeDetails() {
    console.log('this.PdcRpdcForm', this.PdcRpdcForm.value);
    if (this.PDC_RPDC_DetailsForm == 'ECS Details') {
      let saveDetails = {
        "Int_Id": 0,
        "IsActive": 0,
        "LoanNo": 'LOAN76666GJH',
        "Data": this.ECSForm.value.items,
        "SecurityPDC": this.SecurityPdcForm.value.securityitems
      }
      this.LmsService.SaveChequeECSDetails({ JSON: JSON.stringify(saveDetails) }).subscribe((response) => {
        if (response[0].CODE == 0) {
          this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
        }
      });
    } else if (this.PDC_RPDC_DetailsForm == 'PDCRPDC') {
      let saveDetails = {
        "Int_Id": 0,
        "IsActive": 0,
        "LoanNo": 'LOAN76666GJH',
        "Data": this.PdcRpdcForm.value.items,
        "SecurityPDC": this.SecurityPdcForm.value.securityitems
      }
      this.LmsService.SaveChequeDetails({ JSON: JSON.stringify(saveDetails) }).subscribe((response) => {
        if (response[0].CODE == 0) {
          this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
        }
      });
    } else if (this.PDC_RPDC_DetailsForm == 'NACH Details') {
      let saveDetails = {
        "Int_Id": 0,
        "IsActive": 0,
        "LoanNo": 'LOAN76666GJH',
        "Data": this.NACHForm.value.items,
        "SecurityPDC": this.SecurityPdcForm.value.securityitems
      }
      this.LmsService.SaveNACHDetails({ JSON: JSON.stringify(saveDetails) }).subscribe((response) => {
        if (response[0].CODE == 0) {
          this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, { data: response[0].MSG, ...this.configSuccess });
        }
      });
    }

  }

}
