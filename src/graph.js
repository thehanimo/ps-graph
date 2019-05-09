import * as d3 from "d3";

export default class Graph {
  constructor() {
    this.joinNodeAdded = false;
    this.joined = false;
    this.treeData = [
      {
        name: "N1",
        parent: "null",
        text: "N1 - Customer Data Upload",
        color: "1562BC",
        linked: false,
        icon: "server"
      }
    ];
  }
  findRoot(data) {
    var root = JSON.parse(JSON.stringify(data));
    return root[0];
  }

  update(source) {
    d3.select("body")
      .select("#tooltip")
      .remove();
    // ************** Generate the tree diagram	 *****************
    var margin = { top: 40, right: 120, bottom: 20, left: 120 },
      width = 960 - margin.right - margin.left,
      height = 700 - margin.top - margin.bottom;

    var i = 0;

    var tree = d3.layout.tree().size([height, width]);

    var diagonal = d3.svg.diagonal().projection(function(d) {
      return [d.x, height - d.y * 1.5];
    });
    // Compute the new tree layout.
    var nodes = tree.nodes(source).reverse();
    var links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 100;
    });

    d3.select("svg").remove();

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Declare the nodes…
    var node = svg.selectAll("g.node").data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    // Enter the nodes.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + (height - d.y * 1.5) + ")";
      });

    var div = d3
      .select("body")
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
          .delay(500)
          .duration(500)
          .style("opacity", 0)
          .style("display", "none"); // on mouseout hide tip
      });

    nodeEnter
      .append("rect")
      .attr("x", -100)
      .attr("y", -40)
      .attr("width", 210)
      .attr("height", 40)
      .style("stroke-width", 3)
      .style("stroke", function(d) {
        return d.color;
      })
      .style("fill", "#fff");

    nodeEnter
      .append("rect")
      .attr("x", -100)
      .attr("y", -40)
      .attr("width", 40)
      .attr("height", 40)
      .style("fill", function(d) {
        return d.color;
      });

    nodeEnter
      .append("svg:foreignObject")
      .attr("height", 40)
      .attr("width", 40)
      .attr("x", -95)
      .attr("y", -32.5)
      .html(function(d) {
        return `<i class="fas fa-${
          d.icon
        }" style="font-size: 25px;color:white"></i>`;
      });

    nodeEnter
      .on("mouseover", d => {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("display", "block");
        if (d.name == "N3") {
          div
            .html(
              `<i class="fas fa-server"></i><i id="N3" class="fas fa-broom"></i><i class="fas fa-file-medical-alt"></i>`
            )
            .style("left", 200 + d.x + "px")
            .style("top", 50 + height - d.y * 1.5 + "px");
          div
            .append("div")
            .html(`<i id="linkAll" class="fas fa-code-branch"></i>`)
            .style("left", -30 + "px")
            .style("top", 2 + "px");
        } else if (d.name == "N4") {
          div
            .html(
              `<i class="fas fa-server"></i><i class="fas fa-broom"></i><i id="N4" class="fas fa-file-medical-alt"></i>`
            )
            .style("left", 200 + d.x + "px")
            .style("top", 50 + height - d.y * 1.5 + "px");
          div
            .append("div")
            .html(`<i class="fas fa-plus-circle"></i>`)
            .style("left", -30 + "px")
            .style("top", 2 + "px");
        } else if (d.name == "N5") {
          div
            .html(
              `<i class="fas fa-server"></i><i class="fas fa-broom"></i><i id="N5" class="fas fa-download" id="db"></i>`
            )
            .style("left", 200 + d.x + "px")
            .style("top", 50 + height - d.y * 1.5 + "px");
          div
            .append("div")
            .html(`<i class="fas fa-plus-circle"></i>`)
            .style("left", -30 + "px")
            .style("top", 2 + "px");
        } else {
          div
            .html(
              `<i id="N1" class="fas fa-server"></i><i class="fas fa-broom"></i><i class="fas fa-file-medical-alt"></i>`
            )
            .style("left", 200 + d.x + "px")
            .style("top", 50 + height - d.y * 1.5 + "px");
          div
            .append("div")
            .html(`<i id="N2" class="fas fa-plus-circle"></i>`)
            .style("left", -30 + "px")
            .style("top", 2 + "px");
        }
        div
          .append("div")
          .html(
            `<i class="fas fa-cog toptooltip"></i><i class="far fa-trash-alt toptooltip"></i><i class="fas fa-plus-circle toptooltip"></i>`
          )
          .style("left", -30 + "px")
          .style("top", -80 + "px");
        d3.select("#N1").on("click", () => {
          this.expand("N1");
        });
        d3.select("#N3").on("click", () => {
          this.expand("N3");
        });
        d3.select("#N4").on("click", () => {
          this.expand("N4");
        });
        d3.select("#N5").on("click", () => {
          this.expand("N5");
        });
        d3.select("#N2").on("click", () => {
          this.addJoinNode();
        });
        d3.select("#linkAll").on("click", () => {
          this.linkAll();
        });
      })
      .on("mouseout", function(d) {
        div
          .transition()
          .duration(500)
          .style("opacity", 0)
          .delay(500)
          .style("display", "none");
      });
    nodeEnter
      .append("text")
      .attr("y", -40)
      .attr("x", -50)
      .attr("fill", "#708090")
      .attr("dy", "1.2em")
      .text(function(d) {
        return d.text;
      });

    nodeEnter
      .append("text")
      .attr("y", -40)
      .attr("x", -50)
      .attr("fill", "#708090")
      .attr("dy", "2.4em")
      .text(function(d) {
        return d.text2 ? d.text2 : "";
      });

    var len = links.length;
    for (let i = 0; i < len; i++) {
      if (!links[i].source.linked) {
        links.pop(i);
      }
    }
    // Declare the links…
    var link = svg.selectAll("path.link").data(links, function(d) {
      return d.target.id;
    });

    // Enter the links.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);
  }

  expand(d) {
    if (d == "N1" && !this.treeData[0].children) {
      this.treeData[0].parent = "N2";
      this.treeData = [
        {
          name: "N2",
          parent: "null",
          text: "N2 - Claims/transaction",
          text2: "data upload",
          color: "1562BC",
          linked: false,
          icon: "server",
          children: this.treeData
        }
      ];
      var root = this.findRoot(this.treeData);
      this.update(root);
    } else if (d == "N3" && this.joined) {
      this.treeData.parent = "N4";
      this.treeData = [
        {
          name: "N4",
          parent: "null",
          text: "N4 - Applying data quality",
          text2: "transformations",
          color: "F7A444",
          icon: "broom",
          linked: true,
          children: this.treeData
        }
      ];
      var root = this.findRoot(this.treeData);
      this.update(root);
    } else if (d == "N4" && this.joined) {
      this.treeData.parent = "N5";
      this.treeData = [
        {
          name: "N5",
          parent: "null",
          text: "N5 - Applying scripts for",
          text2: "scaling",
          color: "C53F52",
          icon: "file-medical-alt",
          linked: true,
          children: this.treeData
        }
      ];
      var root = this.findRoot(this.treeData);
      this.update(root);
    } else if (d == "N5" && this.joined) {
      this.treeData.parent = "N6";
      this.treeData = [
        {
          name: "N6",
          parent: "null",
          text: "N6 - Sending data to data-",
          text2: "warehouse",
          color: "062E60",
          icon: "download",
          linked: true,
          children: this.treeData
        }
      ];
      var root = this.findRoot(this.treeData);
      this.update(root);
    }
  }

  addJoinNode() {
    if (!this.joinNodeAdded) {
      try {
        this.treeData.parent = "N3";
        var N1 = this.treeData[0].children[0];
        delete this.treeData[0]["children"];
        N1.parent = "N3";
        this.treeData.push(N1);
        this.joinNodeAdded = true;
        this.treeData = [
          {
            name: "N3",
            parent: "null",
            text: "N3 - Join data sources",
            color: "67E490",
            icon: "project-diagram",
            linked: false,
            children: this.treeData
          }
        ];
        var root = this.findRoot(this.treeData);
        this.update(root);
      } catch {}
    }
  }
  linkAll() {
    this.treeData[0].linked = true;
    this.treeData[0].children[0].linked = true;
    this.treeData[0].children[1].linked = true;
    this.joined = true;
    var root = this.findRoot(this.treeData);
    this.update(root);
  }
}
