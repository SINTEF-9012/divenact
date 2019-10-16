import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Dropdown, Icon, Table, Typography, Popconfirm, Tooltip, Popover, Badge } from 'antd';
import axios from 'axios';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ReactJson from 'react-json-view'

const { Content } = Layout;
const ButtonGroup = Button.Group;

export class DeviceArea extends Component {
  constructor(props) {
    super(props);
    this.columns = [      
      {
        title: 'Device ID',
        dataIndex: 'id'
      },      
      {
        title: 'Actions',
        width: 180,
        align: 'center',
        render: (text, record) => (
          <span style={{float: 'right'}}>
            <ButtonGroup size='small' type="dashed">              
              <Tooltip title="View & Edit"><Button type="primary" icon="edit" onClick={() => this.editDeployment(record)} ghost /></Tooltip>
              <Tooltip title="Copy"><Button type="primary" icon="copy" ghost /></Tooltip>
              <Tooltip title="Save"><Button type="primary" icon="save" onClick={()=>{this.saveDeployment()}} ghost /></Tooltip>
              <Tooltip title="Delete"><Popconfirm title="Sure to delete?" onConfirm={() => this.deleteDeployment(record.id)}><Button type="primary" icon="delete" ghost /></Popconfirm></Tooltip>
              {/* <Tooltip title="Push variant"><Button type="primary" icon="rocket" onClick={()=>{this.pushVariant()}} ghost /></Tooltip> */}
            </ButtonGroup>
          </span>          
        )
      }    
    ]
    this.nestedColumns = [      
      {
        title: 'Affected devices',
        dataIndex: 'id',
        render: (text, record) => (
          <span><Icon type='laptop'></Icon> {record.id}</span>
        )      
      }   
    ]
    this.state = {
      deployments: [],
      devices: [],
      forEdit: null, 
      edited: null
    };
    this.editor = React.createRef();
  }

  render() {

    const { deployments, devices } = this.state;    

    return (
      
      <Layout>

      <Content>        
        <Row>
          <Col span={24}>
            <Table
              //bordered 
              rowKey={record => record.id}
              size='small'
              dataSource={devices}
              columns={this.columns}
              expandedRowRender={record => 
                <span><ReactJson src={record} enableClipboard={false} />
                <Table columns={this.nestedColumns} dataSource={devices} pagination={false}/></span>
                }              
              pagination={{ pageSize: 50 }} 
              // scroll={{ y: 1240 }}
              // onExpand={(expanded, record) => {
              //   this.editVariant(record); }}
            />
          </Col>                   
        {/* <Col span={12}>                     
          <Editor history='true' value={forEdit} ref={this.editor} onChange={this.handleChange} />            
        </Col>  */}
        </Row>    
      </Content>
       
      </Layout>   
    );
  }  
  
  componentDidMount() {
    this.getDeployments().then(result => this.setState({ deployments: result }))
    this.getDevices().then(result => this.setState({ devices: result }))
  } 

  async getDevices() {
    return (await axios.get('api/device/')).data;
  }

  async getDeployments() {
    return (await axios.get('api/deployment')).data;
  }  
  
}



