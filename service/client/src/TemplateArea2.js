import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Icon, Table, Collapse, Popconfirm, Tooltip, Tag, Input } from 'antd';
import axios from 'axios';
import { ContentAreaEnum, DeploymentDeviceArea, ProductionArea, PreviewArea } from './ContentAreas'
import { TemplateContentAreaEnum, TemplateArea, VariantArea} from './TemplateContentArea';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;
const colors = ["blue","red","green"];

const ButtonGroup = Button.Group;

export class EditableTagGroup extends Component {
  
  //TODO: save tags on the fly
  //TODO: fetch existing tags from the template
  state = {
    //tags: ['Production', 'Preview'],
    inputVisible: false,
    inputValue: '',
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  saveInputRef = input => this.input = input

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}

export class TemplateArea2 extends Component {
  constructor(props) {
    super(props);
    this.columns = [      
      {
        title: 'Template ID',
        dataIndex: 'id',  
        width: 200,     
      },      
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: (text, record) => (
          (this.state.tags[record.id]) &&
            Object.keys(this.state.tags[record.id]).map((key, i) => <Tag closable color={colors[i]}>{key}: {this.state.tags[record.id][key]}</Tag>)      
        ),
        width: 1000,
      },   
      {
        title: 'Actions',
        width: 180,
        align: 'center',
        render: (text, record) => (
          <span style={{float: 'right'}}>
            <ButtonGroup size='small' type="dashed">              
              <Tooltip title="Create variant"><Button type="primary" icon="fork" onClick={() => this.createVariant(record)} ghost /></Tooltip>
              <Tooltip title="View & Edit"><Button type="primary" icon="edit" onClick={() => this.editTemplate(record)} ghost /></Tooltip>
              <Tooltip title="Copy"><Button type="primary" icon="copy" onClick={() => this.copyTemplate(record)} ghost /></Tooltip>
              <Tooltip title="Save "><Button type="primary" icon="save" onClick={()=>{this.saveTemplate()}} ref={this.saveButton} ghost /></Tooltip>
              <Tooltip title="Delete"><Popconfirm title="Are you sure?" onConfirm={() => this.deleteTemplate(record.id)}><Button type="primary" icon="delete" ghost /></Popconfirm></Tooltip>
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
      templates: [],
      tags: {},
      forEdit: null, 
      edited: null
    };
    this.editor = React.createRef();
  }

  render() {

    const { templates, forEdit, tags } = this.state; 

    return (
      
        <Layout>

        <Content>        
          <Row>
            <Col span={12}>
              <Table
                //bordered 
                rowKey={record => record.id}
                size='small'
                dataSource={templates}
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
          <Col span={12}>
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

  componentDidMount() {
    this.getTemplates().then(result => { this.setState({ templates: result }) });
    this.getTags().then(result => {this.setState({tags: result})});
  }

  handleChange = (value) => {
    this.setState({edited: value});
  }

  getTemplates = async () => {
    return (await axios.get('api/template/')).data;
  }

  getTags = async () => {
    let result = {};
    let templates = (await axios.get('api/template/')).data;
    templates.forEach((template) => {
      result[template.id] = template.property.predefinedtag;      
    });
    return result;
  }

  saveTemplate = async () =>{
    const {edited} = this.state
    if(edited){
      let result = await axios.put(`api/template/${edited.id}`, edited)
      this.componentDidMount()
    }
    else{
      window.confirm("No change to save");
    }
  }

  editTemplate = (record) => {
    this.setState({forEdit: record}, ()=>{
      this.editor.current.componentDidMount()
    })
    
  }

  copyTemplate = async (record) => {
    const id = prompt('Enter new id');
    
    if(!id) return;
    let newTemplate = {...record, id: id};
    delete newTemplate._id;
    this.setState({
      templates: [...this.state.templates, newTemplate],
      edited: newTemplate,
      foredit: newTemplate
    })
  }

  deleteTemplate = (templateid) => {
    axios.delete(`api/template/${templateid}`);
    this.componentDidMount()
  }  

  //TODO - check if there are any linked variants before deleting
  getVariants = async () => {
    return (await axios.get('api/variant/')).data;
  }

  //TODO - create new variant for the given template
  createVariant = () => {    
    //let Tabs = React.createRef();
    //this.Tabs.current.activeKey="2";
  }

  templates = () => {
    this.setState({
      contentarea: TemplateContentAreaEnum.TEMPLATE
    })
  }

  variants = () =>{
    this.setState({
      contentarea: TemplateContentAreaEnum.VARIANT
    })
  }  

}

