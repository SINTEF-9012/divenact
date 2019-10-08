import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Icon, Table, Collapse, Popconfirm } from 'antd';
import axios from 'axios';
import { ContentAreaEnum, DeploymentDeviceArea, ProductionArea, PreviewArea } from './ContentAreas'
import { TemplateContentAreaEnum, TemplateArea, VariantArea} from './TemplateContentArea';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;

export class VariantArea2 extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Template',
        dataIndex: 'template',
      },
      {
        title: 'Actions',
        render: (text, record) => (
          <div>
          {/* <a onClick={() => this.editVariant(record)}>edit </a> */}
          <a>save </a>
          <a>copy </a>
          <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteVariant(record.id)}>
          <a>delete</a></Popconfirm>
          </div>
        )
      }
    ]
    this.state = {
      variants: [],
      forEdit: null, 
      edited: null
    };
    this.editor = React.createRef();
  }

  render() {

    const { variants, forEdit } = this.state;
    
    return (
      
        <Layout>

        <Content>

        
          <Row>
            <Col>
              <Table
                bordered 
                size='small'
                dataSource={variants}
                columns={this.columns}
                expandedRowRender={record => <p style={{ margin: 0 }}><div>
                  <Button onClick={()=>{this.saveVariant()}}>Save</Button>
                  <Editor value={forEdit} ref={this.editor} onChange={this.handleChange}/>
                  </div></p>}
                pagination={{ pageSize: 50 }} 
                // scroll={{ y: 1240 }}
                onExpand={(expanded, record) => {
                  this.editVariant(record);   }}
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

  componentDidMount() {
    this.getVariants().then(result => { this.setState({ variants: result }) });
  }

  handleChange = (value) => {
    this.setState({edited: value});
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