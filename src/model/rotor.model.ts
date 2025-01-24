export class Rotor {
  private _wiring: string;
  private _notch: string;
  private _position: number;

  constructor(wiring: string, notch: string, position: number) {
    this._wiring = wiring;
    this._notch = notch;
    this._position = position;
  }

  //Getter Und Setter
  get wiring(): string {
    return this._wiring;
  }
  set wiring(value: string) {
    this._wiring = value;
  }
  get notch(): string {
    return this._notch;
  }
  set notch(value: string) {
    this._notch = value;
  }
  get position(): number {
    return this._position;
  }
  set position(value: number) {
    this._position = value;
  }

  //Increment Position
  incrementPosition() {
    this._position = (this._position + 1) % 26;
  }

  decrementPosition() {
    this._position = (this._position - 1 + 26) % 26;
  }
}
