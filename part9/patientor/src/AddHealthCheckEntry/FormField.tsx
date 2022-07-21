import { Field, FieldProps } from "formik";
import {
  Select,
  MenuItem
} from "@material-ui/core";
import { InputLabel } from "@material-ui/core";

import { HealthCheckRating } from "../types";

export type HealthCheckRatingOption = {
  value: HealthCheckRating;
  label: string;
};

type SelectFieldProps = {
  name: string;
  label: string;
  options: HealthCheckRatingOption[];
};

const FormikSelect = ({ field, ...props }: FieldProps) => <Select {...field} {...props} />;

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);