import React, { useState } from "react";
import {
  FileSyncOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Divider, Layout, Menu, theme } from "antd";
import MainRouter from "./MainRouter";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
const { Header, Content, Footer, Sider } = Layout;

import App from "./App";

function getItem(label, key, icon, disabled, children) {
  return {
    key,
    icon,
    children,
    label: (
      <Link disabled={disabled} href={key}>
        {label}
      </Link>
    ),
  };
}
const items = [
  getItem("Home", "#/", <HomeOutlined />, false),
  getItem("Force Graph", "#/forcegraph", <ShareAltOutlined />, false),
  getItem("Auto Formatter", "#/autoformat", <FileSyncOutlined />, false),
  // getItem("Springboot", "#/springboot", <ThunderboltOutlined />, true),
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onNavClick = (item) => {
    console.log(item);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu theme="dark" mode="inline" onClick={onNavClick} items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#002140",
          }}
        >
          <Title level={4} style={{ margin: 0, padding: 15, color: "white" }}>
            PBIP proof of concept tool
          </Title>
        </Header>
        <Content
          style={{
            margin: "0 0",
            padding: "15px 15px",
          }}
        >
          <MainRouter />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          pbip poc ©2023 by Halil Türk
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
