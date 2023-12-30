import React, { useEffect, useState } from "react";
import { useModelStore } from "../components/GlobalStore";
import {
  Row,
  Col,
  Card,
  Button,
  Space,
  Progress,
  Statistic,
  Spin,
  Table,
  Divider,
  Alert,
} from "antd";
import LoadModelButton from "../components/LoadModelButton";
import axios from "axios";

export default function AutoFormatter() {
  const model_obj = useModelStore((state) => state.modelObj);

  const [statusObj, setStatusObj] = useState({
    table: { total: 0 },
    column: { total: 0, errors: 0, success: 0 },
    measure: { total: 0, errors: 0, success: 0 },
  });
  const [isRunning, setIsRunning] = useState(false);

  function requestFormattedDax(measure, measureName) {
    const requestObj = {
      dax: `${measureName}=${measure}`,
      listSeperator: ",",
      decimalSeperator: ".",
    };

    return axios.post(
      "https://daxformatter.azurewebsites.net/api/DaxTokenFormat/",
      requestObj
    );
  }

  function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const joinFormattedString = (formattedArray) => {
    var fullString = "\n";
    for (let rowIndx = 0; rowIndx < formattedArray.length; rowIndx++) {
      const row = formattedArray[rowIndx];
      if (rowIndx == 0) continue;

      for (let elIndx = 0; elIndx < row.length; elIndx++) {
        const element = row[elIndx];
        fullString += element.string;
      }

      fullString += "\n";
    }

    return fullString;
  };

  const formatModel = async () => {
    const modelCopy = structuredClone(model_obj);
    console.log(model_obj);
    setIsRunning(true);

    const counts = {
      table: { total: modelCopy?.model?.tables.length },
      column: { total: 0, errors: 0, success: 0 },
      measure: { total: 0, errors: 0, success: 0 },
    };

    for (let tIndx = 0; tIndx < modelCopy?.model?.tables.length; tIndx++) {
      const table = modelCopy?.model?.tables[tIndx];

      for (let columIndx = 0; columIndx < table?.columns.length; columIndx++) {
        const column = table?.columns[columIndx];
        counts.column.total += 1;

        if (column.expression) {
          const resp = await requestFormattedDax(
            column.expression,
            column.name
          );

          if (resp.data?.errors.length > 0) {
            counts.column.errors += 1;
          } else {
            const formattedString = joinFormattedString(resp.data.formatted);
            modelCopy.model.tables[tIndx].columns[columIndx].expression =
              formattedString;
            counts.column.success += 1;
          }
        }
      }
      if (table?.measures) {
        for (let measIndx = 0; measIndx < table?.measures.length; measIndx++) {
          const measure = table?.measures[measIndx];
          counts.measure.total += 1;

          if (measure.expression) {
            const resp = await requestFormattedDax(
              measure.expression,
              measure.name
            );

            if (resp.data?.errors.length > 0) {
              counts.measure.errors += 1;
            } else {
              const formattedString = joinFormattedString(resp.data.formatted);
              modelCopy.model.tables[tIndx].measures[measIndx].expression =
                formattedString;
              counts.measure.success += 1;
            }
          }
        }
      }
    }
    setIsRunning(false);
    setStatusObj(counts);
    download("model.bim", JSON.stringify(modelCopy));
  };

  return (
    <Card title="Auto formatting">
      {isRunning ? (
        <Spin tip="Loading...">
          <Alert
            message=""
            description=""
            type="info"
            style={{ minHeight: 150 }}
          />
        </Spin>
      ) : (
        <>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Button
                size="large"
                block={true}
                type="primary"
                onClick={formatModel}
                disabled={model_obj?.model == undefined}
              >
                Run Autoformat
              </Button>
            </Col>
            <Col span={24}>
              <LoadModelButton />
            </Col>
          </Row>
          <Divider />
          <Row gutter={[16, 8]}>
            <Col span={4}>
              <Card title="Tables">
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Statistic title="Total" value={statusObj.table.total} />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Columns">
                <Row gutter={[16, 8]}>
                  <Col span={8}>
                    <Statistic title="Total" value={statusObj.column.total} />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Success"
                      value={statusObj.column.success}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Errors" value={statusObj.column.errors} />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Measures">
                <Row gutter={[16, 8]}>
                  <Col span={8}>
                    <Statistic title="Total" value={statusObj.measure.total} />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Success"
                      value={statusObj.measure.success}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Errors"
                      value={statusObj.measure.errors}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
}
