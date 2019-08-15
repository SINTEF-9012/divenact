import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Icon } from 'antd';
import axios from 'axios';
import { ContentAreaEnum, DeploymentDeviceArea, ProductionArea, PreviewArea } from './ContentAreas'
import { ModelContentAreaEnum, TemplateArea} from './ModelContentArea';

const { Header, Footer, Sider, Content } = Layout;

export class ModelArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentarea: ModelContentAreaEnum.TEMPLATE
    };
  }

  componentDidMount() {

  }

  render() {

    const { deployments, devices, contentarea } = this.state;

    return (
      <div>
        <Layout>
          <Sider>
            {/* Buttons to interact with API */}
            <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark">
              <Menu.Item key="1" onClick={this.templates}>
                <Icon type="build" />
                <span>Template</span>
              </Menu.Item>
              <Menu.Item key="2" onClick={this.preview}>
                <Icon type="experiment" />
                <span>Variant</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="deployment-unit" />
                <span>Diversify</span>
              </Menu.Item>
            </Menu>
          </Sider>

          <Content>
            {contentarea == ModelContentAreaEnum.TEMPLATE&& <TemplateArea />}
            {contentarea == ContentAreaEnum.PRODUCTION && <ProductionArea />}
            {contentarea == ContentAreaEnum.PREVIEW && <PreviewArea />}
            {contentarea == ContentAreaEnum.DEFAULT && <Button>Hey</Button>}
          </Content>
        </Layout>
      </div>

    );
  }


  templates = () =>{
    this.setState({
      contentarea: ModelContentAreaEnum.TEMPLATE
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