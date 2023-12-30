"use client";
import React from "react";
import { useModelStore } from "./GlobalStore";
import { Card } from "antd";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;

export default function LoadModelButton({tourRef}) {
  const setModelObj = useModelStore((state) => state.setModelObj);

  const props = {
    name: "file",
    accept: ".bim",
    maxCount: 1,
    customRequest(event) {},
    onChange(info) {
      if (info.fileList.length <= 0) {
        setModelObj(null);
        return;
      }
      var reader = new FileReader();
      reader.onload = (onloadEvent) => {
        var obj = JSON.parse(onloadEvent.target.result);
        info.file.status = "done";
        setModelObj(obj);
        message.success(`Model file loaded.`);
      };

      reader.onerror = () => {
        info.file.status = "error";
        message.error(`could not load model file`);
      };

      reader.readAsText(info.fileList[0].originFileObj);
    },
    onDrop(e) {
    },
  };

  return (
    <Card  size="small" ref={tourRef}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to load
        </p>
        <p className="ant-upload-hint">Only model.bim files are supported.</p>
      </Dragger>
    </Card>
  );
}
