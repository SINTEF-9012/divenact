import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Menu, Icon, Table, Collapse, Popconfirm, Tooltip, Tag, Input } from 'antd';
import axios from 'axios';
import { ContentAreaEnum, DeploymentDeviceArea, ProductionArea, PreviewArea } from './ContentAreas'
import { TemplateContentAreaEnum, TemplateArea, VariantArea} from './TemplateContentArea';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const { Header, Footer, Sider, Content } = Layout;
const colors = ["blue","red","green"];

const ButtonGroup = Button.Group;

// export class EditableTagGroup extends Component {
  
//   //TODO: save tags on the fly
//   //TODO: fetch existing tags from the template
//   state = {
//     inputVisible: false,
//     inputValue: '',
//   };

//   handleClose = (removedTag) => {
//     const tags = this.state.tags.filter(tag => tag !== removedTag);
//     console.log(tags);
//     this.setState({ tags });
//   }
  
//   showInput = () => {
//     this.setState({ inputVisible: true }, () => this.input.focus());
//   }
  
//   handleInputChange = (e) => {
//     this.setState({ inputValue: e.target.value });
//   }
  
//   handleInputConfirm = () => {
//     const state = this.state;
//     const inputValue = state.inputValue;
//     let tags = state.tags;
//     if (inputValue && tags.indexOf(inputValue) === -1) {
//       tags = [...tags, inputValue];
//     }
//     console.log(tags);
//     this.setState({
//       tags,
//       inputVisible: false,
//       inputValue: '',
//     });
//   }
  
//   saveInputRef = (input) => {
//     this.input = input;
//   }

//   render() {
//     const { tags, inputVisible, inputValue } = this.state;
//     return (
//       <div>
//         {tags.map((tag, index) => {
//           const isLongTag = tag.length > 20;
//           const tagElem = (
//             <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
//               {isLongTag ? `${tag.slice(0, 20)}...` : tag}
//             </Tag>
//           );
//           return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
//         })}
//         {inputVisible && (
//           <Input
//             ref={this.saveInputRef}
//             type="text"
//             size="small"
//             style={{ width: 78 }}
//             value={inputValue}
//             onChange={this.handleInputChange}
//             onBlur={this.handleInputConfirm}
//             onPressEnter={this.handleInputConfirm}
//           />
//         )}
//         {!inputVisible && (
//           <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }} >
//             <Icon type="plus" /> New Tag
//           </Tag>
//         )}
//       </div>
//     );
//   }
// }

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
        width: 200,
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
        )
      }    
    ]
    this.nestedColumnsVariants = [      
      {
        title: 'Existing variants',
        dataIndex: 'id',
        render: (text, record) => (
          <Button type="link" icon='branches' onClick={() => this.props.callbackFromParent('2')}>{record.id}</Button>          
        )      
      }       
    ]
    this.state = {
      //templates: [],
      tags: {},
      forEdit: null, 
      edited: null
    };
    this.editor = React.createRef();
  }

  render() {

    const { forEdit } = this.state; 

    return (      
        <Layout>
        <Content>        
          <Row>
            <Col span={12}>
              <Table
                //bordered 
                rowKey={record => record.id}
                size='small'
                dataSource={this.props.templates}
                columns={this.columns}
                expandedRowRender={record => 
                  <span>
                    <Table columns={this.nestedColumnsVariants} dataSource={this.props.variants.filter((item) => {return item.template == record.id})} pagination={false}/>
                  </span>} 
                pagination={{ pageSize: 50 }}
                scroll={{ y: true }}               
              />
            </Col>                      
            <Col span={12}>                       
              <Editor history='true' value={forEdit} ref={this.editor} onChange={this.handleChange} />            
            </Col> 
          </Row>    
        </Content>          
        </Layout>   
    );
  }

  componentDidMount() {
    //this.getTemplates().then(result => { this.setState({ templates: result }) });
    this.getTags().then(result => {this.setState({tags: result})});
    console.log(this.state.tags);
  }

  handleChange = (value) => {
    this.setState({edited: value});
  }

  getTags = async () => {
    let result = {};
    //let templates = (await axios.get('api/template/')).data;
    this.props.templates.forEach((template) => {
      result[template.id] = template.property.predefinedtag;      
    });
    console.log(result);
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

