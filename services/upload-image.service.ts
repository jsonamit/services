import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  filename: any;
  base64Data: any;
  cameraData: any;

  constructor(private camera: Camera,) { }

  // image base64
  base64(event: any) {
    let dateObj = new Date();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let cdate = day + "_" + month + "_" + year;
    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getMilliseconds();
    let currentTime = cdate + "_" + hour + "_" + minutes + "_" + seconds;
    let filename = currentTime + ".jpg";

    let reader = new FileReader();
    const file = event.target.files[0];
    // let finename = file.name;
    reader.onload = () => {
      let value = (<string>reader.result).split(',')[1];
      let base64ImageUrl = 'data:image/jpeg;base64,' + value;
      this.base64Data = { base64: value, base64ImageUrl: base64ImageUrl, name: filename };
    };
    reader.readAsDataURL(file);
  }

  // get base64 of image with name
  getBase64() {
    return this.base64Data;
  }

  // base64 with Camera
  openCamera() {
    let dateObj = new Date();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let cdate = day + "_" + month + "_" + year;
    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getMilliseconds();
    let currentTime = cdate + "_" + hour + "_" + minutes + "_" + seconds;
    let filename = currentTime + ".jpg";

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = imageData;
      let base64ImageUrl = 'data:image/jpeg;base64,' + imageData;
      this.cameraData = { base64: base64Image, base64ImageUrl: base64ImageUrl, name: filename };
    });
  }

  // get base64 of image with name
  getCameraBase64(data) {
    return this.cameraData;
  }

  // upload image with validation(height,width)
  uploadImage(event:any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    const URL = window.URL || window.webkitURL;
    const Img = new Image();

    const filesToUpload = (event.target.files);
    Img.src = URL.createObjectURL(filesToUpload[0]);

    Img.onload = (e: any) => {
      const height = e.path[0].height;
      const width = e.path[0].width;
      if(height == 500 && width==1000) {
        reader.onload = () => {
          let value = (<string>reader.result).split(',')[1];
          let filename = file.name;
          let base64 = value;
          let fileData = {
            file : base64,
            file_name : filename,
            base64ImageUrl : 'data:image/jpeg;base64,' + value
          };
        };
        reader.readAsDataURL(file);
      } else {
        alert('image should be this format 500*1000');
        return false;
      }

    }
  }

}
