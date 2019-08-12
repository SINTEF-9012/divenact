import React, { Component } from 'react';
import { Button, Layout, List, Col, Row } from 'antd';
import axios from 'axios';

const { Header, Footer, Sider, Content } = Layout;

export class GlobalArea extends Component {
    constructor(props) {
      super(props);
      this.state = {
        deployments: [],
        devices: [],
        option: 'op2'
      };
    }

    componentDidMount() {
        this.getDeployments().then(result => this.setState( { deployments: result }))
        this.getDevices().then(result => this.setState({ devices: result}))
    }

    render() {

        const { deployments, devices } = this.state;
    
        return (
            <div>
            <Layout>            
            <Sider>
              {/* Buttons to interact with API */}
              <div>
                <Button type="primary" onClick={this.production} block>Production</Button> <br /> <br/>
                
                <Button type="primary" onClick={this.deleteDeployments} block>Delete deployments</Button> <br /> <br />
                
                <Button type="primary" onClick={this.seedDeployments} block>Seed deployments</Button> <br /> <br />
                
              </div>            
            </Sider>
            
            <Content>
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
            </Content>
          </Layout>
          </div>

        );
    }

    
    async getDevices() {
        return (await axios.get('api/device/')).data;
    }

    async getDeployments() {
        return (await axios.get('api/deployment')).data;
    }

    production = async () => {
        this.setState({ deployments: [] });
        const variant = prompt('Variant name');
        let result = await axios.put(`api/global/production/${variant}`);
        this.setState({
            devices: await this.getDevices(),
            deployments: await this.getDeployments()
        })
    }

}