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
import {DeviceArea} from './DeviceArea';

const { Header, Footer, Sider, Content } = Layout;
const { Paragraph } = Typography;
const { TabPane } = Tabs;

const operations = <Button>Extra Action</Button>;

// var AreaEnum = {
//   CONTROL: 1,
//   MODEL: 2,
//   TEMPLATE: 3,
//   VARIANT: 4,
//   DEPLOYMENT: 5,
//   properties: {
//     1: {name: "control", value: 1, code: "C"},
//     2: {name: "model", value: 2, code: "M"},    
//     3: {name: "template", value: 3, code: "T"},
//     4: {name: "variant", value: 4, code: "V"},
//     5: {name: "deployment", value: 5, code: "R"}
//   }
// };

// class Option1 extends Component{
//   render(){
//     return(
//       <div>I'm One</div>
//     )
//   }
// }

// class Option2 extends Component{
//   render(){
//     return(
//       <div>I'm Two</div>
//     )
//   }
// }

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //area: AreaEnum.GLOBAL,
      deployments: [],
      templates: [],
      variants: [],
      //forEdit: null, 
      //edited: null,
      appliedDevices: {},
      targetedDevices: {}
    };
    this.Tabs = React.createRef();
  }

  componentDidMount() {
    this.getDeployments().then(result => this.setState({ deployments: result }))
      .then(() => this.getAppliedDevices()).then(result => this.setState({ appliedDevices: result }))
      .then(() => this.getTargetedDevices()).then(result => this.setState({ targetedDevices: result }));    
    this.getDevices().then(result => this.setState({ devices: result }));
    this.getTemplates().then(result => { this.setState({ templates: result }) });
    this.getVariants().then(result => { this.setState({ variants: result }) });
  }

  render() {

    const { deployments, devices, templates, variants, appliedDevices, targetedDevices } = this.state;

    return (
      <div className="App">

        <Layout style={{ minHeight: '100vh' }}>

        {/* <Header></Header> */}
          
        <Content style={{ background: '#fff', padding: 0, textAlign: 'left' }}>          
            <Tabs defaultActiveKey="1" id="Tabs" ref={this.Tabs} tabBarExtraContent={operations} >
              <TabPane disabled key="logo" tab={<span><img style={{ height: '40px'}} src="https://enact-project.eu/img/logo-enact-blue2.png" alt="logo enact" /></span>}>Tab 1</TabPane>
              <TabPane key="1" tab={<span><Icon type="book" />Templates</span>}>
                <TemplateArea2 templates={templates} variants={variants} />
              </TabPane>
              <TabPane key="2" tab={<span><Icon type="branches" />Variants</span>}>
                <VariantArea2 variants={variants} templates={templates} />
              </TabPane>
              <TabPane key="3" tab={<span><Icon type="deployment-unit" />Deployments</span>}>
                <DeploymentArea deployments={deployments} appliedDevices={appliedDevices} targetedDevices={targetedDevices} />
              </TabPane>
              <TabPane key="4" tab={<span><Icon type="bulb" />Devices</span>}>
                <DeviceArea devices={devices} deployments={deployments} />
              </TabPane>
              <TabPane key="5" tab={<span><Icon type="control" />Control</span>}>
                <ControlArea />
              </TabPane>
              <TabPane key="6" tab={<span><Icon type="profile" />Repository</span>}>
                <ModelArea />
              </TabPane>
            </Tabs> 
        </Content>        
          
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

  // seedDeployments = () => {
  //   const doSeed = window.confirm('Do you want to seed random data?');
  //   if (!doSeed) return;
  //   axios
  //     .post('/api/deployments/seed', {})
  //     .then(() => {
  //       axios
  //         .get('/api/deployments/')
  //         .then(res => this.setState({ deployments: res.data }))
  //         .catch(alert);
  //     })
  //     .catch(alert);
  // };

  /**
   * Get edge devices in the IoT Hub
   */
  getDevices = async () => {
    return (await axios.get('api/device/')).data;
  }

  /**
   * Get deployments in the IoT Hub
   */
  getDeployments = async () => {
    return (await axios.get('api/deployment')).data;
  }

  /**
   * Get variants stored in MongoDB
   */
  getVariants = async () => {
    return (await axios.get('api/variant/')).data;
  }

  /**
   * Get variants stored in MongoDB
   */
  getTemplates = async () => {
    return (await axios.get('api/template/')).data;
  }

  // /**
  //  * Get a map of deployments and devices to which they apply
  //  */
  // getTemplateVariants = async () => {       
  //   let result = {};
  //   //let deployments = (await axios.get('api/deployment')).data;
  //   this.state.templates.forEach(async (template) => {
  //     this.state.variants.forEach(async (variant) => {
  //       variant.template == template.id && 
  //     }
  //     result[template.id] = (await axios.get('api/deployment/' + deployment.id + '/applied')).data;
  //   });
  //   return result;    
  // }

  /**
   * Get a map of deployments and devices to which they apply
   */
  getAppliedDevices = async () => {       
    let result = {};
    //let deployments = (await axios.get('api/deployment')).data;
    this.state.deployments.forEach(async (deployment) => {
      result[deployment.id] = (await axios.get('api/deployment/' + deployment.id + '/applied')).data;
    });
    return result;    
  }

  /**
   * Get a map of deployments and devices at which they target (but not necessarily applied yet)
   */
  getTargetedDevices = async () => {       
    let result = {};
    //let deployments = (await axios.get('api/deployment')).data;
    this.state.deployments.forEach(async (deployment) => {
      result[deployment.id] = (await axios.get('api/deployment/' + deployment.id + '/targeted')).data;
    });
    return result;    
  }

  // production = async ()=>{
  //   this.setState({ deployments: [] });
  //   const variant = prompt('Variant name');
  //   let result = await axios.put(`api/global/production/${variant}`);
  //   this.setState({
  //     devices: await this.getDevices(),
  //     deployments: await this.getDeployments()
  //   })
  // }

  // op1 = ()=>{
  //   window.confirm("op1")
  //   this.setState({ option: 'op1'})
  // }

  // modelarea = ()=>{
  //   this.setState( {area: AreaEnum.MODEL} );
  // }

  // controlarea = ()=>{
  //   this.setState( {area: AreaEnum.CONTROL} );
  // }

  // templatearea = ()=>{
  //   this.setState( {area: AreaEnum.TEMPLATE} );
  // }

  // vairuantarea = ()=>{
  //   this.setState( {area: AreaEnum.VARIANT} );
  // }

}

export default App;