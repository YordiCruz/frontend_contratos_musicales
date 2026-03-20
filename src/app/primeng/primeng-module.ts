import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import {TagModule} from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import {ButtonGroup} from 'primeng/buttongroup';
import {Divider} from 'primeng/divider';
import {Chip} from 'primeng/chip'





const modulos = [
 DialogModule,
    ButtonModule,
    InputTextModule,
    TableModule, 
    ProgressBarModule,
    ProgressSpinnerModule,
    BreadcrumbModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    TextareaModule,
    RadioButtonModule,
    InputNumberModule,
    DatePickerModule,
    CheckboxModule,
    FileUploadModule,
    TagModule,
    MultiSelectModule,
    ButtonGroup,
    Divider,
    Chip,
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
   ...modulos

  ],

  exports:[ CommonModule, 
    DialogModule,
   ...modulos
  
  ]
})
export class PrimengModule { }
