import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Icon } from 'antd';
import axios from 'axios';
import { ContentAreaEnum, DeploymentDeviceArea, ProductionArea, PreviewArea } from './ContentAreas'
import { TemplateContentAreaEnum, TemplateArea, VariantArea} from './TemplateContentArea';
import { Collapse } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;

export class DeploymentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentarea: TemplateContentAreaEnum.TEMPLATE
    };
  }

  componentDidMount() {

  }

  render() {

    const { deployments, devices, contentarea } = this.state;

    return (
      <div>
        <Layout>

        <Content>
        <Collapse accordion>
          <Panel header="This is panel header 1" key="1">
          <p>test</p>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p>test</p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p>test</p>
        </Panel>
        </Collapse>
        </Content>          
        </Layout>
      </div>

    );
  }


  templates = () =>{
    this.setState({
      contentarea: TemplateContentAreaEnum.TEMPLATE
    })
  }

  variants = () =>{
    this.setState({
      contentarea: TemplateContentAreaEnum.VARIANT
    })
  }

  async getDevices() {
    return (await axios.get('api/device/')).data;
  }

  production = async () => {
    this.setState({
      contentarea: ContentAreaEnum.PRODUCTION
    })
  }

}