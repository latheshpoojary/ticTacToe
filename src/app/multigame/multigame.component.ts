import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-multigame',
  templateUrl: './multigame.component.html',
  styleUrls: ['./multigame.component.scss']
})
export class MultigameComponent {
  public show_join = false;
  form = new FormControl();
  id!: string | null;
  public userId!: number;
  public message = '';
  public loading = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
  }

  onClick(selectedField: string) {
    console.log(selectedField);
    this.loading = true;
    const obj = {
      roomID: this.form.value,
    };
    const formValue = this.form.value;
    if (selectedField === 'create') {
      this.http
        .post(`${environment.tunnerUrl}/createRoom`, obj)
        .subscribe((res:any) => {
          this.loading = false;
          if (res.status === 400) {
            this.message = "Opps ! the room already Exist";
            this.form.reset();
            return;
          }
          this.router.navigate(['/game-set', formValue, 1]);
          
        });
    }    
    else {
      this.userId = 2;
      this.http
        .put(`${environment.tunnerUrl}/joinRoom`, obj)
        .subscribe((res: any) => {
          this.loading = false;
          if (res.status === 400) {
            this.message = 'Opps! Room full';
            this.router.navigate(['multi']);
            return;
          } else {
            this.router.navigate(['/game-set', formValue, 2]);
          }
        });
    }
  }
}
