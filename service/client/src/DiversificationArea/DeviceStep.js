import React, { Component } from "react";
import ReactJson from "react-json-view";
import { Button, Table, Badge, Tag } from "antd";

const colors = [
  "blue",
  "red",
  "green",
  "blue",
  "red",
  "green",
  "blue",
  "red",
  "green"
];

export class DeviceStep extends Component {
  constructor(props) {
    super(props);
    this.device_columns = [
      {
        title: "Device ID",
        dataIndex: "id",
        width: 200,
        render: (text, record) =>
          this.props.deviceTags[record.id].status === "failed" ? (
            <span>
              <Badge status="error" />
              {record.id}
            </span>
          ) : (
            <span>
              <Badge status="success" />
              {record.id}
            </span>
          )
      },
      {
        title: "Tags",
        dataIndex: "tags",
        render: (text, record) =>
          this.props.deviceTags[record.id] &&
          Object.keys(this.props.deviceTags[record.id]).map((key, i) => (
            <Tag color={colors[i]}>
              {key}: {this.props.deviceTags[record.id][key]}
            </Tag>
          )),
        width: 600
      }
      //   {
      //     title: "Device ID",
      //     dataIndex: "id",
      //     width: 200,
      //     render: (text, record) => <span>{record.id}</span>
      //   }
    ];
    this.nested_device_columns = [
      {
        title: "Active deployments",
        dataIndex: "id",
        render: (text, record) => (
          <Button
            type="link"
            icon="deployment-unit"
            onClick={() => this.props.callbackTabChange("3")}
          >
            {record}
          </Button>
        )
      }
    ];
    this.state = {
      device_list: { devices: new Object() },
      devices: this.props.devices,
      selected_device_rowkeys: [],
      visible: false
    };
  }

  onDeviceSelectChange = value => {
    console.log("selected_device_rowkeys changed: ", value);
    this.setState({ selected_device_rowkeys: value });
    this.props.callbackDeviceSelect(value);
  };

  onDeviceSelect = (record, selected, selectedRows, nativeEvent) => {
    //TODO convert selected array into object
    // selectedRows.forEach((item, index) => {
    //     console.log(item, index);
    //   });

    var device_list = this.state.device_list;
    if (selected) {
      var device_id = record.id;
      device_list.devices[device_id] = record.tags;
      //depl_list.push(depl);
      this.setState({ device_list: device_list });
    } else {
      //TODO remove
    }
    this.props.callbackTargetDeviceSelect(this.state.device_list);
  };

  render() {    
    const device_row_selection = {
      selected_rowkeys: this.state.selected_device_rowkeys,
      columnTitle: " ", //this line is to hide the "Select all" checkbox
      onChange: this.onDeviceSelectChange,
      onSelect: this.onDeviceSelect
      //type: "radio"
    };

    return (
      <Table
        //bordered
        rowSelection={device_row_selection}
        rowKey={record => record.id}
        size="small"
        dataSource={this.props.devices}
        columns={this.device_columns}
        expandedRowRender={record => (
          <span>
            <ReactJson src={record} enableClipboard={false} />
            <Table
              columns={this.nested_device_columns}
              dataSource={
                this.props.activeDeployments[record.id]
                  ? Object.values(this.props.activeDeployments[record.id])
                  : []
              }
              pagination={false}
            />
          </span>
        )}
        pagination={{ pageSize: 50 }}
      />
    );
  }

  componentDidMount() {
    //TODO
  }
}
