import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnigmaComponent } from '../component/enigma-component/enigma-component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <enigma-component></enigma-component>
    </div>
  `,
  styleUrl: './app.component.scss',
  imports: [EnigmaComponent],
})
export class AppComponent {}
