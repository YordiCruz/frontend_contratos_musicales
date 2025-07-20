import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User implements OnInit {
  userService = inject(UserService)
  visible: boolean = false;

  users: any[] = [];

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    return this.userService.funListar().subscribe(
    (res: any) => {
      console.log(res);

      this.users = res
    }  
    );
  }

  showDialog(){
    this.visible = true
  }

  funGuardarUser(){
    this.userService.funGuardar(this.userForm.value).subscribe(
      (res) => {
        alert('Usuario Guardado');
      }
    )

  }



}
