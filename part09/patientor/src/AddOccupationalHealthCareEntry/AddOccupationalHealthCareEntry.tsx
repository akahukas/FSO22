import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField } from "../AddPatientModal/FormField";
import { OccupationalHealthcareEntry } from "../types";


export type OccupationalHealthcareFormValues = Omit<OccupationalHealthcareEntry, 'id'>;

interface Props {
  onSubmit: (values: OccupationalHealthcareFormValues) => void;
  onCancel: () => void;
}

export const AddOccupationalHealthcareForm = ({ onSubmit, onCancel }: Props) => {
  return (
    <Formik
      initialValues={{
        type: 'OccupationalHealthcare',
        description: '',
        date: '',
        specialist: '',
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: ''
        }
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
        if (!values.sickLeave?.startDate || !values.sickLeave?.endDate) {
          errors.sickLeave = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Employer name"
              placeholder="Employer name"
              name="employerName"
              component={TextField}
            />
            <Field
              label="Sick leave start date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="Sick leave end date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddOccupationalHealthcareForm;
