import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  form = new FormControl();
  id!: string | null;
  public userId!: string | null;
  constructor(private http: HttpClient, private route: ActivatedRoute,private router:Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = this.route.snapshot.paramMap.get('userID');

  }

  onClick() {
    console.log('clicked', this.form);
    const obj = {
      roomID: this.form.value,
    };
    if (this.id === 'create') {
      this.http
        .post('https://gz7582r6-6000.inc1.devtunnels.ms/createRoom', obj)
        .subscribe((res) => {
          console.log(res);
        });
    }
    else {
      this.http
        .put('https://gz7582r6-6000.inc1.devtunnels.ms/joinRoom', obj)
        .subscribe((res:any) => {
          console.log(res);
        });
    }
    const userID = this.userId;
    const formValue = this.form.value;
    console.log(userID);
    
    this.router.navigate(['/game-set',formValue,userID]);
  }
}
