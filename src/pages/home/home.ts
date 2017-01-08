import { Component } from '@angular/core';

import { NavController, ModalController, NavParams, ViewController } from 'ionic-angular';

declare var fabric;
declare var Vivus;

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

  constructor(params: NavParams,  public viewCtrl: ViewController) {
    this.url = params.get('url');
  }

  ngOnInit() {
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
    this.wboard.setHeight(window.innerHeight * 0.9);
    this.wboard.freeDrawingBrush.width = 5;
  }

  play() {
    var data = this.wboard.toSVG({ suppressPreamble: true }, (svg) => {
      return svg.replace('stroke-dasharray: none;', '');
    });
    var url = window.URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));
    let profileModal = this.modalCtrl.create(RewriteModal, { url: url });
    profileModal.present();
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
