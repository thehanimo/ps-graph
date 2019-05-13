import React, { Component } from "react";
import "./Graph.css";
import FlowGraph from "./drawGraph";

class Graph extends Component {
  render() {
    return(
    <div id="Graph" style={{"height": this.props.height, "width": this.props.width,"overflow":"auto","position":"relative"}}></div>
    );
  }
  componentDidMount = () => {
    var graph = new FlowGraph("Graph",this.props.height,this.props.width);
    graph.update();
    graph.insertData("Root node");
  };
}

export default Graph;
