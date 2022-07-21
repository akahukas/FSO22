import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
import { parseID } from '../utils';
import { toNewMedicalEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedPatientEntry = patientService.addPatient(newPatientEntry);

    res.json(addedPatientEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';

    if ( error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).send(errorMessage);
  }
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(parseID(req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.findById(parseID(req.params.id));

  if (patient) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const updatedPatient = patientService.addEntry(patient, toNewMedicalEntry(req.body));
    res.send(updatedPatient);
  } else {
    res.sendStatus(404);
  }
});

export default router;
