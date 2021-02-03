import { DateRangeComponent } from './../date-range/date-range.component';
import { Platform, NavController, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { LoginService } from './../services/login/login.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [DatePicker, FormatDatePipe]
})
export class HistoryComponent implements OnInit, AfterViewInit {
 
  now: any;
  public date: any = new Date();
  dateStart: any;
  dateEnd: any;

  sDate: any;
  eDate: any;
  status: string;
  userdate: any;

  constructor(private datePipe: FormatDatePipe,
    private datePicker: DatePicker, public route: ActivatedRoute,
    public googleMaps: GoogleMaps, public plt: Platform,
  ) {

  }
  async ngOnInit() {
    await this.plt.ready();
    this.openCalendar();
  }

  ngAfterViewInit() {

  }

  async openCalendar() {
    const popover = await this.popoverController.create({
      component: DateRangeComponent,
      componentProps: { data: new Date(), selecteddate: this.userdate },
      translucent: true
    });
    await popover.present();
    let selectedDates = await popover.onDidDismiss();

    if (selectedDates && selectedDates.data && selectedDates.data.action) {
      this.dateStart = selectedDates.data.dateFrom;
      this.dateEnd = selectedDates.data.dateTo;
      this.sDate = selectedDates.data.dateFrom.split(" ");
      this.eDate = selectedDates.data.dateTo.split(" ");
    } else {

    }

  }

 
 

}
