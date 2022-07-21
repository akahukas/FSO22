import patients from "../../data/patients";
import { Entry, NewEntry, Patient } from "../types";
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

const addEntry = (patient: Patient, entry: NewEntry): Entry => {
  
  const newEntry = {
    id: uuid(),
    ...entry
  };
  
  const updatedPatient = {
    ...patient,
    entries: patient.entries.push(newEntry)
  };
  patients.map(
    existingPatient => existingPatient.id === updatedPatient.id
      ? updatedPatient
      : existingPatient
  );

  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry
};
