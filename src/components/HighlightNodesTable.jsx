import React, { useEffect } from "react";
import { useModelStore } from "./GlobalStore";
import { Card, Table, Tag } from "antd";

export default function HighlightNodesTable({tourRef}) {
  const highlightNodes = useModelStore((state) => state.highlightNodes);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Table",
      dataIndex: "e_table",
      key: "e_table",
    },
    {
      title: "Type",
      dataIndex: "e_type",
      key: "e_type",
      filters: [
        { text: "Table", value: "TABLE" },
        { text: "Column", value: "COLUMN" },
        { text: "Measure", value: "MEASURE" },
      ],
      render: (tag) => <Tag>{tag}</Tag>,
      onFilter: (value, record) => record.e_type === value,
    },
  ];

  return (
    <Card ref={tourRef}>
      <Table columns={columns} dataSource={highlightNodes} />
    </Card>
  );
}
