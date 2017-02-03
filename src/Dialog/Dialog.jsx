import React, {Component} from 'react';
import {Dialog, Button, ProgressBar, Intent} from '@blueprintjs/core';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';
import widgets from './formComponents/widgets';
import fields from './formComponents/fields';
import Template from './formComponents/Template';
import _ from 'lodash';

import {fetchRelationFields, clearData} from './DialogActions';

class GeneratedDialog extends Component {
  componentDidMount() {
    this.props.fetchRelationFields(this.props.schema.schema, this.props.action, this.props.schema.parent);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state === null || this.state.currentSchema === undefined) {
      let currentSchema = _.cloneDeep(nextProps.dialogReducer.schema);
      let currentPropertiesOrder = _.cloneDeep(nextProps.dialogReducer.schema.propertiesOrder);

      currentSchema.properties.test = {
        description: 'Test checkbox',
        title: 'Checkbox',
        type: 'boolean'
      };
      currentPropertiesOrder.push('test');

      const formData = currentPropertiesOrder.reduce(
        (result, item) => {
          result[item] = nextProps.data[item];
          result[item] = nextProps.data[item];
          return result;
        }, {}
      );

      let currentUiSchema = {
        'ui:order': currentPropertiesOrder,
        name:
        {
          'ui:widget': 'textarea'
        }
      };

      this.setState({
        currentSchema,
        currentPropertiesOrder,
        currentUiSchema,
        formData
      });
    }
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleSubmit = ({formData}) => {
    this.props.onSubmit(formData, this.props.data.id);
    this.props.onClose(); // Add check success
  };

  render() {
    const {action, schema} = this.props;
    const title = `${action[0].toUpperCase() + action.slice(1)} new ${schema.singular}`;

    const actions = [
      <Button key={0} text="Cancel"
        onClick={this.props.onClose}
      />,
      <Button key={1} text="Submit"
        intent={Intent.PRIMARY} onClick={event => {
          this.form.onSubmit(event);
        }}
      />
    ];
    return (
      <Dialog title={title} actions={actions}
        autoScrollBodyContent={true}
        {...this.props}>
        <div className="pt-dialog-body">
          {(() => {
            if (this.props.dialogReducer.isLoading) {
              return (
                <ProgressBar/>
              );
            }

            return (
              <div>
                <Form ref={c => {
                  this.form = c;
                }} schema={this.state.currentSchema}
                  fields={fields} widgets={widgets}
                  FieldTemplate={Template} formData={this.state.formData}
                  uiSchema={this.state.currentUiSchema} onSubmit={this.handleSubmit}
                  showErrorList={false}>
                  <div/>
                </Form>
              </div>
            );
          })()}
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            {actions}
          </div>
        </div>
      </Dialog>
    );
  }
}

GeneratedDialog.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    dialogReducer: state.dialogReducer
  };
}
export default connect(mapStateToProps, {
  fetchRelationFields,
  clearData
})(GeneratedDialog);
