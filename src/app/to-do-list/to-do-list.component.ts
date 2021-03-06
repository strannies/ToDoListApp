import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { DatabaseService } from '../services/database.service';
import { Chore } from '../models/chore.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})

export class ToDoListComponent{

	currentUser: string;
	choresList: Chore[] = [];
	choreDescription: string;
	chorecount;
	choreAlreadyExists: boolean;
	
	

	constructor(private userService: UserService, 
			private databaseService: DatabaseService){
	}

	ngOnInit(){
		this.userService.currentUser.subscribe(
			(currentUser:string) => {
				this.currentUser = currentUser;
			}
		);

		this.databaseService.currentUserChores.subscribe(
			(resultList: Chore[]) => this.choresList = resultList
		);

		this.databaseService.choreAlrExists.subscribe(
			(result) => this.choreAlreadyExists = result
		);

	}

	displayChores(){
			return this.databaseService.getChores().then(
				(result) => {
					this.choresList = result;
				}
			);
	}

	onAddChore(f: NgForm){
		this.databaseService.storeChore(
				this.currentUser, f.value.choreTitle, f.value.choreDescription);

		if(this.databaseService.addedChoreExists == true){
			this.databaseService.choreAlrExists.emit(true);
		} else {
			this.displayChores();
			this.databaseService.currentChoreCount.emit(
			this.databaseService.getChoreCount(this.currentUser));
			f.setValue({
				choreTitle: "",
				choreDescription: ""
			});
			this.databaseService.choreAlrExists.emit(false);
		}
	}

	onDeleteChore(chore){
		this.databaseService.deleteChore(chore, this.currentUser);
		this.displayChores();
		this.databaseService.currentChoreCount.emit(
				this.databaseService.getChoreCount(this.currentUser));
	}


}