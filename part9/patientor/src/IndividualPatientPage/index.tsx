import { addHealthCheckEntry, useStateValue } from "../state";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { getPatientData } from "../state";
import Entries from "./Entries";
import { Button } from "@material-ui/core";

import { HealthCheckFormValues } from "../AddHealthCheckEntry/AddHealthCheckEntry";
import AddHealthCheckModal from "../AddHealthCheckEntry";

const IndividualPatientPage = () => {
  // Määritetään muuttujiin tilaan tallennettu käyttäjän valitsema potilas,
  // sekä dispatch() -metodi, joka mahdollistaa tilan manipuloinnin.
  const [{ selectedPatientData }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  // Tallennetaan muuttujaan osoitekentässä oleva potilaan tunniste.
  const { id } = useParams<{ id: string }>();

  // Tarkistetaan sovelluksen tilasta, onko siellä jo tallennettuna käyttäjän valitsemaa
  // potilasta. Tallennetaan tarkastelun tulost muuttujaan, joka on joko potilas tai undefined.
  const currentPatientData: Patient | undefined = Object.values(selectedPatientData).find(
    patient => patient.id === id
  );

  // Käytetään useEffect()-hookia käyttäjän valitseman potilaan tietojen 
  // hakemiseen palvelimelta siinä tapauksessa jos osoitekentän tunniste on muuttunut.
  useEffect(() => {
    const fetchSelectedPatient = async () => {
      try {
        // Jos tiedot löytyvät jo tilasta, ei niiden noutamiselle
        // palvelimelta ole enää tarvetta, joten poistutaan hookista.
        if (currentPatientData) {
          return null;
        }
        else {
          const { data: patientData } = await axios.get<Patient>(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${apiBaseUrl}/patients/${id}`
          );
          // Haetaan potilaan tiedot action creatorin avulla.
          dispatch(getPatientData(patientData));
        }
        
      } catch (error: unknown) {
        console.error(error);
      }
    };
    void fetchSelectedPatient();
  }, [id]);

  if (!currentPatientData) {
    return null;
  }

  const submitNewHealthCheckEntry = async (values: HealthCheckFormValues) => {
    try {
      const { data: newHealthCheckEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${currentPatientData.id}/entries`,
        values
      );
      dispatch(addHealthCheckEntry(newHealthCheckEntry));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <div>
        <h1>{currentPatientData.name}</h1>
        <p>Social Security Number (SSN): {currentPatientData.ssn}</p>
        <p>Date of Birth: {currentPatientData.dateOfBirth}</p>
        <p>Gender: {currentPatientData.gender}</p>
        <p>Occupation: {currentPatientData.occupation}</p>
      </div>
      <div>
        <h2>Entries:</h2>
        {currentPatientData.entries.map((entry) => {
          return (
          <div key={entry.id}>
            <Entries entry={entry} />
          </div>
          );
        })}
      </div>
      <AddHealthCheckModal
        modalOpen={modalOpen}
        onSubmit={submitNewHealthCheckEntry}
        error={error}
        onClose={closeModal}
      />
      
      <Button variant="contained" color="primary" onClick={() => openModal()}>
          Add new health check entry
      </Button>
    </div>
  );
};

export default IndividualPatientPage;
