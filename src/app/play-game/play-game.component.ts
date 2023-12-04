import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import * as confetti from 'confettis';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
})
export class PlayGameComponent implements OnInit {
  private socket: any;
  private room_id!: string | null;
  public activePlayer = 'X';
  public flag = true;
  public gameArray = Array(9).fill(null);
  public turn = 'X';
  private uniqueUserId!: string | null;
  public user_id: string | null;
  public disable = true;
  public message = '';
  public cheerMessage = '';
  public showPopUp = false;
  public currentPlayer = '';
  public counterX: any;
  public counterO: any;
  public popUpImage!: any;
  [key: string]: any;
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
  counterInterval: any;

  constructor(
    private route: ActivatedRoute,
    private change: ChangeDetectorRef
  ) {
  this.socket = io(environment.tunnerUrl);

    this.room_id = this.route.snapshot.paramMap.get('room-id');
    this.user_id = this.route.snapshot.paramMap.get('userID');
  }

  ngOnInit(): void {
    console.log('ng on init called ');
    this.socket.on('disconnect', (reason:any) => {
      console.log('Disconnected. Reason:', reason);
    });
    this.socket.on('connect_error', (error:any) => {
      console.error('Connection error:', error);
    });
    this.socket.on('connect', () => {
      console.log('connected');

      this.socket.emit('users-connect', {
        userId: this.uniqueUserId,
        roomId: this.room_id,
      });
    });

    this.uniqueUserId = `${this.room_id}${this.user_id}`;
    this.change.detectChanges();

   this.socket.on(`${this.room_id}`, (res: any) => {
      console.log(res);
      this.turn = res.turn;
      if (res.message) {
        this.showPopUp = false;
        this.counterO = 0;
        this.counterX = 0;
        this.gameArray.fill(null);
        this.turn = 'X';
        this.change.detectChanges();
      }
      clearInterval(this.counterInterval);
      if (this.turn === 'X') {
        this.counterO = 0;
        this.counterX = 0;
        this.startTimer('counterO');
      } else if (this.turn === 'O') {
        this.counterX = 0;
        this.counterO = 0;
        this.startTimer('counterX');
      }
      this.currentPlayer = res.value;
      this.gameArray[res.index] = res.value;
      this.change.detectChanges();
      for (const element of this.winnerArray) {
        let [a, b, c] = element;
        if (
          this.gameArray[a] &&
          this.gameArray[a] === this.gameArray[b] &&
          this.gameArray[b] === this.gameArray[c]
        ) {
          this.matchAnnouncement();
          return;
        }
        if (!this.gameArray.includes(null)) {
          this.showPopUp = true;
          this.message = "It's a draw";
          this.cheerMessage = "Both players are evenly matched! Let's go for a rematch!"
          this.popUpImage = '../../assets/image/draw.jpg';
        }
      }
    });
  }

  onClick(box: any, index: number) {
    if (this.uniqueUserId === `${this.room_id}1` && this.turn === 'X') {
      this.socket.emit('ongame', {
        userId: this.uniqueUserId,
        index,
        value: 'X',
        turn: 'O',
        roomId: this.room_id,
      });
      // this.gameArray[index] = 'X';
      this.activePlayer = 'O';
      this.flag = !this.flag;
    } else if (this.uniqueUserId === `${this.room_id}2` && this.turn === 'O') {
      this.socket.emit('ongame', {
        userId: this.uniqueUserId,
        index,
        value: 'O',
        turn: 'X',
        roomId: this.room_id,
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

  resetMatrix() {
    clearInterval(this.counterInterval);
    clearInterval(this.partyInterval);
    this.socket.emit('playagain', { roomId: this.room_id });
  }

  startTimer(counter: string) {
    
    if (counter === 'counterX') {
      this.counterInterval = setInterval(() => {
        if (this.counterO === 450) {
          this.counterO = 0;
          console.log("counterX called");
          this.matchAnnouncement();
          clearInterval;
        } else {
          this.counterO += 1;
          this.change.detectChanges();
        }
      }, 30);
    } else if (counter === 'counterO') {
      this.counterInterval = setInterval(() => {
        if (this.counterX === 450) {
          this.counterX = 0;
          this.matchAnnouncement();
          clearInterval;
        } else {
          this.counterX += 1;
          this.change.detectChanges();
        }
      }, 30);
    }
  }

  matchAnnouncement() {
    console.log("matchAnnouncement called");
    
    this.showPopUp = true;
    if (
      (this.currentPlayer === 'X' &&
        this.uniqueUserId === `${this.room_id}1`) ||
      (this.currentPlayer === 'O' && this.uniqueUserId === `${this.room_id}2`)
    ) {
      this.popUpImage = '../../assets/image/celebrate.webp';
      this.message = 'Congratulation ! You won the Match';
      this.cheerMessage = "You're the Tic Tac Toe champion! 🏆";
      this.partyInterval = setInterval(() => this.partyTime(), 50);
    } else {
      this.popUpImage = '../../assets/image/sadFace.png';
      this.message = 'Better luck in next time';
      this.cheerMessage = 'Play again to get revenge😡';
    }
    this.change.detectChanges();
  }
}