/* eslint-disable */ // TODO Fix when page is completed
import * as React from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';

import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Alert } from 'reactstrap';

import { getSession } from '../../../reducers/authentication';
import { savePassword, reset } from '../../../reducers/account';

import PasswordStrengthBar from './password-strength-bar';

export interface IUserSettingsProps {
  account: any;
  updateSuccess: boolean;
  updateFailure: boolean;
  getSession: Function;
  savePassword: Function;
  reset: Function;
}

export interface IUserSettingsState {
  password: string;
}

export class SettingsPage extends React.Component<IUserSettingsProps> {
  state: IUserSettingsState = {
    password: ''
  };

  componentDidMount() {
    this.props.reset();
    this.props.getSession();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.savePassword(values.currentPassword, values.newPassword);
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { account, updateSuccess, updateFailure } = this.props;
    let alertMessage = null;

    if (updateFailure) {
      alertMessage = (
        <Alert color="danger">
          <Translate contentKey="password.messages.error">
            <strong>An error has occurred!</strong> The password could not be changed.
          </Translate>
        </Alert>
      );
    } else {
      if (updateSuccess) {
        alertMessage = (
          <Alert color="success">
            <Translate contentKey="password.messages.success">
              <strong>Password changed!</strong>
            </Translate>
          </Alert>
        );
      } else {
        alertMessage = null;
      }
    }

    return (
      <div>
        <h2>Password for [{account.login}]</h2>
        {alertMessage}
        <AvForm onValidSubmit={this.handleValidSubmit}>
          <AvField
            name="currentPassword"
            label={<Translate contentKey="global.form.currentpassword" />}
            placeholder={translate('global.form.currentpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') }
            }}
          />
          <AvField
            name="newPassword"
            label={<Translate contentKey="global.form.newpassword" />}
            placeholder={translate('global.form.newpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, errorMessage: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, errorMessage: translate('global.messages.validate.newpassword.maxlength') }
            }}
            onChange={this.updatePassword}
          />
          <PasswordStrengthBar password={this.state.password} />
          <AvField
            name="confirmPassword"
            label={<Translate contentKey="global.form.confirmpassword" />}
            placeholder={translate('global.form.confirmpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, errorMessage: translate('global.messages.validate.confirmpassword.required') },
              minLength: { value: 4, errorMessage: translate('global.messages.validate.confirmpassword.minlength') },
              maxLength: { value: 50, errorMessage: translate('global.messages.validate.confirmpassword.maxlength') },
              match: { value: 'newPassword', errorMessage: translate('global.messages.error.dontmatch') }
            }}
          />
          <Button color="success" type="submit">
            Save
          </Button>
        </AvForm>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, account }) => ({
  updateSuccess: account.updateSuccess,
  updateFailure: account.updateFailure,
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession, savePassword, reset };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
