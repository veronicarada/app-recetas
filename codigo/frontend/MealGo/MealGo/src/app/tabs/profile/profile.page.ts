import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  template: '',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ProfilePage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
      await this.auth.logout();
    } finally {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}