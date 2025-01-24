import { Rotor } from './rotor.model';

export class Enigma {
  private _rotors: Rotor[];
  private _reflector: string;
  private alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(rotors: Rotor[], reflector: string) {
    this._rotors = rotors;
    this._reflector = reflector;
  }

  get rotors(): Rotor[] {
    return this._rotors;
  }
  //Rotate the Rotor
  rotateRotor(increment: boolean) {
    let rotate = true;
    if (increment) {
      for (let i = this._rotors.length - 1; i >= 0; i--) {
        if (rotate) {
          this._rotors[i].incrementPosition();
          //Check rotate if notch
          rotate =
            this._rotors[i].notch ===
            this.alphabet[this._rotors[i].position - 1];
        }
      }
    } else {
      for (let i = this._rotors.length - 1; i >= 0; i--) {
        if (rotate) {
          this._rotors[i].decrementPosition();
          //Check rotate if notch
          rotate =
            this._rotors[i].notch === this.alphabet[this._rotors[i].position];
        }
      }
    }
  }

  //Pass the character through the rotors
  private passThroughRotor(
    characterAscii: number,
    rotor: Rotor,
    reverse: boolean
  ): number {
    if (!reverse) {
      const index = (characterAscii + rotor.position) % 26; // 11 + 4 = 15 // 1 + 11 = 12
      const characterInRotorWire = rotor.wiring.charAt(index); // 'E' // 'Z'

      const indexToPassThroughNextRotor =
        (this.alphabet.indexOf(characterInRotorWire) - rotor.position + 26) %
        26;

      console.log('Out from Rotor: ', indexToPassThroughNextRotor);

      return indexToPassThroughNextRotor;
    }

    const characterInAlphabet = this.alphabet.charAt(
      (characterAscii + rotor.position) % 26
    );
    const indexInRotorWiring = rotor.wiring.indexOf(characterInAlphabet);
    return (indexInRotorWiring - rotor.position + 26) % 26;
  }

  //Pass the character through the reflector
  passThroughReflector(characterIndex: number): number {
    let character = this._reflector[characterIndex];

    for (let i = 0; i < this._reflector.length; i++) {
      if (this._reflector[i] === character && i != characterIndex) {
        return i;
      }
    }
    return -1;
  }

  //Function to encrypt the message
  public encryptMessage(message: string): string {
    console.log('Encrypting');
    console.log('message in ', message);
    let encryptedMessage = '';
    let index = 0;
    for (let i = 0; i < message.length; i++) {
      let character = message.charAt(i);
      this.rotateRotor(true);

      let characterAscii = this.alphabet.indexOf(character);
      //Pass through the rotors from right to left
      for (let j = this._rotors.length - 1; j >= 0; j--) {
        characterAscii = this.passThroughRotor(
          characterAscii,
          this._rotors[j],
          false
        );
      }

      //Pass through the reflector
      characterAscii = this.passThroughReflector(characterAscii);
      if (characterAscii === -1) {
        throw new Error('Error No character found in reflector');
      }

      //Pass through the rotors from left to right
      for (let j = 0; j < this._rotors.length; j++) {
        characterAscii = this.passThroughRotor(
          characterAscii,
          this._rotors[j],
          true
        );
      }
      character = this.alphabet.charAt(characterAscii);
      encryptedMessage += character;
    }

    console.log('encryptedMessage', encryptedMessage);
    return encryptedMessage;
  }

  public handleBackspace() {
    console.log('Handling Backspace');
    this.rotateRotor(false);
  }
}
