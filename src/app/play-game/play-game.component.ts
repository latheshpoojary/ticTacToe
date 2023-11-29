import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import * as confetti from 'confettis';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogElementsExampleDialogComponent } from '../dialog-elements-example-dialog/dialog-elements-example-dialog.component';
import {
  trigger,
  state,
  animate,
  style,
  transition,
} from '@angular/animations';
let socket = io('https://gz7582r6-6000.inc1.devtunnels.ms');

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'scale(1)' })),
      transition('void<=>*', animate(500)),
    ]),
  ],
})
export class PlayGameComponent implements OnInit {
  private room_id!: string | null;
  public activePlayer = 'X';
  public flag = true;
  public gameArray = Array(9).fill(null);
  public turn = 'X';
  private uniqueUserId!: string | null;
  public user_id: string | null;
  public disable = true;
  public message = '';
  public showPopUp = false;
  public winnerArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  partyInterval: any;

  constructor(
    private route: ActivatedRoute,
    private change: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.room_id = this.route.snapshot.paramMap.get('room-id');
    this.user_id = this.route.snapshot.paramMap.get('userID');
  }

  ngOnInit(): void {
    console.log('ng on init called ');
   

    socket.on('disconnect', (reason) => {
      console.log('Disconnected. Reason:', reason);
    });
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
    socket.on('connect', () => {
      console.log('connected');

      socket.emit('users-connect', {
        userId: this.uniqueUserId,
        roomId: this.room_id,
      });
    });

    this.uniqueUserId = `${this.room_id}${this.user_id}`;
    this.change.detectChanges();

    let res = socket.on(`${this.room_id}`, (res: any) => {
      console.log(res, 'res from the socket');
      this.turn = res.turn;
      this.gameArray[res.index] = res.value;
      this.change.detectChanges();
      for (const element of this.winnerArray) {
        let [a, b, c] = element;
        if (
          this.gameArray[a] &&
          this.gameArray[a] === this.gameArray[b] &&
          this.gameArray[b] === this.gameArray[c]
        ) {
          this.message = 'The winner is X';
          this.showPopUp = true;
          this.change.detectChanges();
          console.log('pop up', this.showPopUp);

          setInterval(() => this.partyTime(), 50);
          return;
        }
        if (!this.gameArray.includes(null)) {
          this.message = 'Draw';
        }
      }
    });
    console.log("res message from socket ",res);
    
  }

  onClick(box: any, index: number) {
    this.showPopUp = true;
    this.change.detectChanges();
    console.log('clicked here');
    console.log(`${this.room_id}2`, this.turn);

    console.log(this.uniqueUserId === `${this.room_id}2` && this.turn === 'O');

    // clearInterval(this.partyInterval)
    if (this.uniqueUserId === `${this.room_id}1` && this.turn === 'X') {
      console.log('if block');

      socket.emit('ongame', {
        userId: this.uniqueUserId,
        index,
        value: 'X',
        turn: 'O',
      });
      // this.gameArray[index] = 'X';
      this.activePlayer = 'O';
      this.flag = !this.flag;
    } else if (this.uniqueUserId === `${this.room_id}2` && this.turn === 'O') {
      console.log('else block');
      socket.emit('ongame', {
        userId: this.uniqueUserId,
        index,
        value: 'O',
        turn: 'X',
      });
      // this.gameArray[index] = 'O';
      this.activePlayer = 'X';
      this.flag = true;
    }
  }

  partyTime() {
    const minConfettiScale = 0.5;
    const maxConfettiScale = 1;

    const minConfettiSpeed = 20;
    const maxConfettiSpeed = 30;

    const minConfettiGravity = 0.6;
    const maxConfettiGravity = 1.1;

    const colors = ['#3934c2', '#34c242', '#f32424', '#e5f324'];
    confetti.create({
      x: 0.001,
      y: 0.5,
      count: 3,
      gravity: [
        randomNumber(minConfettiGravity, maxConfettiGravity),
        randomNumber(minConfettiGravity, maxConfettiGravity),
        randomNumber(minConfettiGravity, maxConfettiGravity),
      ],
      ticks: 200,
      scale: [
        randomNumber(minConfettiScale, maxConfettiScale),
        randomNumber(minConfettiScale, maxConfettiScale),
        randomNumber(minConfettiScale, maxConfettiScale),
      ],
      speed: randomNumber(minConfettiSpeed, maxConfettiSpeed),
      decay: 0.95,
      spread: 50,
      angle: 50,
      shapes: ['square', 'ellipse'],
      colors: colors,
    });

    // Right Confetti
    confetti.create({
      x: 1.999,
      y: 0.5,
      count: 3,
      gravity: [
        randomNumber(minConfettiGravity, maxConfettiGravity),
        randomNumber(minConfettiGravity, maxConfettiGravity),
        randomNumber(minConfettiGravity, maxConfettiGravity),
      ],
      ticks: 200,
      scale: [
        randomNumber(minConfettiScale, maxConfettiScale),
        randomNumber(minConfettiScale, maxConfettiScale),
        randomNumber(minConfettiScale, maxConfettiScale),
      ],
      speed: randomNumber(minConfettiSpeed, maxConfettiSpeed),
      decay: 0.95,
      spread: 50,
      angle: 130,
      shapes: ['square', 'ellipse'],
      colors: colors,
    });

    function randomNumber(min: any, max: any) {
      return Math.random() * (max - min) + min;
    }
  }

  openDialog() {
    this.dialog.open(DialogElementsExampleDialogComponent);
  }

  resetMatrix() {
    this.showPopUp = false;
    this.change.detectChanges();
  }

}
