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
      // {
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
    this.nestedColumns = [      
      {
        title: 'Deployments',
        dataIndex: 'id',
        render: (text, record) => (          
          <Button type="link" icon='deployment-unit' onClick={() => this.props.callbackFromParent('3')}>{record.id}</Button> 
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
              expandRowByClick={true}
              expandedRowRender={record => 
                <span>
                  <ReactJson src={record} enableClipboard={false} />
                  <Table columns={this.nestedColumns} dataSource={this.props.deployments} pagination={false}/>
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

}



