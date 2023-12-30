import { useCallback, useEffect, useState } from "react";
import { useModelStore } from "./GlobalStore";
import { ForceGraphAR } from "react-force-graph";
import { Card } from "antd";
import "ar.js";
import "aframe";

export default function D3ARGraph() {
  const model_content = useModelStore((state) => state.model_content);
  const setHighlightNodes = useModelStore((state) => state.setHighlightNodes);

  const [width, setWidth] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    console.log(model_content);
    setGraphData(transformData(model_content));
    return () => {};
  }, [model_content]);

  const div = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const n_colors_dicts = {
    TABLE: { color: "EF8354", size: 10 },
    MEASURE: { color: "BFFFBC", size: 5 },
    COLUMN: { color: "F6BBA2", size: 5 },
  };

  const transformData = (model) => {
    const nodes = [];
    const links = [];

    const tables = model?.tables || [];

    tables.forEach((table) => {
      nodes.push({
        id: table.uuid,
        color: n_colors_dicts[table.entity_type].color,
        name: table.name,
        size: n_colors_dicts[table.entity_type].size,
      });

      [...table.measures, ...table.columns].forEach((entity) => {
        nodes.push({
          id: entity.uuid,
          color: n_colors_dicts[entity.entity_type].color,
          name: entity.name,
          size: n_colors_dicts[entity.entity_type].size,
        });

        links.push({
          source: table.uuid,
          target: entity.uuid,
          label: "",
          color: "F1E4E8",
        });
      });
    });

    const relationships = model?.relationships || [];

    relationships.forEach((rel) => {
      const fromId = `[T]${rel.fromTable}[C]${rel.fromColumn}`;
      const toId = `[T]${rel.toTable}[C]${rel.toColumn}`;
      links.push({
        source: fromId,
        target: toId,
        label: "relationship",
        color: "EF8354",
      });
    });

    return { links, nodes };
  };

  const handleNodeSelection = (node) => {
    const hNodes = new Set();
    if (node) {
      for (let lIndex = 0; lIndex < graphData.links.length; lIndex++) {
        const link = graphData.links[lIndex];
        if (link.source.id == node.id || link.target.id == node.id) {
          hNodes.add(link.source.id);
          hNodes.add(link.target.id);
        }
      }
      setHighlightNodes(hNodes);
    }
  };

  const clearNodeSelection = () => {
    setHighlightNodes(new Set());
  };

  return (
    <Card ref={div}>
      <ForceGraphAR
        width={500}
        height={500}
        glScale={160}
        yOffset={1.8}
        backgroundColor="000011"
        graphData={graphData}
        nodeRelSize={5}
        linkWidth={1.5}
        nodeOpacity={0.9}
        linkOpacity={0.3}
        linkColor={() => "darkgrey"}
      />
    </Card>
  );
}
