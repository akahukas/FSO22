import { NewEntry, NewPatient } from "./types";
import { Gender, HealthCheckRating, Diagnosis } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation!');
  }
  return occupation;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${gender}`);
  }
  return gender;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing Social Security Number (SSN)!');
  }
  return ssn;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name!');
  }
  return name;
};

type Fields = {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown,
  entries: unknown };

const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation } : Fields): NewPatient => {
  const newEntry: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSSN(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: []
  };

  return newEntry;
};

export default toNewPatientEntry;

export const parseID = (id: unknown): string => {
  if (!id || !isString(id)) {
    throw new Error(`Incorrect or missing gender: ${id}`);
  }
  return id;
};

// Uuden hoitotiedon lisäämisen validointi.

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error(`Incorrect or missing description: ${description}`);
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error(`Incorrect or missing specialist: ${specialist}`);
  }
  return specialist;
};

const isArrayOfStrings = (array: unknown): array is Array<string> => {
  if (Array.isArray(array)) {
    if (array.some(value => !isString(value))) {
      return false;
    }
    return true;
  }
  return false;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> => {
  if (!diagnosisCodes || !isArrayOfStrings(diagnosisCodes)) {
    throw new Error(`Incorrect or missing diagnosisCodes: ${diagnosisCodes}`);
  }
  return diagnosisCodes;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (!healthCheckRating || !isHealthCheckRating(healthCheckRating)) {
    throw new Error(`Incorrect or missing healthCheckRating: ${healthCheckRating}`);
  }
  return healthCheckRating;
};

const parseCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error(`Incorrect or missing criteria: ${criteria}`);
  }
  return criteria;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error(`Incorrect or missing employerName: ${employerName}`);
  }
  return employerName;
};

type MedicalEntryFields = {
  id: unknown,
  type: unknown,
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes?: unknown,
  healthCheckRating: unknown,
  discharge: {
    date: unknown,
    criteria: unknown
  },
  employerName: unknown,
  sickLeave: {
    startDate: unknown,
    endDate: unknown,
  }
 };

export const toNewMedicalEntry = (requestBody : MedicalEntryFields): NewEntry => {
  switch (requestBody.type) {
    case 'HealthCheck':

      const newHealthCheckEntry: NewEntry = {
        type: 'HealthCheck',
        description: parseDescription(requestBody.description),
        date: parseDate(requestBody.date),
        specialist: parseSpecialist(requestBody.specialist),
        healthCheckRating: parseHealthCheckRating(requestBody.healthCheckRating)
      };

      return newHealthCheckEntry;

    case 'Hospital':

      const newHospitalEntry: NewEntry = {
        type: 'Hospital',
        description: parseDescription(requestBody.description),
        date: parseDate(requestBody.date),
        specialist: parseSpecialist(requestBody.specialist),
        diagnosisCodes: parseDiagnosisCodes(requestBody.diagnosisCodes),
        discharge: {
          date: parseDate(requestBody.discharge.date),
          criteria: parseCriteria(requestBody.discharge.criteria)
        }
      };
      
      return newHospitalEntry;

    case 'OccupationalHealthcare':

      const newOccupationalHealthcareEntry: NewEntry = {
        type: 'OccupationalHealthcare',
        description: parseDescription(requestBody.description),
        date: parseDate(requestBody.date),
        specialist: parseSpecialist(requestBody.specialist),
        employerName: parseEmployerName(requestBody.employerName),
        sickLeave: {
          startDate: parseDate(requestBody.sickLeave.startDate),
          endDate: parseDate(requestBody.sickLeave.endDate)
        }
      };
      
      return newOccupationalHealthcareEntry;

    default:
      throw new Error(`Incorrect or missing type of medical entry: ${requestBody.type}`);
  }
};
