import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	gotoGithub() {
		window.open('https://www.github.com/ksyar2001/bitcoin-graph', "_blank");
	}
}
