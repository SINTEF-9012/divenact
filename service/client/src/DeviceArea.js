import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Dropdown, Icon, Table, Typography, Popconfirm, Tooltip, Popover, Badge, Tag } from 'antd';
import { JsonEditor as Editor } from 'jsoneditor-react';
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
        this.props.deviceTags[record.id].status == 'failed' ? <span><Badge status="error"/>{record.id}</span> : <span><Badge status="success"/>{record.id}</span>
        )
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: (text, record) => (          
          (this.props.deviceTags[record.id]) &&
            Object.keys(this.props.deviceTags[record.id]).map((key, i) => <Tag color={colors[i]}>{key}: {this.props.deviceTags[record.id][key]}</Tag>)      
        ),
        width: 1000
      },     
      {
        title: 'Actions',
        width: 80,
        align: 'center',
        render: (text, record) => (
          <span style={{float: 'right'}}>
            <ButtonGroup size='small' type="dashed"> 
              <Tooltip title="Put this device into a safe mode"><Button type={this.props.deviceTags[record.id] && this.props.deviceTags[record.id].status == 'failed' ? 'danger' : 'primary'} icon="alert" ghost onClick={() => this.tagDevice(record.id, {environment : 'safe-mode'})} /></Tooltip>
              <Tooltip title="Put all devices affected by this deployment into a safe mode"><Button type={this.props.deviceTags[record.id] && this.props.deviceTags[record.id].status == 'failed' ? 'danger' : 'primary'} icon="alert" ghost onClick={() => console.log("SAFE MODE!")} /></Tooltip>         
              {/* <Tooltip title="View & Edit"><Button type="primary" icon="edit" onClick={() => this.editDeployment(record)} ghost /></Tooltip> */}
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
          <Button type="link" icon='deployment-unit' onClick={() => this.props.callbackFromParent('3')}>{record}</Button> 
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
    return (await axios.put('api/device/' + device, tags));
  }
}



