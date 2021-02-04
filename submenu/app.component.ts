import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSubmenu:any;
  public appPages = [
    { title: 'Inbox',url: '#', icon: 'mail',submenu:[
      { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
      { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
      { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    ]
            },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane',submenu:[
      { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
      { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
      { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    ] },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart', submenu:[]},
    { title: 'Archived', url: '/folder/Archived', icon: 'archive', submenu:[]},
    { title: 'Trash', url: '/folder/Trash', icon: 'trash', submenu:[]},
    { title: 'Spam', url: '/folder/Spam', icon: 'warning', submenu:[]},
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  menuItemHandler(i:any){
      var v = document.getElementById('showSubmenu'+i).classList.toggle('visible');
    // this.showSubmenu = !this.showSubmenu+i;
  }
  
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
  }

}
