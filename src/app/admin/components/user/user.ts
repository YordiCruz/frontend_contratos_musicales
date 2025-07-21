import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from '../../interfaces/user-interface';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  userService = inject(UserService);
  visible: boolean = false;

  users = signal<UserInterface[]>([]);

  user_id = -1

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    return this.userService.funListar().subscribe((res: any) => {
      console.log(res);
      //this.users = res
      this.users.set(res.data);
    });
  }

  showDialog() {
    this.visible = true;
  }

  funGuardarUser() {

    if (this.user_id > 0) {
      //edicion
      this.userService.funModificar(this.user_id, this.userForm.value).subscribe(
        (res) => {
          this.getUsers();
          this.visible = false;
  
          this.userForm.reset();
          Swal.fire({
            title: 'Usuario actualizado!',
            text: 'Ok para continuar!',
            icon: 'success',
          });
        
      })
    }else{

      this.userService.funGuardar(this.userForm.value).subscribe((res) => {
        this.getUsers();
        this.visible = false;
  
        this.userForm.reset();
        Swal.fire({
          title: 'Good job!',
          text: 'You clicked the button!',
          icon: 'success',
        });
      });
      this.user_id = -1

    }

  }

  funEditar(user: any) {
    this.user_id = user.id

    this.userForm = new FormGroup({
    name: new FormControl(user.name, [Validators.required]),
    email: new FormControl(user.email, [Validators.required, Validators.email]),
    password: new FormControl(user.password, [Validators.required]),
  });


    this.visible = true;
    
  }

  funEliminar(id: number) {
    this.userService.funEliminar(id).subscribe(
      (res) => {
      this.getUsers();

      Swal.fire({
        title: 'Usuario eliminado!',
        text: 'ok para continuar!',
        icon: 'success',
      })
    });
  }

}
