import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  form = new FormControl();
  id!: string | null;
  public userId!: string | null;
  public message = '';
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = this.route.snapshot.paramMap.get('userID');
  }

  onClick() {
    console.log('clicked', this.form);
    const obj = {
      roomID: this.form.value,
    };
    const userID = this.userId;
    const formValue = this.form.value;
    if (this.id === 'create') {
      this.http
        .post(`${environment.tunnerUrl}/createRoom`, obj)
        .subscribe((res:any) => {
          console.log(res);
          if (res.status === 400) {
            this.message = "Opps ! the room already Exist";
            this.form.reset();
            return;
          }
          this.router.navigate(['/game-set', formValue, userID]);
          
        });
    } else {
      this.http
        .put(`${environment.tunnerUrl}/joinRoom`, obj)
        .subscribe((res: any) => {
          if (res.status === 400) {
            this.message = 'Opps! Room full';
            this.router.navigate(['multi']);
            return;
          } else {
            this.router.navigate(['/game-set', formValue, userID]);
          }
        });
    }
    console.log(userID);
  }
}
