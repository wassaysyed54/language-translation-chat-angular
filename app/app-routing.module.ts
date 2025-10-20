import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "*",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "",
    redirectTo: "miracle-chat/login",
    pathMatch: "full",
  },
  {
    title: "Miracle ChatBot | Sign In",
    path: "miracle-chat/sign-in",
    loadChildren: () => 
      import('./components/sign-in/sign-in.component')
  },
  {
    title: "Miracle ChatBot | Login",
    path: "miracle-chat/login",
    loadChildren: () => 
      import('./components/sign-in/sign-in.component')
  },
  {
    title: "Miracle ChatBot | Text Chat",
    path: "miracle-chat/text-chat",
    loadComponent: () =>
      import( './components/text-chat/chat.component')
  },
  {
    title: "Miracle ChatBot | Voice Chat",
    path: "miracle-chat/voice-chat",
    loadComponent: () => 
      import('./components/voice-chat/voice-chat.component')
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
