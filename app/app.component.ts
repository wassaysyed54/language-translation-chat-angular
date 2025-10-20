import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public subTitle: String = 'Google Cloud Speech-To-Text, Cloud Translation and Text-To-Speech APIs';

  constructor(public readonly router: Router){}

  ngOnInit() {
  } 
}