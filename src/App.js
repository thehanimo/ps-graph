import React, { Component } from "react";
import "./App.css";
import Graph from "./Components/Graph/Graph.jsx";

class App extends Component {
  render() {
    return <div className="App">
    <Graph width={'50%'} height={'50vh'}/>
    </div>;
  }
}

export default App;
