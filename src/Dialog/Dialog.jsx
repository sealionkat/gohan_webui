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

  componentWillUnmount() {
    this.props.clearData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state === null || this.state.currentSchema === undefined) {
      const formData = nextProps.dialogReducer.schema.propertiesOrder.reduce(
        (result, item) => {
          result[item] = nextProps.data[item];
          return result;
        }, {}
      );

      this.setState({
        currentSchema: _.cloneDeep(nextProps.dialogReducer.schema),
        currentPropertiesOrder: _.cloneDeep(nextProps.dialogReducer.schema.propertiesOrder),
        formData
      });
    }
  }

  handleSubmit = ({formData}) => {
    this.props.onSubmit(formData, this.props.data.id);
    this.props.onClose(); // Add check success
  };

  adjustSchema = ({formData}) => {
    let {currentSchema, currentPropertiesOrder} = this.state;
    const originalSchema = this.props.dialogReducer.schema;
    const logic = {
      color: {
        Green: {
          hide: ['favfood']
        },
        Blue: {
          show: ['favfood']
        }
      }
    };

    for (let item in formData) {
      if (formData.hasOwnProperty(item)) {
        const value = formData[item];
        if (value !== undefined && logic[item] !== undefined && logic[item][value] !== undefined) {
          const hide = logic[item][value].hide || [];
          const show = logic[item][value].show || [];

          for (let i = 0; i < hide.length; ++i) {
            const elementToHide = hide[i];
            if (currentSchema.properties[elementToHide] === undefined) {
              continue;
            }
            delete currentSchema.properties[elementToHide];
            currentPropertiesOrder.splice(currentPropertiesOrder.indexOf(elementToHide), 1);
            delete formData[elementToHide];
          }

          for (let i = 0; i < show.length; ++i) {
            const elementToShow = show[i];
            if (currentSchema.properties[elementToShow] !== undefined) {
              continue;
            }
            currentSchema.properties[elementToShow] = originalSchema.properties[elementToShow];
            currentPropertiesOrder.splice(originalSchema.propertiesOrder.indexOf(elementToShow), 0, elementToShow);
            formData[elementToShow] = undefined;
          }
        }
      }
    }

    this.setState({currentSchema, currentPropertiesOrder, formData});
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
                <Form ref={c => {this.form = c;}} schema={this.state.currentSchema}
                  fields={fields} widgets={widgets}
                  FieldTemplate={Template} formData={this.state.formData}
                  uiSchema={{'ui:order': this.state.currentPropertiesOrder}} onSubmit={this.handleSubmit}
                  showErrorList={false} onChange={this.adjustSchema}>
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
