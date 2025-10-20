import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Language } from 'src/app/models/language.type';
import { Observable, map, of, startWith } from 'rxjs';
import { GoogleAPIService } from 'src/app/service/google-api.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,
     MatCardModule, 
     MatButtonModule, 
     MatIconModule, 
     MatToolbarModule,
     MatFormFieldModule,
     MatInputModule,
     ReactiveFormsModule,
     MatDividerModule,
     MatAutocompleteModule
    ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent implements OnInit {

  public userLoginForm !: FormGroup;
  public userSignUpForm !: FormGroup;
  public signInFlag = false;
  public sttLanguages !: Language[];
  public defaultLanguageOptions$!: Observable<Language[]>;

  constructor(private formBuilder: FormBuilder, private googleService: GoogleAPIService, private authService: AuthService){}

  ngOnInit(){
    this.initUserLoginForm();
    this.initUserSignUpForm();
    this.getLanguages();
  }

  public onSignInClick(){
    this.signInFlag = true;
  }

  public onSignUp(){
    const body = this.userSignUpForm.value;
    this.authService.userSingUp(body).subscribe((value) => {
      console.log('Successfully logged in');
    })
  }

  public displayFn(displayName: Language): string {
    return displayName && displayName.name ? displayName.name : '';
  }

  private initUserLoginForm(){
    this.userLoginForm = this.formBuilder.group({
      userName: this.formBuilder.control(''),
      password: this.formBuilder.control(''),
    });
  }

  private initUserSignUpForm(){
    this.userSignUpForm = this.formBuilder.group({
      name: this.formBuilder.control(""),
      email: this.formBuilder.control(""),
      defaultLanguage: this.formBuilder.control(""),
      password: this.formBuilder.control(""),
      conformPassword: this.formBuilder.control("")
    });
  }

  private getLanguages(){
    this.googleService.loadsttLanguageCodes().subscribe((value) => {
      let result = JSON.parse(JSON.stringify(value));
      this.sttLanguages = result.data.languages;    
    });
    this.defaultLanguageOptions$ =
    this.userSignUpForm.get('defaultLanguage')?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    ) ?? of([]);
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
