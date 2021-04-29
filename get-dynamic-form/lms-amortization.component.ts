import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSharingService } from '../../AuthGuard/DataSharingService';
import { MatSnackBar, MatTableDataSource, MatSnackBarConfig } from '@angular/material';
import { LosService } from '../../services/los.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var $: any;
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { constantUrl } from '../../Shared/constantUrl';
import { EncrDecrService } from '../../AuthGuard/EncrDecrService';
import { MasterService } from '../../Shared/app.Masters.Service';
import { LmsService } from '../services/lms.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-lms-amortization',
  templateUrl: './lms-amortization.component.html',
  styleUrls: ['./lms-amortization.component.scss']
})
export class LmsAmortizationComponent implements OnInit {

  currentUser: any;
  showSpinner: boolean = false;
  configSuccess: MatSnackBarConfig = {
    panelClass: 'style-success',
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  items: FormArray;
  AmortizationForm: FormGroup;

  tab: any;
  rdDetailData: any;
  inquiryId: any;
  inquiryDetail: any;
  loading: boolean = false;
  FormShow: boolean = true;
  DetailShow: boolean = true;
  isShowSave: boolean = true;
  isShowUpdate: boolean = false;
  rdDataSource: any = '';
  CurrentDate: any = new Date();
  ApplicationId: any;
  productDropdown: any[] = [];
  chargesDropdown: any[] = [];
  InsuranceInfo: any[] = [];
  dataSource: any;
  LoanAcNo: any;
  IntId = 0;
  stepEMI: any[] = [];
  emiIrr: any;
  stepEmiData: any;
  dataCSource: any;

  displayedamortizationColumns: string[] = ['Int_Id', 'Date', 'EMI Amount', 'Principal', 'Interest', 'Balance', 'Type', 'Action'];

  constructor(
    private dataSharingService: DataSharingService, private _MasterService: MasterService,
    private route: ActivatedRoute, private snackBar: MatSnackBar, private encdec: EncrDecrService,
    private router: Router, private losService: LosService,
    private LmsService: LmsService, private formBuilder: FormBuilder
  ) {

    this.route.paramMap.subscribe((param: ParamMap) => {
      let type = decodeURIComponent(param.get("Type"));
      this.dataSharingService.LmsHeaderType.next(type);
      if (type == 'L' || type == 'A') {
        if (type == 'L') {
          let LoanId = decodeURIComponent(param.get("id"));
          this.dataSharingService.LmsHeaderLoanId.next(LoanId);
          this.dataSharingService.LmsHeaderLoanOR_APP_No.next(param.get("LA-No"));
        } else {
          let LoanId = decodeURIComponent(param.get("id"));
          this.dataSharingService.LmsHeaderLoanId.next(LoanId);
          this.dataSharingService.LmsHeaderLoanOR_APP_No.next(param.get("LA-No"));
        }
      }
    });
    this.getLMS_Repay_Sechule();

  }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.dataSharingService.getLmsHeaderLoanNo().subscribe(value => {
      if (value) {

      }
    });
    this.amortizationForm();
  }


  getLMS_Repay_Sechule() {
    this.FormShow = true;
    let data = {
      LoanAmount: 5000000.00,
      CaseIRR: 9.07851,
      LoanPeriod: 24,
      DueDate: '2021-04-25',
      FlagFrequency: 2,
      EMIAmount: 250000
    }
    this.LmsService.getLMS_Repay_Sechule(data).subscribe((res: any) => {
      //console.log('getLMS_Repay_Sechule=>>>>>>', res);
      this.amortizationForm();
      res.forEach(element => {
        this.addItem(element);
      });
    });
  }

  amortizationForm() {
    this.AmortizationForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  createAmortizationFormItem(element): FormGroup {
    return this.formBuilder.group({
      DueDate: [{ value: new Date(element.DueDate), disabled: true }, Validators.required],
      EMI_Amount: [{ value: element.EMI_Amount, disabled: true }, Validators.required],
      INTEREST: [{ value: element.INTEREST, disabled: true }, Validators.required],
      PERIOD: [{ value: element.PERIOD, disabled: true }, Validators.required],
      PRINCIPLE: [{ value: element.PRINCIPLE, disabled: true }, Validators.required],
      Principle_OS: [{ value: element.Principle_OS, disabled: true }, Validators.required],
      type: [{ value: 'NACH', disabled: true }, Validators.required],
    });
  }

  addItem(element): void {
    this.items = this.AmortizationForm.get('items') as FormArray;
    this.items.push(this.createAmortizationFormItem(element));
  }

  editForm(item, i) {
    item.get('DueDate').enable();
    item.get('type').enable();
  }
}
