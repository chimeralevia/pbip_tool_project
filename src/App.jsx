import { Card, Typography } from "antd";
const { Title, Paragraph, Text, Link } = Typography;

function App() {
  return (
    <Card>
      <Typography>
        <Title>Welcome</Title>

        <Paragraph>
          The recent update of PowerBI enabled the use of PowerBI Project files.
          This change enables a long list of use-cases for advanced custom
          developed tools around the use of PowerBI data models.
        </Paragraph>

        <Paragraph>
          To explore the possibilities of these new functionalities i created
          this proof of concept tool to show 3 different creative use-cases.
          <Text strong>
            Please be aware that these tools are not heavily tested but serve a
            demonstration purpose.
          </Text>
        </Paragraph>

        <Title level={2}>Available Modules</Title>
        <Paragraph>
          <ul>
            <li>
              <Link href="#/forcegraph">Force Graph</Link>
            </li>
            <li>
              <Link href="#/autoformat">Auto Formatter</Link>
            </li>
          </ul>
        </Paragraph>
        {/* <Title level={2}>Modules in development</Title>
        <Paragraph>
          <ul>
            <li>
              <Link href="#/springboot">Springboot</Link>
            </li>
          </ul>
        </Paragraph> */}

        <Paragraph>
          please enjoy and let me know if you have any suggestions or remarks.
        </Paragraph>
        <Paragraph>
          <Text strong>Halil Türk</Text>
        </Paragraph>
      </Typography>
    </Card>
  );
}

export default App;
