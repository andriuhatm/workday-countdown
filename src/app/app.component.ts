import {Component, EventEmitter} from '@angular/core';
import {LocalStorageService} from './services/local-storage.service';
import moment from "moment/moment";
import {interval, map, Observable, shareReplay} from "rxjs";

interface timeComponents {
  secondsToDday: number;
  minutesToDday: number;
  hoursToDday: number;
  daysToDday: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public timerIsRunning: boolean = false;
  public startTime: Date | undefined;
  public endTime: Date | undefined;
  public timeLeft$: Observable<timeComponents> | undefined;


  constructor(private localStorage: LocalStorageService) {
    let data = this.localStorage.getData();
    if (data) {
      this.startTime = new Date(data.startTime);
      this.endTime = new Date(data.endTime);
      this.timerIsRunning = true;
      console.log('The timer is active...');
    } else {
      console.log('The timer is not active...');
    }
  }

  ngOnInit(): void {
    if (this.endTime) {
      console.log('Running the countdown...', this.endTime);
      this.runCountdown();
    }
  }

  runCountdown() {
    this.timeLeft$ = interval(1000).pipe(
      map(x => this.calcDateDiff(this.endTime)),
      shareReplay(1)
    );
  }

  runTimer() {
    this.startTime = moment().toDate();
    this.endTime = moment().add(8.5, 'hours').toDate();
    this.timerIsRunning = true;

    this.localStorage.setData({
      startTime: this.startTime,
      endTime: this.endTime
    });

    this.runCountdown();
  }

  clearTimer() {
    this.timerIsRunning = false;
    this.localStorage.removeData();

    this.startTime = undefined;
    this.endTime = undefined;
    this.timeLeft$ = undefined;
  }

  calcDateDiff(endDay: Date = new Date(2024, 0, 30)): timeComponents {
    const dDay = endDay.valueOf();

    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const daysToDday = Math.floor(
      timeDifference /
      (milliSecondsInASecond * minutesInAnHour * secondsInAMinute * hoursInADay)
    );

    const hoursToDday = Math.floor(
      (timeDifference /
        (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
      hoursInADay
    );

    const minutesToDday = Math.floor(
      (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
      secondsInAMinute
    );

    const secondsToDday =
      Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

    return {secondsToDday, minutesToDday, hoursToDday, daysToDday};
  }

}
