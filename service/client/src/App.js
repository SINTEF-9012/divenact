import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Button } from 'antd';
import { Layout } from 'antd';
import { List } from 'antd';
import { Row, Col } from 'antd';
import { PageHeader } from 'antd';
import { Typography } from 'antd';
import { Menu } from 'antd';
import { Icon } from 'antd';
import {Tabs} from 'antd';

import {ControlArea} from './ControlArea';
import {ModelArea} from './ModelArea';
import {TemplateArea2} from './TemplateArea2';
import {VariantArea2} from './VariantArea2';
import {DeploymentArea} from './DeploymentArea';

const { Header, Footer, Sider, Content } = Layout;
const { Paragraph } = Typography;
const { TabPane } = Tabs;

var AreaEnum = {
  CONTROL: 1,
  MODEL: 2,
  TEMPLATE: 3,
  VARIANT: 4,
  DEPLOYMENT: 5,
  properties: {
    1: {name: "control", value: 1, code: "C"},
    2: {name: "model", value: 2, code: "M"},    
    3: {name: "template", value: 3, code: "T"},
    4: {name: "variant", value: 4, code: "V"},
    5: {name: "deployment", value: 5, code: "R"}
  }
};

class Option1 extends Component{
  render(){
    return(
      <div>I'm One</div>
    )
  }
}

class Option2 extends Component{
  render(){
    return(
      <div>I'm Two</div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area: AreaEnum.GLOBAL
    };
  }

  componentDidMount() {
    this.getDeployments().then(result => this.setState( { deployments: result }))
    this.getDevices().then(result => this.setState({ devices: result}))
  }

  render() {

    const { deployments, devices } = this.state;

    return (
      <div className="App">

        {/* <img src="logo.png" />
        <PageHeader title="Welcome to Divenact">                     
          <Paragraph>
            This tool is part of the ENACT project and is used to automatically diversify and manage IoT fleets.
          </Paragraph>                 
    </PageHeader> */}

        <Layout style={{ minHeight: '100vh' }}>

        {/* <Header></Header> */}
          
        <Content style={{ background: '#fff', padding: 0, textAlign: 'left' }}>
          
            {/* <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px', padding: '10px 0 10 0' }} >
              <Menu.Item key="logo" onClick={window.location.href='#'}><img style={{ height: '60px', padding: '15px'}} src="https://enact-project.eu/img/logo-enact-blue2.png" alt="logo enact" /></Menu.Item>              
              <Menu.Item key="1" onClick={this.controlarea}><Icon type="control" />Control</Menu.Item>
              <Menu.Item key="2" onClick={this.modelarea}><Icon type="profile" />Repository</Menu.Item>              
            </Menu> */}

            <Tabs defaultActiveKey="1">
              <TabPane disabled key="logo" tab={<span><img style={{ height: '40px'}} src="https://enact-project.eu/img/logo-enact-blue2.png" alt="logo enact" /></span>}>Tab 1</TabPane>
              <TabPane key="1" tab={<span><Icon type="branches" />Variants</span>}>
                <VariantArea2 />
              </TabPane>              
              <TabPane key="2" tab={<span><Icon type="book" />Templates</span>}>
                <TemplateArea2 />
              </TabPane>
              <TabPane key="3" tab={<span><Icon type="deployment-unit" />Deployments</span>}>
                <DeploymentArea />
              </TabPane>
              <TabPane key="4" tab={<span><Icon type="control" />Control</span>}>
                <ControlArea />
              </TabPane>
              <TabPane key="5" tab={<span><Icon type="profile" />Repository</span>}>
                <ModelArea />
              </TabPane>
            </Tabs>  

        </Content>

        {/* <Content>
          <div>
            {this.state.area == AreaEnum.CONTROL && <ControlArea />}
            {this.state.area == AreaEnum.MODEL && <ModelArea /> }
            {this.state.area == AreaEnum.RESERVED && <Option2 />}
          </div> 
        </Content> */}
          
        <Footer>
          <p>This work is supported by <a href="https://www.enact-project.eu/">ENACT</a>.</p>
          <p> Please visit <a href="https://github.com/SINTEF-9012/divenact"><Icon type="github" /></a> for further details.</p>
        </Footer>
        
        </Layout>    
                
      </div>
    );
  }

  createDeployment = () => {
    const deployment = prompt('Enter your deployment: ');
    if (!deployment) return;
    axios
      .post('/api/deployments/create', { deployment })
      .then(res => this.setState({ deployments: [...this.state.deployments, res.data.newDeployment] }))
      .catch(err => alert(`Failed to create deployment\n${JSON.stringify(err)}`));
  };

  deleteDeployments = () => {
    this.setState({ deployments: [] });
    const doDelete = window.confirm('Delete all deployments?');
    if (!doDelete) return;
    axios
      .delete('/api/deployments/')
      .then(res => this.setState({ deployments: [] }))
      .catch(err => alert(`Failed to delete all deployments\n${JSON.stringify(err)}`));
  };

  seedDeployments = () => {
    const doSeed = window.confirm('Do you want to seed random data?');
    if (!doSeed) return;
    axios
      .post('/api/deployments/seed', {})
      .then(() => {
        axios
          .get('/api/deployments/')
          .then(res => this.setState({ deployments: res.data }))
          .catch(alert);
      })
      .catch(alert);
  };

  async getDevices(){
    return (await axios.get('api/device/')).data;
  }

  async getDeployments(){
    return (await axios.get('api/deployment')).data;
  }

  production = async ()=>{
    this.setState({ deployments: [] });
    const variant = prompt('Variant name');
    let result = await axios.put(`api/global/production/${variant}`);
    this.setState({
      devices: await this.getDevices(),
      deployments: await this.getDeployments()
    })
  }

  op1 = ()=>{
    window.confirm("op1")
    this.setState({ option: 'op1'})
  }

  modelarea = ()=>{
    this.setState( {area: AreaEnum.MODEL} );
  }

  controlarea = ()=>{
    this.setState( {area: AreaEnum.CONTROL} );
  }

  templatearea = ()=>{
    this.setState( {area: AreaEnum.TEMPLATE} );
  }

  vairuantarea = ()=>{
    this.setState( {area: AreaEnum.VARIANT} );
  }

}

export default App;