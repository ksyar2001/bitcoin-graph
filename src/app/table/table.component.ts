import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections'; 

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
	private _stats = new BehaviorSubject<Data[]>([]);
	@Input()
	set stats(value) {
		this._stats.next(value);
	}
	get stats() {
		return this._stats.getValue();
	}
	
	displayedColumns = ['market', 'value', 'action', 'change'];
	dataFetcher: DataFetcher | null;
	dataSource: FetchDataSource | null;


  constructor() {
  }

  ngOnInit() {
  	this._stats.subscribe(res => {
  		this.dataFetcher = new DataFetcher(res);
  		this.dataSource = new FetchDataSource(this.dataFetcher);
  	})
  }
}

export interface Data {
	market: string;
	value: number;
	action: string;
	change: number;
}

export class DataFetcher {
	dataChange: BehaviorSubject<Data[]> = new BehaviorSubject<Data[]>([]);
	get data(): Data[] { return this.dataChange.value }

	constructor(data) {
		this.dataChange.next(data);
	}
}

export class FetchDataSource extends DataSource<any> {
	constructor(private _dataFetcher: DataFetcher) {
		super();
	}

	connect(): Observable<Data[]> {
		return this._dataFetcher.dataChange;
	}
	disconnect() {}
}
