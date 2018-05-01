/*
 * School Quote Messages
 *
 * This contains all the text for step 2 school quote.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  schoolCountry: {
    id: 'boilerplate.components.schoolquote.form.schoolcountry',
    defaultMessage: 'In which country is your school located ?',
  },
  StudentPopulation: {
    id: 'boilerplate.components.schoolquote.form.numberstudents',
    defaultMessage: 'Enter total number of students enrolled.',
  },
  averageFee: {
    id: 'boilerplate.components.schoolquote.form.averageFee',
    defaultMessage: 'Enter average tuition fees per student in US$',
  },
  MonthlyJobListings: {
    id: 'boilerplate.components.schoolquote.form.MonthlyJobListings',
    defaultMessage: 'Enter estimated number of job listing per listing.',
  },
  ibdp: {
    id: 'boilerplate.components.schoolquote.form.ibdp',
    defaultMessage: 'Do you provide an IBDP, Advanced Placement, A levels curriculum ?',
  },
  ibdpYes: {
    id: 'boilerplate.components.Yes',
    defaultMessage: 'Yes',
  },
  ibdpNo: {
    id: 'boilerplate.components.No',
    defaultMessage: 'No',
  },
});
