import React, { Component } from 'react';
import { Button, Layout, List, Col, Row } from 'antd';
import axios from 'axios';

const { Header, Footer, Sider, Content } = Layout;

export var ContentAreaEnum = {
  DEPLOYMENTDEVICE: 1,
  DEFAULT: 2,
  properties: {
    1: {name: "deploymentdevice", value: 1, code: "D"},
    2: {name: "default", value: 2, code: "F"}
  }
};

export class DeploymentDeviceArea extends Component {
    constructor(props) {
      super(props);
      this.state = {
        deployments: [],
        devices: []
      };
    }

    componentDidMount() {
        this.getDeployments().then(result => this.setState( { deployments: result }))
        this.getDevices().then(result => this.setState({ devices: result}))
    }

    render() {

        const { deployments, devices } = this.state;
    
      return (

        <Row>
          <Col span={10}>
            {/* List of deployments in Cosmos DB */}
            <List
              size="small"
              //header={<div>Header</div>}
              //footer={<div>Footer</div>}
              bordered
              dataSource={deployments}
              renderItem={deployment => <List.Item>{deployment.id}</List.Item>}
            />
          </Col>
          <Col span={10}>
            <List
              size="small"
              //header={<div>Header</div>}
              //footer={<div>Footer</div>}
              bordered
              dataSource={devices}
              renderItem={device => <List.Item>{device.id}</List.Item>}
            />
          </Col>
          <Col span={4}>
          </Col>
        </Row>


      );
    }

    
    async getDevices() {
        return (await axios.get('api/device/')).data;
    }

    async getDeployments() {
        return (await axios.get('api/deployment')).data;
    }

}