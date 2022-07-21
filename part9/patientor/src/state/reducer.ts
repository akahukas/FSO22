import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "GET_PATIENT_DATA";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSES_DATA";
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "GET_PATIENT_DATA":
      return {
        ...state,
        selectedPatientData: {
          ...state.selectedPatientData,
          [action.payload.id]: action.payload
        }
      };
      case "SET_DIAGNOSES_DATA":
        return {
          ...state,
          diagnoses: action.payload
        };
    default:
      return state;
  }
};

// Action creator palvelimelta haettujen
// potilaiden asettamiseksi sovelluksen tilaan.
export const setPatientList = (data: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: data
  };
};

// Action creator käyttäjän sovelluksessa luoman
// uuden potilaan tallentamiseksi sovelluksen tilaan.
export const addNewPatient = (data: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: data
  };
};

// Action creator potilaan tietojen hakemiseksi
// palvelimelta ja tallentamiseksi sovelluksen tilaan.
export const getPatientData = (data: Patient): Action => {
  return {
    type: "GET_PATIENT_DATA",
    payload: data
  };
};

export const setDiagnosesData = (data: Diagnosis[]): Action => {
  return {
    type: 'SET_DIAGNOSES_DATA',
    payload: data
  };
};
