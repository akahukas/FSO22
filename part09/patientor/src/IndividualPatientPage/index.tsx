import { addHealthCheckEntry, addHospitalEntry, addOccupationalHealthcareEntry, useStateValue } from "../state";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { getPatientData } from "../state";
import Entries from "./Entries";
import { Button } from "@material-ui/core";

// Terveystarkastuslomake.
import { HealthCheckFormValues } from "../AddHealthCheckEntry/AddHealthCheckEntry";
import AddHealthCheckModal from "../AddHealthCheckEntry";

// Sairaalalomake.
import { HospitalFormValues } from "../AddHospitalEntry/AddHospitalEntry";
import AddHospitalModal from "../AddHospitalEntry";

// Työterveystarkastuslomake.
import { OccupationalHealthcareFormValues } from "../AddOccupationalHealthCareEntry/AddOccupationalHealthCareEntry";
import AddOccupationalHealthcareModal from "../AddOccupationalHealthCareEntry";

const IndividualPatientPage = () => {
  // Määritetään muuttujiin tilaan tallennettu käyttäjän valitsema potilas,
  // sekä dispatch() -metodi, joka mahdollistaa tilan manipuloinnin.
  const [{ selectedPatientData }, dispatch] = useStateValue();

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

  // Terveystarkastuslomakkeen tilan- ja sulkemisenhallinta.
  const [healthCheckModalOpen, setHealthCheckModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openHealthCheckModal = (): void => setHealthCheckModalOpen(true);

  const closeHealthCheckModal = (): void => {
    setHealthCheckModalOpen(false);
    setError(undefined);
  };

  // Sairaalalomakkeen tilan- ja sulkemisenhallinta.
  const [hospitalModalOpen, setHospitalModalOpen] = useState<boolean>(false);

  const openHospitalModal = (): void => setHospitalModalOpen(true);

  const closeHospitalModal = (): void => {
    setHospitalModalOpen(false);
    setError(undefined);
  };

  // Työterveystarkastuslomakkeen tilan- ja sulkemisenhallinta.
  const [occupationalHealthcareModalOpen, setoccupationalHealthcareModalOpen] = useState<boolean>(false);

  const openOccupationalHealthcareModal = (): void => setoccupationalHealthcareModalOpen(true);

  const closeOccupationalHealthcareModal = (): void => {
    setoccupationalHealthcareModalOpen(false);
    setError(undefined);
  };

  if (!currentPatientData) {
    return null;
  }

  // Terveystarkastuslomakkeen lähetyksen tapahtumankäsittelijä.
  const submitNewHealthCheckEntry = async (values: HealthCheckFormValues) => {
    try {
      const { data: newHealthCheckEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${currentPatientData.id}/entries`,
        values
      );
      dispatch(addHealthCheckEntry(newHealthCheckEntry));
      closeHealthCheckModal();
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

  // Sairaalalomakkeen lähetyksen tapahtumankäsittelijä.
  const submitNewHospitalEntry = async (values: HospitalFormValues) => {
    try {
      const { data: newHospitalEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${currentPatientData.id}/entries`,
        values
      );
      dispatch(addHospitalEntry(newHospitalEntry));
      closeHospitalModal();
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

  // Työterveystarkastuslomakkeen lähetyksen tapahtumankäsittelijä.
  const submitNewOccupationalHealthcareEntry = async (values: OccupationalHealthcareFormValues) => {
    try {
      const { data: newOccupationalHealthcareEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${currentPatientData.id}/entries`,
        values
      );
      dispatch(addOccupationalHealthcareEntry(newOccupationalHealthcareEntry));
      closeOccupationalHealthcareModal();
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
        modalOpen={healthCheckModalOpen}
        onSubmit={submitNewHealthCheckEntry}
        error={error}
        onClose={closeHealthCheckModal}
      />

      <AddHospitalModal
        modalOpen={hospitalModalOpen}
        onSubmit={submitNewHospitalEntry}
        error={error}
        onClose={closeHospitalModal}
      />

      <AddOccupationalHealthcareModal
        modalOpen={occupationalHealthcareModalOpen}
        onSubmit={submitNewOccupationalHealthcareEntry}
        error={error}
        onClose={closeOccupationalHealthcareModal}
      />
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => openHealthCheckModal()}
        style={{margin: '5px'}}
      >
          Add health check entry
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openHospitalModal()}
        style={{margin: '5px'}}
      >
          Add hospital entry
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openOccupationalHealthcareModal()}
        style={{margin: '5px'}}
      >
          Add occupational healthcare entry
      </Button>
    </div>
  );
};

export default IndividualPatientPage;
