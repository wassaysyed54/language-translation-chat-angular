import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MessageComponent } from '../message/message.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Language } from 'src/app/models/language.type';
import { Observable, map, of, startWith } from 'rxjs';
import { GoogleAPIService } from 'src/app/service/google-api.service';
import { MatDividerModule } from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Message } from 'src/app/models/message.type';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MessageComponent,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  MatDividerModule,
  MatSelectModule,
  MatAutocompleteModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export default class ChatComponent implements OnInit {

  public translateForm !: FormGroup;
  public conversationCardOne: Message[] = [];
  public conversationCardTwo: Message[] = [];
  public sttLanguages !: Language[];
  public sourceLanguageOptions$!: Observable<Language[]>;
  public targetLanguageOptions$!: Observable<Language[]>

  constructor( private formBuilder: FormBuilder, private googleService: GoogleAPIService) {}

  ngOnInit() {
    this.initTextTranslation();
    this.getLanguages();

    this.sourceLanguageOptions$ =
    this.translateForm.get('sourceLanguageSelect')?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    ) ?? of([]);

    this.targetLanguageOptions$ = 
    this.translateForm.get('targetLanguageSelect')?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    ) ?? of([]);
  }

  public sendMessageCardOne(){
    let newMessage : Message = {
      text: this.translateForm.get('textToTranslate')?.value,
      timeStamp: new Date(),
      user: 'sender'
    }
    const sourceLanguage = this.translateForm.get('sourceLanguageSelect')?.value.languageCodes;
    const targetLanguage = this.translateForm.get('targetLanguageSelect')?.value.languageCodes;
    this.conversationCardOne.push(newMessage);
    this.translateForm.get('textToTranslate')?.reset();

    this.googleService.translateText(newMessage.text, targetLanguage , sourceLanguage)
    .subscribe((text: any) => {
      let object: Message = {
        text: text.TRASLATION,
        timeStamp: new Date(),
        user: 'receiver'
      }
      this.conversationCardTwo.push(object);
    });

  }

  public sendMessageCardTwo(){
    let newMessage : Message = {
      text: this.translateForm.get('ttt')?.value,
      timeStamp: new Date(),
      user: 'sender'
    }
    const sourceLanguage = this.translateForm.get('sourceLanguageSelect')?.value.languageCodes;
    const targetLanguage = this.translateForm.get('targetLanguageSelect')?.value.languageCodes;
    console.log(sourceLanguage, targetLanguage)
    this.conversationCardTwo.push(newMessage);
    this.translateForm.get('ttt')?.reset();

    this.googleService.translateText(newMessage.text, sourceLanguage, targetLanguage)
    .subscribe((text: any) => {
      let object: Message = {
        text: text.TRASLATION,
        timeStamp: new Date(),
        user: 'receiver'
      }
      this.conversationCardOne.push(object);
    });
  }

  public displayFn(displayName: Language): string {
    return displayName && displayName.name ? displayName.name : '';
  }

  private initTextTranslation(){
    this.translateForm = this.formBuilder.group({
      textToTranslate : this.formBuilder.control(''),
      ttt : this.formBuilder.control(''),
      sourceLanguageSelect: this.formBuilder.control(""),
      targetLanguageSelect: this.formBuilder.control("")
    });
  }

  private getLanguages(){
    this.googleService.loadsttLanguageCodes().subscribe((value) => {
      let result = JSON.parse(JSON.stringify(value));
      this.sttLanguages = result.data.languages;    
    });
  }

  private _filter(value: string | Language): Language[] {
    const filterValue =
    typeof value === "string"
      ? value.toLowerCase()
      : value.name.toLowerCase();
    const filteredServices = this.sttLanguages?.filter(
      (option) =>
        option.name.toLowerCase().includes(filterValue)
    );
    return filteredServices;
  }

}
