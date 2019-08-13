import React, { Component } from 'react';
import { Button, Layout, List, Col, Row } from 'antd';
import axios from 'axios';
import {ContentAreaEnum, DeploymentDeviceArea} from './ContentAreas'

const { Header, Footer, Sider, Content } = Layout;

export class GlobalArea extends Component {
    constructor(props) {
      super(props);
      this.state = {
        contentarea: ContentAreaEnum.DEPLOYMENTDEVICE
      };
    }

    componentDidMount() {
        
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
                
                <Button type="primary" onClick={this.deleteAllDeployments} block>Delete deployments</Button> <br /> <br />
                
                <Button type="primary" onClick={this.seedDeployments} block>Seed deployments</Button> <br /> <br />
                
              </div>            
            </Sider>
            
            <Content>
              {this.state.contentarea == ContentAreaEnum.DEPLOYMENTDEVICE && <DeploymentDeviceArea />}
              {this.state.contentarea == ContentAreaEnum.DEFAULT && <Button>Hey</Button>}            
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
        const variant = prompt('Variant name');
        let result = await axios.put(`api/global/production/${variant}`);
        this.setState({
          contentarea: ContentAreaEnum.DEPLOYMENTDEVICE
        })
    }

    preview = async ()=> {

    }

    deleteAllDeployments = async () =>{
        let result = await axios.delete('api/deployment/');
        console.log(result);
        this.setState({
          contentarea: ContentAreaEnum.DEFAULT
        })
    }

}