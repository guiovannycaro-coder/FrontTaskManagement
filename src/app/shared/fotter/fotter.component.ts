import { Component } from '@angular/core';

@Component({
  selector: 'app-fotter',
  standalone: false,
  templateUrl: './fotter.component.html',
  styleUrl: './fotter.component.css'
})
export class FotterComponent {
  year = new Date().getFullYear();
}

