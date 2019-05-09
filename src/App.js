import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Graph from "./graph";

class App extends Component {
  render() {
    return <div className="App" />;
  }
  componentDidMount = () => {
    var graph = new Graph();
    var root = graph.findRoot(graph.treeData);
    graph.update(root);
  };
}

export default App;
