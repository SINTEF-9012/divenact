import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Dropdown, Icon, Table, Typography, Popconfirm, Tooltip, Popover, Badge } from 'antd';
import axios from 'axios';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ReactJson from 'react-json-view'

const { Content } = Layout;
const ButtonGroup = Button.Group;

export class DeploymentArea extends Component {
  constructor(props) {
    super(props);
    this.columns = [      
      {
        title: 'Deployment ID',
        dataIndex: 'id',  
        render: (record) => (          
           <Badge count={(Object.keys(this.state.appliedDevices).length > 0) ? this.state.appliedDevices[record].length : 0}>{record}</Badge>
        )  
      },      
      
      //{
      //   title: 'Actions',
      //   width: 180,
      //   align: 'center',
      //   render: (text, record) => (
      //     <span style={{float: 'right'}}>
      //       <ButtonGroup size='small' type="dashed">              
      //         <Tooltip title="View & Edit"><Button type="primary" icon="edit" onClick={() => this.editDeployment(record)} ghost /></Tooltip>
      //         <Tooltip title="Copy"><Button type="primary" icon="copy" ghost /></Tooltip>
      //         <Tooltip title="Save"><Button type="primary" icon="save" onClick={()=>{this.saveDeployment()}} ghost /></Tooltip>
      //         <Tooltip title="Delete"><Popconfirm title="Sure to delete?" onConfirm={() => this.deleteDeployment(record.id)}><Button type="primary" icon="delete" ghost /></Popconfirm></Tooltip>
      //         {/* <Tooltip title="Push variant"><Button type="primary" icon="rocket" onClick={()=>{this.pushVariant()}} ghost /></Tooltip> */}
      //       </ButtonGroup>
      //     </span>          
      //   )
      // }    
    ]
    this.nestedColumnsApplied = [      
      {
        title: 'Applied devices',
        dataIndex: 'applied',
        render: (text, record) => (
          <span><Icon type='bulb'></Icon> {record.deviceId} </span>
        )      
      }       
    ]
    this.nestedColumnsTargeted = [      
      {
        title: 'Targeted devices',
        dataIndex: 'targeted',
        render: (text, record) => (
          <span><Icon type='bulb'></Icon> {record.deviceId} </span>
        )      
      }       
    ]
    this.state = {
      deployments: [],
      devices: [],
      //forEdit: null, 
      //edited: null,
      appliedDevices: {},
      targetedDevices: []
    };
    this.editor = React.createRef();
  }

  render() {

    const { deployments, devices, appliedDevices, targetedDevices } = this.state;    

    return (
      
      <Layout>

      <Content>        
        <Row>
          <Col span={24}>
            <Table
              //bordered 
              rowKey={record => record.id}
              size='small'
              dataSource={deployments}
              columns={this.columns}
              expandRowByClick={true}
              expandedRowRender={record => 
                <span><ReactJson src={record} enableClipboard={false} />
                <Table columns={this.nestedColumnsApplied} dataSource={targetedDevices} pagination={false}/>
                <Table columns={this.nestedColumnsTargeted} dataSource={targetedDevices} pagination={false}/></span>}
              //expandedRowKeys={expandedRowRender} 
              // onExpand={(expanded, record) => {this.handleExpandRow(expanded, record) && this.editVariant(record)}}
              // expandedRowRender={record => <p style={{ margin: 0 }}><div>
              //   <div>
              //     <ButtonGroup>
              //       <Button type="dashed" icon="edit" />
              //       <Button type="dashed" icon="copy" />
              //       <Button type="dashed" icon="save" onClick={()=>{this.saveVariant()}} />
              //       <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteVariant(record.id)}><Button type="dashed" icon="delete" /></Popconfirm>
              //     </ButtonGroup>
              //   </div>
              //   {/* <Editor mode='form' history='true' value={forEdit} ref={this.editor} onChange={this.handleChange}/> */}
              //   </div></p>}
              pagination={{ pageSize: 50 }} 
              // scroll={{ y: 1240 }}
              // onExpand={(expanded, record) => {
              //   this.editVariant(record); }}
            />
          </Col>
          {/* <Col>
          {forEdit!=null && 
          <div>
            <Button onClick={()=>{this.saveVariant()}}>Save</Button>
            <Editor value={forEdit} ref={this.editor} onChange={this.handleChange}/>
          </div>
          }
          </Col> */}            
        {/* <Col span={12}>                     
          <Editor history='true' value={forEdit} ref={this.editor} onChange={this.handleChange} />            
        </Col>  */}
        </Row>    
      </Content>
       
      </Layout>   
    );
  }  
  
  componentDidMount() {
    this.getAppliedDevices().then(result => this.setState({ appliedDevices: result }));  
    this.getDeployments().then(result => this.setState({ deployments: result }));    
    this.getDevices().then(result => this.setState({ devices: result }));      
    //this.getAppliedDevices('env_production_genesis_nodered').then(result => this.setState({ appliedDevices: result }));
    this.getTargetedDevices('env_production_genesis_nodered').then(result => this.setState({ targetedDevices: result }));
  }  

  editDeployment = (record) => {
    this.setState({forEdit: record}, ()=> {
      this.editor.current.componentDidMount()
    })
  }

  createDeployment = () => {
    const deployment = prompt('Enter your deployment: ');
    if (!deployment) return;
    axios
      .post('/api/deployments/create', { deployment })
      .then(res => this.setState({ deployments: [...this.state.deployments, res.data.newDeployment] }))
      .catch(err => alert(`Failed to create deployment\n${JSON.stringify(err)}`));
  };

  deleteDeployment = (deploymentid) => {
    const doDelete = window.confirm('Delete this deployment?');
    if (!doDelete) return;
    axios.delete(`api/deployment/${deploymentid}`);
    this.componentDidMount()
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

  getDevices = async () => {
    return (await axios.get('api/device/')).data;
  }

  getDeployments = async () => {

    // let deployments = (await axios.get('api/deployment')).data;
    // let applDevices = {};
    // deployments.forEach(async (deployment) => {
    //   // let queryResults = axios.get('api/deployment/' + deployment.id + '/applied').data;
    //   // console.log("TESTING");
    //   // console.log(queryResults);
    //   var array = [];

    //   Array.from((await axios.get('api/deployment/' + deployment.id + '/applied')).data).forEach(async (device) => {
    //     // console.log("TESTING");
    //     // console.log(await this.getAppliedDevices2(deployment.id));
    //     // array = 
    //     // console.log(array);
    //     applDevices[deployment.id] = (await this.getAppliedDevices2(deployment.id));  
    //   });
    //   //   array.push(device);
    //   // })           
    //   //applDevices[deployment.id] = array;      
    // })    
    // this.setState({ appliedDevices: applDevices });
    // console.log(this.state.appliedDevices);

    return (await axios.get('api/deployment')).data;
  }

  getAppliedDevices = async () => {       
    let result = {};
    let deployments = (await axios.get('api/deployment')).data;
    deployments.forEach(async (deployment) => {
      result[deployment.id] = (await axios.get('api/deployment/' + deployment.id + '/applied')).data;
    });
    return result;    
  }

  getAppliedDevices2 = async (deploymentId) => {       
    let result = {};
    let appliedDevices = (await axios.get('api/deployment/' + deploymentId + '/applied')).data;
    var array = [];
    Array.from(appliedDevices).forEach(device => {
      array.push(device);
    })     
    result[deploymentId] = array;
    console.log(result);
    return result;
    //return appliedDevices;    
  }

  getTargetedDevices = async (deploymentId) => {       
    let targetedDevices = (await axios.get('api/deployment/' + deploymentId + '/targeted')).data; 
    return targetedDevices;    
  }  

  // production = async () => {
  //   this.setState({ deployments: [] });
  //   const variant = prompt('Variant name');
  //   let result = await axios.put(`api/global/production/${variant}`);
  //   this.setState({
  //     devices: await this.getDevices(),
  //     deployments: await this.getDeployments()
  //   })
  // }
  
}



