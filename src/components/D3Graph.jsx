import { useCallback, useEffect,  useState } from "react";
import { useModelStore } from "./GlobalStore";
import SpriteText from "three-spritetext";
import { ForceGraph3D } from "react-force-graph";
import { Card } from "antd";
export default function D3Graph({ tourRef }) {
  const model_content = useModelStore((state) => state.model_content);
  const setHighlightNodes = useModelStore((state) => state.setHighlightNodes);

  const [width, setWidth] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
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
        e_type: table.entity_type,
        e_table: table.name,
      });

      [...table.measures, ...table.columns].forEach((entity) => {
        nodes.push({
          id: entity.uuid,
          color: n_colors_dicts[entity.entity_type].color,
          name: entity.name,
          size: n_colors_dicts[entity.entity_type].size,
          e_type: entity.entity_type,
          e_table: table.name,
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
    const nodes = new Map();

    if (node) {
      const filtered = graphData.links.filter(
        (link) => link.source.id == node.id || link.target.id == node.id
      );

      filtered.forEach((elem) => {
        nodes.set(elem.source.id, elem.source);
        nodes.set(elem.target.id, elem.target);
      });

      setHighlightNodes(Array.from(nodes.values()));
    }
  };

  const clearNodeSelection = () => {
    setHighlightNodes([]);
  };

  return (
    <Card ref={div}>
      <Card ref={tourRef} bordered={false} style={{margin:0,padding:0}} bodyStyle={{margin:0,padding:0}}>
        <ForceGraph3D
          height={700}
          width={width - 50}
          graphData={graphData}
          linkThreeObjectExtend={true}
          onNodeClick={handleNodeSelection}
          onBackgroundClick={clearNodeSelection}
          linkDirectionalParticles={1}
          linkWidth={2}
          linkOpacity={0.4}
          linkColor="color"
          nodeThreeObject={(node) => {
            const size = node.size;
            const geometry = new THREE.SphereGeometry(size, 32, 16);
            const material = new THREE.MeshBasicMaterial({
              color: "#" + node.color,
            });
            const mesh = new THREE.Mesh(geometry, material);
            return mesh;
          }}
          linkThreeObject={(link) => {
            const sprite = new SpriteText(`${link.label}`);
            sprite.color = "white";
            sprite.textHeight = 3.5;
            return sprite;
          }}
          linkPositionUpdate={(sprite, { start, end }) => {
            const middlePos = Object.assign(
              ...["x", "y", "z"].map((c) => ({
                [c]: start[c] + (end[c] - start[c]) / 2,
              }))
            );
            Object.assign(sprite.position, middlePos);
          }}
        />
      </Card>
    </Card>
  );
}
