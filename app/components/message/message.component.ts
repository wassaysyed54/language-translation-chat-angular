import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule,
  MatChipsModule,
  MatIconModule
  ],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @ViewChild('senderAudioPlayer') senderAudioPlayer!: ElementRef;
  @ViewChild('senderAudioPlayer') receiversAudioPlayer!: ElementRef;


  @Input() message !: String;
  @Input() user !: String;
  @Input() timeStamp !: Date;
  @Input() chat !: String;
  @Input() audioUrl !: string;

  constructor() {}

  ngOnInit(){

  }

}
