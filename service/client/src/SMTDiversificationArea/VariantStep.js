import React, { Component } from "react";
import { Button, message, Table } from "antd";
import SMTForm from "./SMTForm";

export class VariantStep extends Component {
  constructor(props) {
    super(props);
    this.variant_columns = [
      {
        title: "Variant ID",
        dataIndex: "id"
      },
      {
        title: "Template",
        dataIndex: "template",
        render: (text, record) => (
          <Button type="link" onClick={() => this.props.callbackTabChange("1")}>
            {record.template}
          </Button>
        )
      },
      {
        title: "Deployment parameters",
        dataIndex: "params",
        render: (text, record) =>
          record.dep_params === null ? (
            <Button
              type="link"
              onClick={() => message.success("Deployment parameters")}
            >
              View
            </Button>
          ) : (
            "nothing"
          )
      }
    ];
    this.state = {
      deployment_list: { deployments: {} },
      variants: this.props.variants,
      //ModalText: "Specify deployment paramaters",
      //selected_variant_rowkeys: this.props.selectedVariantRowKeys,
      visible: false
    };
  }

  onVariantSelectChange = value => {
    //console.log("selectedVariantRowKeys changed: ", value);
    //this.setState({ selected_variant_rowkeys: value });
    this.props.callbackVariantSelect(value);
  };

  onVariantSelect = (record, selected, selectedRows, nativeEvent) => {
    this.setState({
      visible: selected
    });
  };

  handleOk = value => {
    this.setState({
      visible: false
    });
    //TODO
    console.log();
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
    //TODO deselect row - not sure if this is the right way of doing this
    this.props.selected_variant_rowkeys.pop();
    console.log("selected keys", this.props.selected_variant_rowkeys);
  };

  handleSubmit = e => {
    e.preventDefault();
    //TODO deploy selected variant to selected devices
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (!err) {
        //values = this.removeDisabledFields(values);
        console.log("Form submited!!!!", values);
        //TODO pack form values into an object
        this.parseFormValues(values);
        this.props.callbackDeploymentSelect(this.state.deployment_list);
        this.setState({
          visible: false
        });
      } else {
        message.warning("Please specify the deployment parameters!");
      }
    });
  };

  parseFormValues = values => {
    var depl_list = this.state.deployment_list;
    //var depl_id = "dp" + depl_list.length;
    var depl_id = this.props.selectedVariantRowKeys.slice(-1)[0];
    depl_list.deployments[depl_id] = values;
    this.setState({ depl_list: depl_list });

    //console.log("state", this.state.deployment_list);
    //console.log("result", depl_list);
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    //const { selected_variant_rowkeys } = this.state;
    const variant_row_selection = {
      columnTitle: " ", //this line is to hide the "Select all" checkbox
      selectedRowKeys: this.props.selectedVariantRowKeys,
      onChange: this.onVariantSelectChange,
      onSelect: this.onVariantSelect
      //type: "radio"
    };

    return (
      <div>
        <Table
          //bordered
          rowSelection={variant_row_selection}
          rowKey={record => record.id}
          size="small"
          dataSource={this.props.variants}
          columns={this.variant_columns}
          pagination={{ pageSize: 50 }}
          scroll={{ y: true }}
        />
        {/* <Modal
              title={"Specify deployment parameters"}
              visible={visible}
              onOk={this.handleOk}
              confirmLoading={confirmLoading}
              onCancel={this.handleCancel}
            > */}
        <SMTForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSubmit}
        />
        {/* </Modal> */}
      </div>
    );
  }

  componentDidMount() {
    //TODO
  }
}
