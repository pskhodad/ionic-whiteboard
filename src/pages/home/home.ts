import { Component } from '@angular/core';

import { NavController, ModalController, NavParams, ViewController } from 'ionic-angular';

import { DomSanitizer } from '@angular/platform-browser';

declare var fabric;
declare var Vivus;

@Component({
  template: `
<ion-header>

  <ion-navbar>
    <ion-title>Replay</ion-title>
  </ion-navbar>

</ion-header>


<ion-content>
<!--
    <div id="my-div-page" [innerHTML]="url"></div>
-->    
    <object id="my-svg" type="image/svg+xml" [data]="url"></object>
    <ion-fab right bottom>
      <button (click)="share()" ion-fab><ion-icon name="share"></ion-icon></button>
    </ion-fab>
</ion-content>
  `
})
export class ReplayPage {

  url: any;
  theVivus: any;
  showSVG: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _sanitizer: DomSanitizer) {
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.navParams.get('url'));
    this.showSVG = false;
  }

  ionViewDidEnter() {
    this.showSVG = true;
    this.theVivus = new Vivus('my-svg', { duration: 200, type: 'oneByOne' }, () => {
      console.log('Vivus ready callback');
    });
  }

  ionViewWillLeave() {
    this.showSVG = false;
    this.theVivus.stop();
  }

}


@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Replay
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div id="my-div"></div>
    <ion-fab right bottom>
      <button (click)="share()" ion-fab><ion-icon name="share"></ion-icon></button>
    </ion-fab>

  </ion-content>
  `
})
export class RewriteModal {

  url: any;
  theVivus: any;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.url = params.get('url');
  }

  ngAfterViewInit() {
    this.theVivus = new Vivus('my-div', { duration: 200, type: 'oneByOne', file: this.url }, () => {
      console.log('Vivus ready callback');
    });
  }

  dismiss() {
    this.theVivus.stop();
    this.viewCtrl.dismiss();
  }

  share() {
  }

}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wboard: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    // console.log(fabric);
    // console.log(Vivus);
    // console.log(window.location.pathname);
  }

  ngAfterViewInit() {
    this.wboard = new fabric.Canvas('wboard', {
      isDrawingMode: true
    });
    this.wboard.setWidth(window.innerWidth * 0.95);
    this.wboard.setHeight(window.innerHeight * 0.8);
    this.wboard.freeDrawingBrush.width = 5;
  }

  play() {
    var data = this.wboard.toSVG({ suppressPreamble: true }, (svg) => {
      return svg.replace('stroke-dasharray: none;', '');
    });
    console.log(data);
    var url = window.URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));

    this.navCtrl.push(ReplayPage, {
      url: url
    });


    // let profileModal = this.modalCtrl.create(RewriteModal, { url: url });
    // profileModal.present();
    // var url = window.URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));
    // console.log(url);
    /*
    setTimeout(function () {
      new Vivus('my-div', { duration: 200, type: 'oneByOne', file: url }, function () { console.log('completed'); });
    });
    */
  }

  clear() {
    this.wboard.clear();
  }

}
