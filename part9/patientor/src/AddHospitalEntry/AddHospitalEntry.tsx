import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField";
import { HospitalEntry } from "../types";
import { useStateValue } from "../state";


export type HospitalFormValues = Omit<HospitalEntry, 'id'>;

interface Props {
  onSubmit: (values: HospitalFormValues) => void;
  onCancel: () => void;
}

export const AddHospitalForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: 'Hospital',
        description: '',
        date: '',
        specialist: '',
        discharge: {
          date:'',
          criteria:''
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
        if (!values.diagnosisCodes) {
          errors.diagnosisCodes = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
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
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
              required
            />
            <Field
              label="Discharge criteria"
              placeholder="Criteria"
              name="discharge.criteria"
              component={TextField}
              required
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
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

export default AddHospitalForm;
