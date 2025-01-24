import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { Rotor } from '../../model/rotor.model';
import { Enigma } from '../../model/enigma.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'enigma-component',
  templateUrl: './enigma-component.html',
  styleUrl: './enigma-component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class EnigmaComponent {
  //Alphabet for the Enigma Machine
  alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //Rotor Settings
  firstRotorSetting: string = 'M';
  secondRotorSetting: string = 'C';
  thirdRotorSetting: string = 'K';

  //Find the Rotor Position
  firstRotorPosition: number = this.alphabet.indexOf(this.firstRotorSetting);
  secondRotorPosition: number = this.alphabet.indexOf(this.secondRotorSetting);
  thirdRotorPosition: number = this.alphabet.indexOf(this.thirdRotorSetting);
  //Create the Rotor
  //Left Rotor
  rotor1: Rotor = new Rotor(
    'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    'Q',
    this.firstRotorPosition
  );
  //Middle Rotor
  rotor2: Rotor = new Rotor(
    'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    'E',
    this.secondRotorPosition
  );
  //Right Rotor
  rotor3: Rotor = new Rotor(
    'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    'V',
    this.thirdRotorPosition
  );

  //Define the Reflector
  reflector: string = 'ABCDEFGDIJKGMKMIEBFTCVVJAT';

  //Create the Enigma Machine
  enigmaMachine: Enigma = new Enigma(
    [this.rotor1, this.rotor2, this.rotor3],
    this.reflector
  );

  //Variable for input message
  inputMessage: string = '';
  //Variable for encrypted message
  encryptedMessage: string = '';

  updateRotorPosition() {
    // Update the Rotor
    this.rotor1 = this.enigmaMachine.rotors[0];
    this.rotor2 = this.enigmaMachine.rotors[1];
    this.rotor3 = this.enigmaMachine.rotors[2];
  }

  updateRotorSetting() {
    //Update the rotors settings
    this.firstRotorSetting = this.alphabet.charAt(this.rotor1.position);
    this.secondRotorSetting = this.alphabet.charAt(this.rotor2.position);
    this.thirdRotorSetting = this.alphabet.charAt(this.rotor3.position);
  }

  encrypt(character: string) {
    // Encrypt the character and append it to the encrypted message
    const encryptedChar = this.enigmaMachine.encryptMessage(character);
    this.encryptedMessage += encryptedChar;
    // Update the rotor position
    this.updateRotorPosition();
    // Update the rotor setting
    this.updateRotorSetting();
  }
  //Create event listener for keyUp
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: any) {
    //Get the key pressed
    const key = event.key.toUpperCase();
    //Check if the key is an alphabet
    if (this.alphabet.includes(key)) {
      //Encrypt the message
      this.encrypt(key);
    }
    //Handle if key backspace is pressed
    else if (event.key === 'Backspace') {
      //If the encrypted message is empty, return
      if (this.encryptedMessage === '') {
        return;
      }
      //IF the last character is a space, just remove the space from the encrypted messageand dont increment the rotor position
      if (this.encryptedMessage.slice(-1) === ' ') {
        this.encryptedMessage = this.encryptedMessage.slice(0, -1);
        return;
      }
      //Remove the last character from the encrypted message
      this.encryptedMessage = this.encryptedMessage.slice(0, -1);
      //Call encrypt function to update the rotor position
      this.enigmaMachine.handleBackspace();
      //Update the rotor position
      this.updateRotorPosition();
      //Update the rotor setting
      this.updateRotorSetting();
    } else if (event.key === ' ') {
      this.encryptedMessage += ' ';
    }
  }
}
