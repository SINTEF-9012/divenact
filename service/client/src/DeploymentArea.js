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
          this.props.appliedDevices[record] ? <Badge count={this.props.appliedDevices[record].length}>{record}</Badge> : <span>{record}</span>
        )  
      }          
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
      //add if needed
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
              dataSource={this.props.deployments}
              columns={this.columns}
              expandRowByClick={true}
              expandedRowRender={record => 
                <span><ReactJson src={record} enableClipboard={false} />
                <Table columns={this.nestedColumnsApplied} dataSource={this.props.appliedDevices[record.id]} pagination={false}/>
                <Table columns={this.nestedColumnsTargeted} dataSource={this.props.targetedDevices[record.id]} pagination={false}/></span>}              
              pagination={{ pageSize: 50 }} 
              // scroll={{ y: 1240 }}              
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