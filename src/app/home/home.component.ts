import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/services/HttpClient';
import { ServerService } from '../shared/services/server.service';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import 'd3-transition';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	private width: number;
  	private height: number;
  	private margin = {top: 20, right: 20, bottom: 30, left: 100};
  	private STATISTICS = [
	  {letter: "A", frequency: 12350},
	  {letter: "B", frequency: 10000},
	  {letter: "C", frequency: 10000},
	  {letter: "D", frequency: 10000},
	  {letter: "E", frequency: 10000},
	  ];

  	private x: any;
  	private y: any;
  	private svg: any;
  	private g: any;


  constructor(private server: ServerService) {
  	this.server.getResponse().subscribe(res => console.log(res));
  }

  // ngOnInit() {
  // 	this.server.getResponse().subscribe(res => console.log(res))
  // }

  ngOnInit() {
  	this.server.getMessages().subscribe(message => console.log(message));
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  private initSvg() {
    this.svg = d3.select("svg");
    this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    this.g = this.svg.append("g")
                     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.STATISTICS.map((d) => d.letter));
    this.y.domain([9000, d3Array.max(this.STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis() {
    this.g.append("g")
          .attr("class", "axis x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
          .attr("class", "axis y")
          .call(d3Axis.axisLeft(this.y).ticks(10))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");
  }

  private drawBars() {
    this.g.selectAll(".bar")
          .data(this.STATISTICS)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("fill", "steelblue")
          .attr("x", (d) => this.x(d.letter) )
          .attr("y", (d) => this.y(d.frequency) )
          .attr("width", this.x.bandwidth())
          .attr("height", (d) => this.height - this.y(d.frequency) );
  }

  private loadnewData() {
  	var old = this.STATISTICS;

  	this.STATISTICS = [
  	{letter: "A", frequency: 9000},
	{letter: "B", frequency: 9500},
	{letter: "C", frequency: 10000},
	{letter: "D", frequency: 10000},
	{letter: "E", frequency: 10000}
  	]

	this.g.selectAll(".bar")
	  .data(this.STATISTICS)
	  .transition()
	  .attr("x", (d) => this.x(d.letter) )
	  .attr("y", (d) => this.y(d.frequency) )
	  .attr("width", this.x.bandwidth())
	  .attr("height", (d) => this.height - this.y(d.frequency) );


  	var sorted = this.x.domain(this.STATISTICS.sort((a, b) => b.frequency - a.frequency)
  		.map((d) => d.letter)).copy();
  	
  	var transition = this.g.transition().duration(750)
  	var delay = function(d, i) { return i * 50};

  	this.g.selectAll(".bar").sort((a, b) => {return sorted(a.letter) - sorted(b.letter)});
  	transition.selectAll(".bar").delay(delay).attr("x", (d) => {return sorted(d.letter)})
  	transition.select(".axis.x").call(d3Axis.axisBottom(this.x))

  }

}
