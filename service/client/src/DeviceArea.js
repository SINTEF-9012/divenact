import React, { Component } from 'react';
import { Button, Layout, Col, Row, Table, Tooltip, Badge, Tag, Dropdown, Menu } from 'antd';
//import { JsonEditor as Editor } from 'jsoneditor-react';
import ReactJson from 'react-json-view'
import axios from 'axios';

const { Content } = Layout;
const ButtonGroup = Button.Group;
const colors = ["blue","red","green"];

export class DeviceArea extends Component {
  constructor(props) {
    super(props);
    this.columns = [      
      {
        title: 'Device ID',
        dataIndex: 'id',
        width: 200,
        render: (text, record) => (
        this.props.deviceTags[record.id].status === 'failed' ? <span><Badge status="error"/>{record.id}</span> : <span><Badge status="success"/>{record.id}</span>
        )
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: (text, record) => (          
          (this.props.deviceTags[record.id]) &&
            Object.keys(this.props.deviceTags[record.id]).map((key, i) => <Tag color={colors[i]}>{key}: {this.props.deviceTags[record.id][key]}</Tag>)      
        ),
        width: 600
      },     
      {
        title: 'Actions',
        width: 400,
        align: 'center',
        render: (text, record) => (
          <span style={{float: 'right'}}>
            <ButtonGroup size='small' type="dashed"> 
              <Tooltip title="Emulate device failure"><Button type="primary" icon="bug" onClick={() => this.tagDevice(record.id, {status: 'failed'})} ghost /></Tooltip>
              <Tooltip title="Fix device"><Button type="primary" icon="tool" onClick={() => this.tagDevice(record.id, {status: 'running'})} ghost /></Tooltip>
              
              <Dropdown overlay={
                <Menu>
                <Menu.Item key="0">
                  <Button type="link" onClick={() => this.tagDevice(record.id, {environment : 'production'})}>Production</Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                  <Button type="link" onClick={() => this.tagDevice(record.id, {environment : 'preview'})}>Preview</Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                  <Button type="link" onClick={() => this.tagDevice(record.id, {environment : 'testing'})}>Testing</Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="4">
                  <Button type="link" onClick={() => this.tagDevice(record.id, {environment : 'safe-mode'})}>Safe mode</Button>
                </Menu.Item>
              </Menu>
              }><Tooltip title="Put device into ..."><Button type={this.props.deviceTags[record.id] && this.props.deviceTags[record.id].status === 'failed' ? 'danger' : 'primary'} icon="tag" ghost /></Tooltip></Dropdown>
              
              <Dropdown overlay={
                <Menu>
                <Menu.Item key="0">
                  <Button type="link" onClick={() => this.tagDevices(record.id, {environment : 'production'})}>Production</Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                  <Button type="link" onClick={() => this.tagDevices(record.id, {environment : 'preview'})}>Preview</Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                  <Button type="link" onClick={() => this.tagDevices(record.id, {environment : 'testing'})}>Testing</Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="4">
                  <Button type="link" onClick={() => this.tagDevices(record.id, {environment : 'safe-mode'})}>Safe mode</Button>
                </Menu.Item>
              </Menu>
              }><Tooltip title="Put all affected devices into ..."><Button type={this.props.deviceTags[record.id] && this.props.deviceTags[record.id].status === 'failed' ? 'danger' : 'primary'} icon="tags" ghost /></Tooltip></Dropdown>         
              
              {/* <Tooltip title="Copy"><Button type="primary" icon="copy" ghost /></Tooltip>
              <Tooltip title="Save"><Button type="primary" icon="save" onClick={()=>{this.saveDeployment()}} ghost /></Tooltip>
              <Tooltip title="Delete"><Popconfirm title="Sure to delete?" onConfirm={() => this.deleteDeployment(record.id)}><Button type="primary" icon="delete" ghost /></Popconfirm></Tooltip> */}
              {/* <Tooltip title="Push variant"><Button type="primary" icon="rocket" onClick={()=>{this.pushVariant()}} ghost /></Tooltip> */}
            </ButtonGroup>
          </span>          
        )
      }    
    ]
    this.nestedColumns = [      
      {
        title: 'Active deployments',
        dataIndex: 'id',
        render: (text, record) => (          
          <Button type="link" icon='deployment-unit' onClick={() => this.props.callbackTabChange('3')}>{record}</Button> 
        )      
      }      
    ]
    this.state = {
      //add if needed      
    };
    this.editor = React.createRef();
  }

  render() {    

    return (      
      <Layout>
      <Content>        
        <Row>
          <Col span={24}>
            <Table
              //bordered 
              rowKey={record => record.id}
              size='small'
              dataSource={this.props.devices}
              columns={this.columns}
              //expandRowByClick={true}
              expandedRowRender={record => 
                <span>
                  <ReactJson src={record} enableClipboard={false} />
                  <Table columns={this.nestedColumns} dataSource={this.props.activeDeployments[record.id] ? Object.values(this.props.activeDeployments[record.id]) : []} pagination={false}/>
                  </span>
                }              
              pagination={{ pageSize: 50 }} 
            />
          </Col> 
        </Row>    
      </Content>       
      </Layout>   
    );
  }  
  
  componentDidMount() {
    //add if needed
  } 

  /**
   * Tag selected device (e.g. to put it into a safe mode)
   */
  tagDevice = async (device, tags) => {
    let result = await axios.put('api/device/' + device, tags);
  }

  /**
   * Tag all devices affected by a deployment (e.g. to put it into a safe mode)
   */
  tagDevices = async (device, tags) => {
    let faultyDeployments = this.props.activeDeployments[device];
    console.log("deployments" + JSON.stringify(faultyDeployments));
    faultyDeployments.forEach(deployment => {
      let faultyDevices = this.props.appliedDevices[deployment];
      console.log(this.props.appliedDevices[deployment]);
      faultyDevices.forEach(fDevice => {
        console.log(fDevice.deviceId);
        this.tagDevice(fDevice.deviceId, tags);        
      })
    });
    
  }
}



