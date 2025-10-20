import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MessageComponent } from '../message/message.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Language } from 'src/app/models/language.type';
import { Observable, map, of, startWith } from 'rxjs';
import { GoogleAPIService } from 'src/app/service/google-api.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Message } from 'src/app/models/message.type';

@Component({
  selector: 'app-voice-chat',
  standalone: true,
  imports: [CommonModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MessageComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressBarModule,
  ],
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.scss']
})
export default class VoiceChatComponent implements OnInit{

  @ViewChild('audioPlayerOne') audioPlayerOne!: ElementRef;
  @ViewChild('audioPlayerTwo') audioPlayerTwo!: ElementRef;

  
  public translateForm !: FormGroup;
  public conversationCardOne: Message[] = [];
  public conversationCardTwo: Message[] = [];
  public sttLanguages !: Language[];
  public sourceLanguageOptions$!: Observable<Language[]>;
  public targetLanguageOptions$!: Observable<Language[]>
  public showMicButtonOne: Boolean = true;
  public showMicButtonTwo: Boolean = true;
  public showAudioPlayerOne: Boolean = false;
  public showAudioPlayerTwo: Boolean = false;
  public isLoading: Boolean = false;
  public isLoadingTwo: Boolean = false;

  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  private audioBlobOne = new Blob();
  private audioBlobTwo = new Blob();


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

  public startMessageRecordingCardOne() {
    this.showMicButtonOne = false;
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlobOne = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioChunks = [];
        const audioUrl = URL.createObjectURL(this.audioBlobOne);
        this.audioPlayerOne.nativeElement.src = audioUrl;
        this.audioPlayerOne.nativeElement.play();
      };

      this.mediaRecorder.start();
    })
    .catch((error) => console.error('Error accessing microphone:', error));
  }

  public stopMessageRecordingCardOne(){
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.showAudioPlayerOne = true;
    }
  }

  public sendMessageRecordingCardOne(){
    this.showMicButtonOne = true;
    this.showAudioPlayerOne = false;
    this.isLoading = true;

    const sourceLanguage = this.translateForm.get('sourceLanguageSelect')?.value.languageCodes;
    const targetLanguage = this.translateForm.get('targetLanguageSelect')?.value.languageCodes;

    let newMessage: Message = {
      text: URL.createObjectURL(this.audioBlobOne),
      timeStamp: new Date(),
      user: 'sender'
    }
    this.conversationCardOne.push(newMessage);

    this.googleService.translateSpeech(this.audioBlobOne, targetLanguage, sourceLanguage).subscribe((text) => {
      this.isLoading = false;
      this.synthesizeTranslatedSpeech(text.data);
    });
  }

  public synthesizeTranslatedSpeech(text: string) {
    const targetLanguage = this.translateForm.get('targetLanguageSelect')?.value.languageCodes
    this.googleService.audioPlayBack(text, targetLanguage).subscribe((audioData) => {
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      let object: Message = {
        text: URL.createObjectURL(audioBlob),
        timeStamp: new Date(),
        user: 'receiver'
      }
      this.conversationCardTwo.push(object);
    });
  }

  public startMessageRecordingCardTwo() {
    this.showMicButtonTwo = false;
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlobTwo = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioChunks = [];
        const audioUrl = URL.createObjectURL(this.audioBlobTwo);
        this.audioPlayerTwo.nativeElement.src = audioUrl;
        this.audioPlayerTwo.nativeElement.play();
      };

      this.mediaRecorder.start();
    })
    .catch((error) => console.error('Error accessing microphone:', error));
  }

  public stopMessageRecordingCardTwo(){
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.showAudioPlayerTwo = true;
    }
  }

  public sendMessageRecordingCardTwo(){
    this.showMicButtonTwo = true;
    this.showAudioPlayerTwo = false;
    this.isLoadingTwo = true; 

    const sourceLanguage = this.translateForm.get('sourceLanguageSelect')?.value.languageCodes;
    const targetLanguage = this.translateForm.get('targetLanguageSelect')?.value.languageCodes;
    let newMessage: Message = {
      text: URL.createObjectURL(this.audioBlobTwo),
      timeStamp: new Date(),
      user: 'sender'
    }
    this.conversationCardTwo.push(newMessage);
    this.googleService.translateSpeech(this.audioBlobTwo,sourceLanguage, targetLanguage).subscribe((text) => {
      this.isLoadingTwo = false;
      this.synthesizeSpeech(text.data);
    });
  }

  public synthesizeSpeech(text: string){
    const sourceLanguage = this.translateForm.get('sourceLanguageSelect')?.value.languageCodes;

    this.googleService.audioPlayBack(text, sourceLanguage).subscribe((audioData) => {
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      let object: Message = {
        text: URL.createObjectURL(audioBlob),
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
