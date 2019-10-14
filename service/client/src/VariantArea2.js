import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Dropdown, Icon, Table, Collapse, Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import { ContentAreaEnum, DeploymentDeviceArea, ProductionArea, PreviewArea } from './ContentAreas'
import { TemplateContentAreaEnum, TemplateArea, VariantArea} from './TemplateContentArea';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;
const ButtonGroup = Button.Group;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#">Production</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a href="#">Preview</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <a href="#">Testing</a></Menu.Item>
    <Menu.Divider />
    <Menu.Item key="4">
      <a href="#">Safe mode</a>
    </Menu.Item>
  </Menu>
);

export class VariantArea2 extends Component {
  constructor(props) {
    super(props);
    this.columns = [      
      {
        title: 'Variant ID',
        dataIndex: 'id',        
      },
      {
        title: 'Template',
        dataIndex: 'template',
      },
      // {
      //   dataIndex: 'push',
      //   render: () => (
      //     <span>
      //       <Dropdown overlay={menu}>
      //         <a>
      //           Push to ... <Icon type="down" />
      //         </a>
      //       </Dropdown>
      //     </span>
      //   ),
      // },
      {
        title: 'Actions',
        width: 180,
        align: 'center',
        render: (text, record) => (
          <span style={{float: 'right'}}>
            <ButtonGroup size='small' type="dashed">
              <Dropdown overlay={menu}><Tooltip title="Push to ..."><Button type="primary" icon="rocket" onClick={() => this.editVariant(record)} ghost /></Tooltip></Dropdown>
              <Tooltip title="View & Edit"><Button type="primary" icon="edit" onClick={() => this.editVariant(record)} ghost /></Tooltip>
              <Tooltip title="Copy"><Button type="primary" icon="copy" ghost /></Tooltip>
              <Tooltip title="Save"><Button type="primary" icon="save" onClick={()=>{this.saveVariant()}} ghost /></Tooltip>
              <Tooltip title="Delete"><Popconfirm title="Sure to delete?" onConfirm={() => this.deleteVariant(record.id)}><Button type="primary" icon="delete" ghost /></Popconfirm></Tooltip>
              {/* <Tooltip title="Push variant"><Button type="primary" icon="rocket" onClick={()=>{this.pushVariant()}} ghost /></Tooltip> */}
            </ButtonGroup>
          </span>
          // {/* <a onClick={() => this.editVariant(record)}>edit </a> 
          // <a onClick={()=>{this.saveVariant()}}>save </a>
          // <a>copy </a>
          // <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteVariant(record.id)}>
          // <a>delete</a></Popconfirm>
          // </div> */}
        )
      }    
    ]
    this.state = {
      variants: [],
      forEdit: null, 
      edited: null,
      expandedRows: []
    };
    this.editor = React.createRef();
  }

  render() {

    const { variants, forEdit, expandedRows } = this.state; 

    return (
      
        <Layout>

        <Content>        
          <Row>
            <Col span={6}>
              <Table
                //bordered 
                rowKey={record => record.id}
                size='small'
                dataSource={variants}
                columns={this.columns}
                // expandedRowKeys={expandedRows} 
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
          <Col span={18}>
            {/* <ButtonGroup>
              <Button type="dashed" icon="edit" />
              <Button type="dashed" icon="copy" />
              <Button type="dashed" icon="save" onClick={()=>{this.saveVariant()}} />
              <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteVariant(record.id)}><Button type="dashed" icon="delete" /></Popconfirm>
            </ButtonGroup> */}            
            <Editor history='true' value={forEdit} ref={this.editor} onChange={this.handleChange} />            
          </Col> 
          </Row>    
        </Content>

          {/* <Sider> */}
            {/* Buttons to interact with API */}
           {/*  <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark">
              <Menu.Item key="1" onClick={this.templates}>
                <Icon type="book" />
                <span>Templates</span>
              </Menu.Item>
              <Menu.Item key="2" onClick={this.variants}>
                <Icon type="branches" />
                <span>Variants</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="deployment-unit" />
                <span>Diversify</span>
              </Menu.Item>
            </Menu>
          </Sider>

          <Content>
            {contentarea == TemplateContentAreaEnum.TEMPLATE&& <TemplateArea />}
            {contentarea == TemplateContentAreaEnum.VARIANT && <VariantArea />}
            {contentarea == TemplateContentAreaEnum.PREVIEW && <PreviewArea />}
            {contentarea == TemplateContentAreaEnum.DEFAULT && <Button>Hey</Button>}
          </Content> */}
        </Layout>   
    );
  }

  handleExpandRow = (expanded, record) => {
    const expandedRows = [];
    if (expanded) {
      expandedRows.push(record.id);
    }
    this.setState({ expandedRows });    
    //this.editVariant(record)    
  };

  componentDidMount() {
    this.getVariants().then(result => { this.setState({ variants: result }) });
  }

  handleChange = (value) => {
    this.setState({edited: value})    
  }

  getVariants = async () => {
    return (await axios.get('api/variant/')).data;
  }

  editVariant = (record) => {
    this.setState({forEdit: record}, ()=>{
      this.editor.current.componentDidMount()
    })
  }

  deleteVariant = (variantid) => {
    axios.delete(`api/variant/${variantid}`);
  }

  saveVariant = async () =>{
    const {edited} = this.state
    if(edited){
      let result = await axios.put(`api/variant/${edited.id}`, edited)
      this.componentDidMount()
    }
    else{
      window.confirm("No change to save");
    }
  }

  //push variant to production or preview
  pushVariant = async () =>{
    const variant = this.state.selected;
    if(!variant){
      window.confirm("Please select a variant first");
      return;
    }
    let result = await axios.put(`api/global/production/${variant}`);
    this.setState({
      contentarea: ContentAreaEnum.DEPLOYMENTDEVICE
    })
    this.deploymentdevice.current.componentDidMount();
  }  

  templates = () =>{
    this.setState({
      contentarea: TemplateContentAreaEnum.TEMPLATE
    })
  }

  variants = () =>{
    this.setState({
      contentarea: TemplateContentAreaEnum.VARIANT
    })
  }

  async getDevices() {
    return (await axios.get('api/device/')).data;
  }

  production = async () => {
    this.setState({
      contentarea: ContentAreaEnum.PRODUCTION
    })
  }

}