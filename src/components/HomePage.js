import React from "react";
import { Link } from "react-router-dom";

import sigma from "sigma";
//
window.sigma = sigma;

const getBookName = str => decodeURIComponent(str.substr(str.indexOf("#") + 1));

const findPrevNode = (current, prev, index) => {
  const currentStartBookName = getBookName(current.prevBook);
  if (prev) {
    const prevEndBookName = getBookName(prev.currentBook);
    if (prevEndBookName === currentStartBookName) {
      return {
        prevBookName: prevEndBookName,
        prevNodeID: `node-${prevEndBookName}-${2 * index}`,
        shouldAddNode: false,
        sameNode: true
      };
    }
  }
  return {
    prevBookName: currentStartBookName,
    prevNodeID: `node-${currentStartBookName}-${2 * (index + 1) - 1}`,
    shouldAddNode: true,
    sameNode: false
  };
};

export class HomePage extends React.Component {
  componentDidMount() {
    fetch("http://localhost:3000/api/Exchange")
      .then(function(response) {
        return response.json();
      })
      .then(function(actions) {
        require("sigma/build/plugins/sigma.renderers.edgeLabels.min");
        require("sigma/build/plugins/sigma.renderers.parallelEdges.min");
        console.log(actions);
        const s = new sigma("container");
        let nodeCount = 0;
        let edgeCount = 0;
        let nodeList = [];
        actions.forEach((action, actionIndex) => {
          const { currentBook, quantityDiff, timestamp } = action;
          let prevNode = nodeList[nodeList.length - 1];

          if (!prevNode) {
            prevNode = {
              bookName: getBookName(action.prevBook),
              nodeID: `node-${getBookName(action.prevBook)}-${nodeCount++}`
            };
            nodeList.push(prevNode);

            s.graph.addNode({
              id: prevNode.nodeID,
              label: prevNode.bookName,
              x: nodeList.length * 10 + 10,
              y: 10,
              size: 1,
              color: "#f00"
            });
          }
          console.log("prevNode", prevNode);
          const { bookName: prevBookName, nodeID: prevNodeID } = prevNode; //findPrevNode(action, actions[actionIndex - 1], actionIndex);

          const currentBookName = getBookName(currentBook);
          const currentNodeID = `node-${currentBookName}-${nodeCount++}`;
          if (prevBookName === currentBookName) {
            // point to self
            s.graph.addEdge({
              id: `edge-${prevNodeID}-${prevNodeID}-${edgeCount++}`,
              source: prevNodeID,
              target: prevNodeID,
              label: `${timestamp}, ${quantityDiff}`,
              type: "curvedArrow",
              size: 1,
              count: edgeCount
            });
          } else {
            const newNode = {
              bookName: currentBookName,
              nodeID: currentNodeID
            };
            nodeList.push(newNode);

            s.graph.addNode({
              id: newNode.nodeID,
              label: newNode.bookName,
              x: nodeList.length * 10 + 10,
              y: 10,
              size: 1,
              color: "#f00"
            });
            nodeCount++;

            s.graph.addEdge({
              id: `edge-${prevBookName}-${currentBookName}-${edgeCount++}`,
              source: prevNodeID,
              target: currentNodeID,
              label: `${timestamp}, ${quantityDiff}`,
              type: "curvedArrow",
              size: 1
            });
          }

          // console.log(
          //   `edge-${prevBookName}-${currentBookName}-${nodeCount}`,
          //   prevNodeID,
          //   currentNodeID
          // );
        });

        s.settings({
          edgeColor: "default",
          defaultEdgeColor: "#ccc"
          // defaultEdgeType: "arrow",
          // minEdgeSize: 0.5,
          // maxEdgeSize: 1
        });

        s.refresh();
      });
  }

  render() {
    return (
      <div>
        <h1>React Slingshot</h1>
        <div id="container" className="container" />
      </div>
    );
  }
}

export default HomePage;
