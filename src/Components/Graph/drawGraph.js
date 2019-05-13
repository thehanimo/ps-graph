import * as d3 from "d3";

export default class FlowGraph {
  constructor(divID,h,w) {
    try{
      if(h.charAt(w.length-1) == '%'){
        this.h = document.getElementById(divID).clientHeight
      } else if(h.slice(h.length-2,h.length) == 'vh'){
        this.h = document.documentElement.clientHeight * Number(h.slice(0,h.length-2))/100
      } else if(h.slice(h.length-2,h.length) == 'vw'){
        this.h = document.documentElement.clientWidth * Number(h.slice(0,h.length-2))/100
      } else{
        this.h = Number(h.slice(0,h.length-2));
      }
    } catch{
      this.h = document.documentElement.clientHeight;
    }
    try{
      if(w.charAt(w.length-1) == '%'){
        this.w = document.getElementById(divID).clientWidth
      } else if(w.slice(w.length-2,w.length) == 'vh'){
        this.w = document.documentElement.clientHeight * Number(w.slice(0,w.length-2))/100
      } else if(w.slice(w.length-2,w.length) == 'vw'){
        this.w = document.documentElement.clientWidth * Number(w.slice(0,w.length-2))/100
      } else{
        this.w = Number(w.slice(0,w.length-2));
      }
    } catch{
      this.w = document.documentElement.clientWidth;
    }
    this.columns = 0;
    this.divID = "#" + divID;
    this.joinNodeAdded = false;
    this.joined = false;
    this.nodeTypes = {
      N: {icon:"server",color:"1562BC"},
      J: {icon:"project-diagram",color:"67E490"},
      R: {icon:"broom",color:"F7A444"},
      S: {icon:"file-medical-alt",color:"C53F52"},
      D: {icon:"download",color:"062E60"},
    }
    this.nameCounter = {
      N: 0,
      J: 0,
      R: 0,
      S: 0,
      D: 0,
    }
    this.treeData = 
      {
        name: "0",
        parent: null,
        type: "H",
        linked: false,
        children: [
        ],
      };
      this.wrapper = d3
      .select("body")
      .append("div")
      .attr("class","sidebarWrapper")
      //Sidebar
      this.sidebar = this.wrapper
      .append("div")
      .attr("class", "sidebar")
      //Overlay
      this.overlay = this.wrapper
      .append("div")
      .attr("class", "graphOverlay")
      .on("click",()=>{
        this.closeSidebar();
      })
  }
  findRoot(data) {
    var root = JSON.parse(JSON.stringify(data));
    return root[0];
  }

  findLeaf(data){
    var child = JSON.parse(JSON.stringify(data))
    while(child[0].hasOwnProperty('children') && child[0].children){
      child = child[0].children
    }
    return child[0];
  }
  closeSidebar(){
    this.overlay.style("display","none")
    this.sidebar.transition().duration(800).style("right","-300px")
  }
  openSidebar(){
    this.overlay.style("display","block")
    this.sidebar.transition().duration(800).style("right","0px")
  }
  insertData(text){
    var text2 = "";
    if(text.length > 40){
      text2 = text.slice(19,40) + '...'
      text = text.slice(0,19)
    } else if(text.length > 19){
      text2 = text.slice(19)
      text = text.slice(0,19)
    }
    this.treeData.children.push({
      name: "N" + this.nameCounter.N,
      parent: this.treeData.name,
      type: "N",
      text: "N" + this.nameCounter.N++ + " - " + text,
      text2: text2,
      linked: true,
      children: [],
      column: this.columns++,
      end: true,
    })
    this.update(this.findRoot(this.treeData))
  }
  insertRecipe(nodeIndex){
    this.treeData.children[nodeIndex].parent = "R" + this.nameCounter.R;
    this.treeData.children[nodeIndex].end = false;
    this.treeData.children[nodeIndex] = {
        name: "R" + this.nameCounter.R,
        parent: this.treeData.name,
        type: "R",
        text: "R" + this.nameCounter.R++ + " - Applying data quality",
        text2: "transformations",
        linked: true,
        column: this.treeData.children[nodeIndex].column,
        children: [
          this.treeData.children[nodeIndex]
        ],
        end: true,
    }
    this.update(this.findRoot(this.treeData))
  }
  insertSync(nodeIndex){
    this.treeData.children[nodeIndex].parent = "S" + this.nameCounter.S;
    this.treeData.children[nodeIndex].end = false;
    this.treeData.children[nodeIndex] = {
        name: "S" + this.nameCounter.S,
        parent: this.treeData.name,
        type: "S",
        text: "S" + this.nameCounter.S++ + " - Applying scripts for",
        text2: "Scaling",
        linked: true,
        column: this.treeData.children[nodeIndex].column,
        children: [
          this.treeData.children[nodeIndex]
        ],
        end: true,
    }
    this.update(this.findRoot(this.treeData))
  }
  insertDownload(nodeIndex){
    this.treeData.children[nodeIndex].parent = "D" + this.nameCounter.D;
    this.treeData.children[nodeIndex].end = false;
    this.treeData.children[nodeIndex] = {
        name: "D" + this.nameCounter.D,
        parent: this.treeData.name,
        type: "D",
        text: "D" + this.nameCounter.D++ + " - Sending data to data-",
        text2: "warehouse",
        linked: true,
        column: this.treeData.children[nodeIndex].column,
        children: [
          this.treeData.children[nodeIndex]
        ],
        end: false,
    }
    this.update(this.findRoot(this.treeData))
  }
  insertJoin(column1,column2){
    this.treeData.children[column1].parent = "J" + this.nameCounter.J;
    this.treeData.children[column2].parent = "J" + this.nameCounter.J;
    this.treeData.children[column1].end = false;
    this.treeData.children[column2].end = false;
    this.treeData.children[column2].parentColumn = column1;
    this.treeData.children[column1] = {
      name: "J" + this.nameCounter.J,
      parent: this.treeData.name,
      type: "J",
      text: "J" + this.nameCounter.J++ + " - Join data sources",
      linked: true,
      column: this.treeData.children[column1].column,
      children: [
        this.treeData.children[column1],
        this.treeData.children[column2],
      ],
      end: true,
    }
    this.update(this.findRoot(this.treeData));
  }
  deleteNode(column,depth){
    var flag = false;
    if(this.treeData.children[column].parentColumn){
      flag = column;
      column = this.treeData.children[column].parentColumn;
      --depth;
    }
    for(let i=0; i<depth; i++){
      var len = this.treeData.children[column].children.length;
      for(let i=len-1; i>=0; i--){
        this.treeData.children[column].children[i].parent = this.treeData.name;
        this.treeData.children[column].children[i].end = true;
        this.treeData.children[this.treeData.children[column].children[i].column] = this.treeData.children[column].children[i];
      }
    }
    if(flag !== false){
      delete this.treeData.children[flag].children[0].parentColumn;
      this.treeData.children[flag].children[0].parent = this.treeData.name;
      this.treeData.children[flag].children[0].end = true;
      this.treeData.children[this.treeData.children[flag].children[0].column] = this.treeData.children[flag].children[0];
    }
    this.update(this.findRoot(this.treeData));
  }
  update() {
    d3.select(this.divID)
      .select("#tooltip")
      .remove();

    d3.select(this.divID)
    .select("svg")
    .remove();

    // Create the cluster layout:
    var cluster = d3.cluster()
    .nodeSize([40,10])
    .separation(() => {return 100;});
    // Give the data to this cluster layout:
    var root = d3.hierarchy(this.treeData, function(d) {
        return d.children;
    });
    cluster(root);

    var margin = { top: 100, right: 120, bottom: 200, left: 120 },
      width = 400*this.treeData.children.length - margin.right - margin.left,
      height = 100*root.height - margin.top - margin.bottom + 100;
    
    height = height < this.h - margin.top - margin.bottom + 100? this.h - margin.top - margin.bottom + 100: height;
    width = width < this.w - margin.right - margin.left? this.w - margin.right - margin.left: width;

    var i = 0;
    var nodes = root.descendants();
    var links = root.descendants().slice(1);
    // Normalize for fixed-depth.
    nodes.forEach((d) => {
      d.y = d.height * 100;
      d.x = 400* d.data.column;
    });
    var svg = d3
      .select(this.divID)
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Declare the nodes…
    var node = svg.selectAll("g.node").data(nodes.slice(1));

    // Enter the nodes.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + (d.y) + ")";
      });
    
    // Hover Div
    var div = d3
      .select(this.divID)
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .on("mouseover", function(d, i) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9); // on mouse over cancel circle mouse out transistion
      })
      .on("mouseout", function(d, i) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0);
        div
          .transition()
          .delay(200)
          .style("display", "none");
      });

    nodeEnter
      .append("rect")
      .attr("x", -100)
      .attr("y", -40)
      .attr("width", 210)
      .attr("height", 40)
      .style("stroke-width", 3)
      .style("stroke", (d) => {
        return this.nodeTypes[d.data.type].color;
      })
      .style("fill", "#fff");

    nodeEnter
      .append("rect")
      .attr("x", -98.5)
      .attr("y", -38.5)
      .attr("width", 37)
      .attr("height", 37)
      .style("fill", (d) => {
        return this.nodeTypes[d.data.type].color;
      });

    nodeEnter
      .append("svg:foreignObject")
      .attr("height", 40)
      .attr("width", 40)
      .attr("x", -100)
      .attr("y", -32.5)
      .html((d) => {
        return `<i class="fas fa-${
          this.nodeTypes[d.data.type].icon
        }" style="font-size: 25px;color:white"></i>`;
      });

    nodeEnter
      .on("mouseover", d => {
        div
          .style("left", 200 + d.x + "px")
          .style("top", 110 + (d.y) + "px")
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("display", "block")
        div
          .html("")
          .append("i")
          .attr("class", "fas fa-server")
          .on("click",() => {
            this.openSidebar();
            this.sidebar
              .html("<h2>Enter New Node Title</h2><input id=newNodeInput />")
              .append("button")
              .html("Submit")
              .on("click",()=>{
                this.insertData(document.getElementById("newNodeInput").value);
                this.closeSidebar();
              })
          });
        if(d.data.end){
          div
            .append("i")
            .attr("class", "fas fa-broom")
            .on("click",() => {
              this.insertRecipe(d.data.column)
            });
          if(d.data.type == "S"){
            div
            .append("i")
            .attr("class", "fas fa-download")
            .on("click",() => {
              this.insertDownload(d.data.column)
            });
          } else {
            div
              .append("i")
              .attr("class", "fas fa-file-medical-alt")
              .on("click",() => {
                this.insertSync(d.data.column)
              });
            }
            div
            .append("div")
            .attr("class","joinTooltip")
            .html(`<i class="fas fa-plus-circle"></i>`)
            .style("left", -30 + "px")
            .style("top", 2 + "px")
            .on("click",() => {
              this.openSidebar()
              var joinNodesDiv = this.sidebar
              .html("<h2>Select A Node</h2>")
              for(let i=0; i < this.treeData.children.length; i++){
                if(d.data.name !== this.treeData.children[i].name && this.treeData.children[i].end){
                  joinNodesDiv.append("button").html(`${this.treeData.children[i].name}`)
                  .on("click",()=>{
                    this.insertJoin(d.data.column,this.treeData.children[i].column)
                    this.closeSidebar();
                  })
                }
              }
            })
          } else {
            div
            .append("i")
            .attr("class", "fas fa-broom")
            .style("color","gray")
            if(d.data.type == "S"){
              div
              .append("i")
              .attr("class", "fas fa-download")
              .style("color","gray")
            } else {
              div
              .append("i")
              .attr("class", "fas fa-file-medical-alt")
              .style("color","gray")
            }
            div
            .append("div")
            .html(`<i class="fas fa-plus-circle"></i>`)
            .style("color","gray")
            .style("left", -30 + "px")
            .style("top", 2 + "px");
          }
        var topTooltip = 
          div
          .append("div")
          .style("left", -30 + "px")
          .style("top", -80 + "px");
          topTooltip.append("i")
          .attr("class","fas fa-cog toptooltip");
          topTooltip.append("i")
          .attr("class","far fa-trash-alt toptooltip")
          .on("click",()=>{
            if(!(d.data.type == "N" && d.depth == 1)){
              this.openSidebar();
              this.sidebar
                .html(()=>{
                  if(d.data.type == "N") return `<h2>Delete all child nodes of ${d.data.name}?</h2>`;
                  else if (d.depth == 1) return `<h2>Delete node ${d.data.name}?</h2>`;
                  else return `<h2>Delete node ${d.data.name}?</h2><h5>Warning: This will cause a cascade delete!</h5>`;
                })
                .append("button")
                .html("Confirm")
                .on("click",()=>{
                  this.deleteNode(d.data.column,d.depth);
                  this.closeSidebar();
                })
                this.sidebar.append("button")
                .html("Cancel")
                .on("click",()=>{
                  this.closeSidebar();
                })
              }
          })
          topTooltip.append("i")
          .attr("class","fas fa-plus-circle toptooltip");
      })
      .on("mouseout", function(d) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0);
        div
          .transition()
          .delay(200)
          .style("display", "none");
      });
    nodeEnter
      .append("text")
      .attr("y", -40)
      .attr("x", -50)
      .attr("fill", "#708090")
      .attr("dy", "1.2em")
      .text(function(d) {
        return d.data.text;
      });

    nodeEnter
      .append("text")
      .attr("y", -40)
      .attr("x", -50)
      .attr("fill", "#708090")
      .attr("dy", "2.4em")
      .text(function(d) {
        return d.data.text2 ? d.data.text2 : "";
      });

    for (let i = 0; i < links.length; i++) {
      if (!links[i].data.linked || !links[i].parent.data.linked) {
        links.splice(i,1)
        --i;
      }
    }
    var link = svg
              .selectAll('path')
              .data( links )
    
    svg.append("svg:defs").selectAll("marker")
    .data(["straight"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 6)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,-5L5,5")
    .style("fill","gray")

    svg.append("svg:defs").selectAll("marker")
    .data(["pointLeft"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "-10 -5 10 10")
    .attr("refX", -11)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L-10,0L0,5")
    .style("fill","gray")

    svg.append("svg:defs").selectAll("marker")
    .data(["pointRight"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 11)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .style("fill","gray")

    // Enter the links.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        if(d.x == d.parent.x){
        return "M" + d.x + "," + (d.y+2)
                + "C" + d.x + "," + (d.parent.y - 40)
                + " " + d.parent.x + "," + (d.parent.y - 40)// 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.x + "," + (d.parent.y - 40);
        } else if(d.x > d.parent.x){
          return "M" + d.x + "," + (d.y+2)
                + "C" + d.x + "," + (d.parent.y - 20)
                + " " + (d.parent.x + 110) + "," + (d.parent.y - 20)// 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + (d.parent.x + 110) + "," + (d.parent.y - 20);
        } else {
          return "M" + d.x + "," + (d.y+2)
                + "C" + d.x + "," + (d.parent.y - 20)
                + " " + (d.parent.x - 100) + "," + (d.parent.y - 20)// 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + (d.parent.x - 100) + "," + (d.parent.y - 20);
        }
      })
      .attr("marker-end", function(d){
        if(d.x == d.parent.x) return "url(#straight)";
        if(d.x > d.parent.x) return "url(#pointLeft)";
        if(d.x < d.parent.x) return "url(#pointRight)";
      }); // add the arrow to the link end
  }
}
