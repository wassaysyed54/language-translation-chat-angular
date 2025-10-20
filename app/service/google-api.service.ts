import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAPIService {
  URL = 'http://localhost:8080/'
  constructor( private http: HttpClient) { }

  public translateText(text: string, targetLanguage: string, sourceLanguage: string) {
    return this.http.post( this.URL + 'translate', { text, targetLanguage, sourceLanguage });
  }

  public translateSpeech(audioBlob: Blob, targetLanguage:string, sourceLanguage: string): Observable<any>{
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
    formData.append('target_language', targetLanguage);
    formData.append('source_language', sourceLanguage);
    console.log('source:' , sourceLanguage, 'target: ', targetLanguage);
    return this.http.post(this.URL + 'stt', formData );
  }

  public audioPlayBack(text: string, targetLanguage: string ){
    return this.http.post(this.URL + 'tts', { text, targetLanguage }, { responseType:"arraybuffer"});
  }

  public loadsttLanguageCodes(){
    return this.http.get(this.URL+'stt-languagecodes');
  }

  public loadttsLanguageCodes(){
    return this.http.get(this.URL+'tts-languagecodes');
  }
}
