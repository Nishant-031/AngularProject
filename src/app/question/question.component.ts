import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  public name: string= '';
  public questionList: any= [];
  public currecntQuestion: number= 0;
  public points: number= 0;
  counter= 60;
  correctAnswer: number= 0;
  incorrectAnswer: number= 0;
  interval$: any;
  progress: string= '';
  quizCompleted: boolean= false;
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name= localStorage.getItem('name')!;
    this.getQuestionData();
    this.startCounter();
  }
  getQuestionData(){
    this.questionService.getQuestionJson().subscribe(
      result=> {
        this.questionList= result.questions;
      }
    )
  }

  questionIncrement(){
    this.currecntQuestion++;
  }
  questionDecrement(){
    this.currecntQuestion--;
  }

  getAnswer(currecntQuestion : number,  option: any){
    if(currecntQuestion === this.questionList.length){
      this.quizCompleted= true;
      this.stopCounter();
    }
    if(option.correct){
      this.points += 10;
      this.correctAnswer++;
      setTimeout(()=> {
        this.currecntQuestion++;
        this.getProgressPercentage();
      }, 1000);
      
      
    }
    else{
      setTimeout(()=> {
        this.incorrectAnswer++;
        this.currecntQuestion++;
        this.getProgressPercentage();
      }, 1000);
      
      this.points -= 10;
    }
  }
  startCounter(){
    this.interval$= interval(1000).subscribe(
      result=>{
        this.counter--;
        if(this.counter == 0){
          this.currecntQuestion++;
          this.counter= 60;
          this.points-=10;
        }
      });
      setTimeout(()=>{
        this.interval$.unsubscribe();
      }, 600000);
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter= 0;
  }
  restartCounter(){
    this.stopCounter();
    this.counter= 60;
    this.startCounter();
  }
  resetCounter(){
    this.restartCounter();
    this.getQuestionData();
    this.points= 0;
    this.counter= 60;
    this.currecntQuestion= 0;
  }

  getProgressPercentage(){
    this.progress= ((this.currecntQuestion/ this.questionList.length)*100).toString();
    return this.progress;
  }

}
