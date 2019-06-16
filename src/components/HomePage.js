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
        shouldAddNode: false
      };
    }
  }
  return {
    prevBookName: currentStartBookName,
    prevNodeID: `node-${currentStartBookName}-${2 * (index + 1) - 1}`,
    shouldAddNode: true
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
        console.log(actions);
        const s = new sigma("container");
        let nodeCount = 0;
        actions.forEach((action, actionIndex) => {
          const { currentBook, quantityDiff, timestamp } = action;
          const { prevBookName, prevNodeID, shouldAddNode } = findPrevNode(
            action,
            actions[actionIndex - 1],
            actionIndex
          );

          const currentBookName = decodeURIComponent(
            currentBook.substr(currentBook.indexOf("#") + 1)
          );
          const currentNodeID = `node-${currentBookName}-${2 *
            (actionIndex + 1)}`;
          if (shouldAddNode) {
            s.graph.addNode({
              id: prevNodeID,
              label: prevBookName,
              x: nodeCount * 5 + 5,
              y: 10,
              size: 1,
              color: "#f00"
            });
            nodeCount++;
          }
          s.graph.addNode({
            id: currentNodeID,
            label: currentBookName,
            x: nodeCount * 5 + 5,
            y: 10,
            size: 1,
            color: "#f00"
          });
          nodeCount++;
          console.log(
            `edge-${prevBookName}-${currentBookName}-${actionIndex}`,
            prevNodeID,
            currentNodeID
          );
          s.graph.addEdge({
            id: `edge-${prevBookName}-${currentBookName}-${actionIndex}`,
            source: prevNodeID,
            target: currentNodeID,
            label: `${timestamp}, ${quantityDiff}`
          });
        });

        s.settings({
          edgeColor: "default",
          defaultEdgeColor: "#999"
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
