import React, { useRef, useState } from "react";
import LoadModelButton from "../components/LoadModelButton";
import { Card, Col, Divider, Row } from "antd";
import D3Graph from "../components/D3Graph";
import HighlightNodesTable from "../components/HighlightNodesTable";
import NetworkStatistics from "../components/NetworkStatistics";

import { Button, Tour } from "antd";
import { ForceGraphAR } from "react-force-graph";

export default function NetworkGraphView() {
  const [open, setOpen] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const steps = [
    {
      title: "Upload Model File",
      description: "To start select your model.bim file and load it.",
      placement: "left",
      target: () => ref1.current,
    },
    {
      title: "View your 3D Model",
      description:
        "You can view your model and even select a Node by clicking to highlicht related nodes.",
      placement: "right",
      target: () => ref2.current,
    },
    {
      title: "General statistics",
      description:
        "View general information about your model and how many Nodes would be affected by changes to the selected node.",
      placement: "left",
      target: () => ref3.current,
    },

    {
      title: "Highlighted Nodes",
      description:
        "Depending on your selected node, which measures/columns would be affected by changes.",
      placement: "top",
      target: () => ref4.current,
    },
  ];

  return (
    <Row gutter={[16, 8]}>
      <Col span={20}>
        <D3Graph tourRef={ref2} />
      </Col>
      <Col span={4}>
        <Button
          type="primary"
          onClick={() => setOpen(true)}
          size="small"
          style={{ width: "100%" }}
        >
          Begin Tour
        </Button>
        <Divider />
        <LoadModelButton tourRef={ref1} />
        <Divider />
        <NetworkStatistics tourRef={ref3} />
      </Col>
      <Col span={24}>
        <HighlightNodesTable tourRef={ref4} />
      </Col>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      <Divider/>
      <Col span={24}>
        <Card>
          <iframe
            width="1200"
            height="800"
            allow="camera;microphone"
            scrolling="no"
            src="https://vasturiano.github.io/react-force-graph/example/ar-graph/index.html"
          ></iframe>
        </Card>
      </Col>
    </Row>
  );
}
