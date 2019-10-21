import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Dropdown, Icon, Table, Typography, Popconfirm, Tooltip, Popover, Badge } from 'antd';
import axios from 'axios';
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
          this.state.appliedDevices[record] ? <Badge count={this.state.appliedDevices[record].length}>{record}</Badge> : <span>{record}</span>
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
        dataIndex: 'deviceId',
        render: (text, record) => (
          <span><Icon type='bulb'></Icon> {record.deviceId} </span>
        )      
      }       
    ]
    this.nestedColumnsTargeted = [      
      {
        title: 'Targeted devices',
        dataIndex: 'deviceId',
        render: (text, record) => (
          <span><Icon type='bulb'></Icon> {record.deviceId} </span>
        )      
      }       
    ]
    this.state = {
      deployments: [],
      //forEdit: null, 
      //edited: null,
      appliedDevices: {},
      targetedDevices: {}
    };
    this.editor = React.createRef();
  }

  render() {

    const { deployments, appliedDevices, targetedDevices } = this.state;    

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
                <Table columns={this.nestedColumnsApplied} dataSource={appliedDevices[record.id]} pagination={false}/>
                <Table columns={this.nestedColumnsTargeted} dataSource={targetedDevices[record.id]} pagination={false}/></span>}
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
    
    //this.getAppliedDevices('env_production_genesis_nodered').then(result => this.setState({ appliedDevices: result })); 
    //this.getAppliedDevices().then(result => this.setState({ appliedDevices: result }));
    //this.getTargetedDevices().then(result => this.setState({ targetedDevices: result })); 
    this.getDeployments().then(result => this.setState({ deployments: result }))
      .then(() => this.getAppliedDevices()).then(result => this.setState({ appliedDevices: result }))
      .then(() => this.getTargetedDevices()).then(result => this.setState({ targetedDevices: result }));    
    this.getDevices().then(result => this.setState({ devices: result }));      
       
  }    
  
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

  getTargetedDevices2 = async (deploymentId) => {       
    let targetedDevices = (await axios.get('api/deployment/' + deploymentId + '/targeted')).data; 
    return targetedDevices;    
  }    
  
}