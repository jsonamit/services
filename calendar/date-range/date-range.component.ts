import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController,AlertController } from '@ionic/angular';
import { ViewController } from '@ionic/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormatDatePipe } from '../pipes/format-date/format-date.pipe';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [DatePicker, FormatDatePipe]
})
export class DateRangeComponent {
  
  dateFrom: any = new Date();
  dateTo: any = new Date();
  date: any = new Date();
  userDate:any;
  selectedFrom:any;
  selectedTo:any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public popCtrl: PopoverController,private alertController:AlertController,

    private datePipe: FormatDatePipe, private datePicker: DatePicker) {
      this.userDate = this.navParams.data;
      if(this.userDate.selecteddate) {
        let userDate = this.userDate.selecteddate.split('&');
        this.dateFrom = userDate[0];
        this.dateTo = userDate[1]; 
      }
    }

  ionViewDidLoad() {
    
  }


  dismiss(action) {
      let data = { dateFrom: this.datePipe.transform(this.dateFrom), dateTo: this.datePipe.transform(this.dateTo), action: action };
      this.popCtrl.dismiss(data);
  }

  getStartDateFormat(dateStart) {
    return moment(dateStart).format('DD-MM-YYYY hh:mm A');
  }

  getEndDateFormat(enddate) {
    return moment(enddate).format('DD-MM-YYYY hh:mm A');
  }

  selectDate(dateFor) {
    let min = new Date();
    let max = new Date();
    min.setDate(min.getDate() - 90);
   
    this.datePicker.show({
      date: this.date, 
      mode: 'datetime',
      minDate: this.selectedFrom ? this.selectedFrom.setDate(this.selectedFrom.getDate()) : min.setDate(min.getDate()),
      maxDate: this.selectedTo ? this.selectedTo.setDate(this.selectedTo.getDate()) : max.setDate(max.getDate()),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        let selected = this.datePipe.transform(date);
        if (dateFor === 'from') {
          this.dateFrom = selected;
          let current:any = moment().format('YYYY-DD-MM');

          this.selectedFrom = new Date(selected);
          var myDate = new Date(new Date(selected).getTime()+(24*60*60*1000));
          let momentTo:any = moment(myDate).format('YYYY-DD-MM');

          if(momentTo > current) {
            let To:any = moment().format('YYYY-MM-DD HH:mm');
            var date = new Date(new Date(To).getTime());
            this.selectedTo = date;
            this.dateTo = date;
          } else {
            this.selectedTo = myDate;
            this.dateTo = myDate;
          }
          
        } else {
          this.dateTo = selected; 
        }
      })
  }

  async Alert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Your To date greater than present date, Please select again.',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }

}
