import patients from "../../data/patients";
import { NewEntry, Patient } from "../types";
import { NonSensitivePatient, NewPatient } from "../types";
import { v1 as uuid } from 'uuid';

const getEntries = (): Array<Patient> => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addEntry = (patient: Patient, entry: NewEntry): Patient => {

  const patientToUpdate = patients.find(patientInDb => patientInDb.id === patient.id);
  
  const newEntry = {
    id: uuid(),
    ...entry
  };

  if (!patientToUpdate) {
    throw new Error('Patient with specified id could not be found.');
  }

  patientToUpdate.entries.push(newEntry);

  return patientToUpdate;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry
};
