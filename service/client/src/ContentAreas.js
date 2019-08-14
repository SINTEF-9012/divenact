import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Select } from 'antd';
import axios from 'axios';

const { Header, Footer, Sider, Content } = Layout;

export var ContentAreaEnum = {
  DEPLOYMENTDEVICE: 1,
  SELECTVARIANT: 2,
  DEFAULT: 3,
  properties: {
    1: { name: "deploymentdevice", value: 1, code: "D" },
    2: { name: "selectvariant", value: 2, code: "V" },
    3: { name: "default", value: 3, code: "F" }
  }
};

export class SelectVariantArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variants: [],
      selected: null,
      contentarea: -1
    };
    this.deploymentdevice = React.createRef();
  }

  componentDidMount() {
    this.getVariantIds().then(result => this.setState({ variants: result }))
  }

  async getVariantIds() {
    return (await axios.get('api/variant')).data.map(item => {
      return item.id;
    });
  }

  onSelectionChange = async (value) => {
    this.setState({ selected: value })
  }

  onGoButton = async () => {
    const variant = this.state.selected;
    if(!variant){
      window.confirm("Please select a variant first");
      return;
    }
    let result = await axios.put(`api/global/production/${variant}`);
    this.setState({
      contentarea: ContentAreaEnum.DEPLOYMENTDEVICE
    })
    this.deploymentdevice.current.componentDidMount();
  }

  render() {
    const { variants, selected } = this.state;
    return (
      <div>
        <Row>Select a variant and press Go</Row>
        <Row>
          <Select style={{ width: 250 }} onChange={this.onSelectionChange}>
            {variants.map((value, index) => {
              return <Select.Option value={value}>{value}</Select.Option>
            })}
          </Select>
          <Button onClick={this.onGoButton}> Go </Button>
        </Row>
        {this.state.contentarea == ContentAreaEnum.DEPLOYMENTDEVICE && <Row><DeploymentDeviceArea ref={this.deploymentdevice}/></Row>}
      </div>
    )
  }



}

export class DeploymentDeviceArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deployments: [],
      devices: []
    };
  }

  componentDidMount() {
    this.getDeployments().then(result => this.setState({ deployments: result }))
    this.getDevices().then(result => this.setState({ devices: result }))
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