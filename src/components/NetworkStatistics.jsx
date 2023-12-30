import { Card, Col, Divider, Row, Statistic } from "antd";
import React from "react";
import { useModelStore } from "./GlobalStore";
import { ShareAltOutlined } from "@ant-design/icons";

export default function NetworkStatistics({tourRef}) {
  const model_content = useModelStore((state) => state.model_content);
  const hNodes = useModelStore((state) => state.highlightNodes);
  const { tables, measures, columns } = model_content;

  return (
    <Card ref={tourRef}>
      <Row gutter={[16, 8]} justify="center">
        <Col span={24}>
          <Statistic
            title="Tables"
            value={tables?.length || 0}
            valueStyle={{ textAlign: "center" }}
            style={{ textAlign: "center" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Columns"
            value={columns?.length || 0}
            style={{ textAlign: "center" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Measures"
            value={measures?.length || 0}
            style={{ textAlign: "center" }}
          />
        </Col>
        <Col span={24}>
          <Statistic
            title="Selected Nodes"
            value={hNodes?.length || 0}
            valueStyle={{ color: hNodes?.length > 4 ? "#cf1322" : "#3f8600" }}
            style={{ textAlign: "center" }}
            prefix={<ShareAltOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
}
