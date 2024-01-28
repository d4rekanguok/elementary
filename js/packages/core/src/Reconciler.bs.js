// Generated by ReScript, PLEASE EDIT WITH CARE

import * as NodeRepr from "./NodeRepr.bs.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";
import * as HashUtils from "./HashUtils.bs.js";

function valuesArray(m) {
  return Array.from(m.values());
}

var $$Map = {
  valuesArray: valuesArray
};

var $$Set = {};

var RenderDelegate = {};

function mount(delegate, node) {
  var nodeMap = delegate.getNodeMap();
  if (nodeMap.has(node.hash)) {
    var existing = nodeMap.get(node.hash);
    HashUtils.updateNodeProps(delegate, existing.hash, existing.props, node.props);
    existing.generation.contents = 0;
    return ;
  }
  delegate.createNode(node.hash, node.kind);
  HashUtils.updateNodeProps(delegate, node.hash, {}, node.props);
  Belt_List.forEach(node.children, (function (child) {
          delegate.appendChild(node.hash, child.hash);
        }));
  nodeMap.set(node.hash, NodeRepr.shallowCopy(node));
}

function visit(delegate, visitSet, _ns) {
  while(true) {
    var ns = _ns;
    var markVisited = function (n) {
      visitSet.add(n.hash);
    };
    if (!ns) {
      return ;
    }
    var rest = ns.tl;
    var n = ns.hd;
    if (visitSet.has(n.hash)) {
      _ns = rest;
      continue ;
    }
    markVisited(n);
    mount(delegate, n);
    _ns = Belt_List.concat(n.children, rest);
    continue ;
  };
}

function stepGarbageCollector(delegate) {
  var nodeMap = delegate.getNodeMap();
  var term = delegate.getTerminalGeneration();
  var deleted = Array.from(nodeMap.values()).reduce((function (acc, n) {
          n.generation.contents = n.generation.contents + 1 | 0;
          if (n.generation.contents >= term) {
            delegate.deleteNode(n.hash);
            return Belt_List.add(acc, n);
          } else {
            return acc;
          }
        }), /* [] */0);
  if (Belt_List.length(deleted) > 0) {
    return Belt_List.forEach(deleted, (function (n) {
                  nodeMap.delete(n.hash);
                }));
  }
  
}

function renderWithDelegate(delegate, graphs) {
  var visitSet = new Set();
  var roots = Belt_List.mapWithIndex(Belt_List.fromArray(graphs), (function (i, g) {
          return NodeRepr.create("root", {
                      channel: i
                    }, [g]);
        }));
  visit(delegate, visitSet, roots);
  if (delegate.getTerminalGeneration() > 1) {
    stepGarbageCollector(delegate);
  }
  delegate.activateRoots(Belt_List.toArray(Belt_List.map(roots, (function (r) {
                  return r.hash;
                }))));
  delegate.commitUpdates();
}

export {
  $$Map ,
  $$Set ,
  RenderDelegate ,
  mount ,
  visit ,
  stepGarbageCollector ,
  renderWithDelegate ,
}
/* NodeRepr Not a pure module */
