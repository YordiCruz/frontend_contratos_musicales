import { Component, Injectable } from '@angular/core';
import { List } from './list/list';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-integrantes',
  templateUrl: './integrantes.html',
  styleUrls: [],
  imports: [ List]
})
export class Integrantes {

  
}
