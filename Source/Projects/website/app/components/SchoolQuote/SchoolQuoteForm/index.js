import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Text, Select, RadioGroup, Radio } from 'react-form';
import _ from 'lodash';
import messages from './messages';

function SchoolQuoteForm(props) {
  const feeValidate = (averageFee) => !averageFee || averageFee.trim() === '' ? 'Average fee is required' : null;
  const jobValidate = (MonthlyJobListings) => !MonthlyJobListings || MonthlyJobListings.trim() === '' ? 'Average fee is required' : null;
  const studentsValidate = (StudentPopulation) => !StudentPopulation || StudentPopulation.trim() === '' ? 'Number of students is required' : null;
  const countryValidate = (schoolCountry) => !schoolCountry ? 'Please select the country' : null;
  const ibdpValidate = (ibdp) => !ibdp || ibdp.trim() === '' ? 'Please select an option' : null;

  const statusOptions = [];

  const getCountryOptions = () => {
    if (props.countrylist && props.countrylist.length > 0 && statusOptions.length === 0) {
      props.countrylist.forEach(
        (val) => {
          let opt = {}; // eslint-disable-line prefer-const
          opt.label = val.name;
          opt.value = val.id;
          statusOptions.push(opt);
        }
      );
    }
    statusOptions.sort((a, b) => a.label.localeCompare(b.label));
    return statusOptions;
  };

  const changeCountryValue = (value) => {
    props.onUpdateCountry(value);
    canRequestQuote('CountryId');
  };

  const changeStudentsValue = _.debounce((value) => {
    props.onUpdateStudents(value);
    canRequestQuote('StudentPopulation');
  }, 1000);

  const changeTuitionValue = _.debounce((value) => {
    props.onUpdateTuition(value);
    canRequestQuote('AnnualTuitionFee');
  }, 1000);

  const changeJobsValue = _.debounce((value) => {
    props.onUpdateJobs(value);
    canRequestQuote('MonthlyJobListings');
  }, 1000);

  const changeIbdpValue = (inputBox) => {
    props.onUpdateIbdp(inputBox.target.value);
    canRequestQuote('HasAdvancedCurriculum');
  };

  const countryargs = {};
  if (props.schoolPackage && props.schoolPackage.CountryId) countryargs.defaultValue = props.schoolPackage.CountryId;

  const studentargs = {};
  if (props.schoolPackage && props.schoolPackage.StudentPopulation) studentargs.defaultValue = props.schoolPackage.StudentPopulation;

  const tuitionargs = {};
  if (props.schoolPackage && props.schoolPackage.AnnualTuitionFee) tuitionargs.defaultValue = props.schoolPackage.AnnualTuitionFee;

  const jobargs = {};
  if (props.schoolPackage && props.schoolPackage.MonthlyJobListings) jobargs.defaultValue = props.schoolPackage.MonthlyJobListings;

  const ibdpargs = {};
  if (props.schoolPackage && props.schoolPackage.HasAdvancedCurriculum) ibdpargs.defaultValue = props.schoolPackage.HasAdvancedCurriculum;

  const canRequestQuote = (item) => {
    switch (item) {
      case 'HasAdvancedCurriculum':
        if (props.schoolPackage.MonthlyJobListings &&
            props.schoolPackage.AnnualTuitionFee &&
            props.schoolPackage.StudentPopulation &&
            props.schoolPackage.CountryId
          ) {
          // initiate a quote request
          // console.log('ere guv');
          props.onRequestQuote();
        }
        break;
      case 'MonthlyJobListings':
        if (props.schoolPackage.HasAdvancedCurriculum &&
            props.schoolPackage.AnnualTuitionFee &&
            props.schoolPackage.StudentPopulation &&
            props.schoolPackage.CountryId
          ) {
          // initiate a quote request
          // console.log('ere guv');
          props.onRequestQuote();
        }
        break;
      case 'AnnualTuitionFee':
        if (props.schoolPackage.HasAdvancedCurriculum &&
            props.schoolPackage.MonthlyJobListings &&
            props.schoolPackage.StudentPopulation &&
            props.schoolPackage.CountryId
          ) {
          // initiate a quote request
          // console.log('ere guv');
          props.onRequestQuote();
        }
        break;
      case 'StudentPopulation':
        if (props.schoolPackage.HasAdvancedCurriculum &&
            props.schoolPackage.MonthlyJobListings &&
            props.schoolPackage.AnnualTuitionFee &&
            props.schoolPackage.CountryId
          ) {
          // initiate a quote request
          // console.log('ere guv');
          props.onRequestQuote();
        }
        break;
      case 'CountryId':
        if (props.schoolPackage.HasAdvancedCurriculum &&
            props.schoolPackage.MonthlyJobListings &&
            props.schoolPackage.AnnualTuitionFee &&
            props.schoolPackage.StudentPopulation
          ) {
          // initiate a quote request
          // console.log('ere guv');
          props.onRequestQuote();
        }
        break;
      default:
        break;
    }
    /* if (props.schoolPackage.HasAdvancedCurriculum &&
        props.schoolPackage.MonthlyJobListings &&
        props.schoolPackage.AnnualTuitionFee &&
        props.schoolPackage.StudentPopulation &&
        props.schoolPackage.CountryId
      ) {
      // initiate a quote request
      // console.log('ere guv');
      props.onRequestQuote();
    } */
  };

  return (
    <Form onSubmit={(submittedValues) => this.setState({ submittedValues })}>
      {(formApi) => (
        <form onSubmit={formApi.submitForm} id="schoolsignup2" className="connect-form">
          <label htmlFor="schoolCountry">
            <FormattedMessage {...messages.schoolCountry} />
          </label>
          <div className="connect-select">
            <Select
              field="schoolCountry"
              id="schoolCountry"
              options={getCountryOptions()}
              className={formApi.errors && formApi.errors.schoolCountry ? 'has-error' : ''}
              validate={countryValidate}
              onChange={changeCountryValue}
              {...countryargs}
            />
          </div>
          <label htmlFor="StudentPopulation">
            <FormattedMessage {...messages.StudentPopulation} />
          </label>
          <Text
            field="StudentPopulation"
            id="StudentPopulation"
            type="number"
            className={formApi.errors && formApi.errors.StudentPopulation ? 'has-error' : ''}
            validate={studentsValidate}
            onChange={changeStudentsValue}
            {...studentargs}
          />
          <label htmlFor="averageFee">
            <FormattedMessage {...messages.averageFee} />
          </label>
          <Text
            field="averageFee"
            id="averageFee"
            type="number"
            className={formApi.errors && formApi.errors.averageFee ? 'has-error' : ''}
            validate={feeValidate}
            onChange={changeTuitionValue}
            {...tuitionargs}
          />
          <label htmlFor="StudentPopulation">
            <FormattedMessage {...messages.MonthlyJobListings} />
          </label>
          <Text
            field="MonthlyJobListings"
            id="MonthlyJobListings"
            type="number"
            className={formApi.errors && formApi.errors.MonthlyJobListings ? 'has-error' : ''}
            validate={jobValidate}
            onChange={changeJobsValue}
            {...jobargs}
          />
          <div className="radio-group">
            <label htmlFor="idbp">
              <FormattedMessage {...messages.ibdp} />
            </label>
            <RadioGroup
              field="ibdp"
              validate={ibdpValidate}
              onChange={changeIbdpValue}
              {...ibdpargs}
            >
              <div className="radio-container">
                <Radio value="yes" id="yes" className={formApi.errors && formApi.errors.ibdp ? 'has-error' : ''} />
                <label htmlFor="ibdp-yes"><FormattedMessage {...messages.ibdpYes} /></label>
              </div>
              <div className="radio-container">
                <Radio value="no" id="no" className={formApi.errors && formApi.errors.ibdp ? 'has-error' : ''} />
                <label htmlFor="ibdp-no"><FormattedMessage {...messages.ibdpNo} /></label>
              </div>
            </RadioGroup>
          </div>
        </form>
     )}
    </Form>
  );
}

SchoolQuoteForm.propTypes = {
  schoolPackage: PropTypes.shape({
    SubscriptionId: PropTypes.string,
    AnnualTuitionFee: PropTypes.string,
    MonthlyJobListings: PropTypes.string,
    StudentPopulation: PropTypes.string,
    HasAdvancedCurriculum: PropTypes.string,
    CountryId: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
};

export default SchoolQuoteForm;
