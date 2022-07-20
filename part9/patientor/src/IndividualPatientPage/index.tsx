import { useStateValue } from "../state";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient } from "../types";

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
          dispatch({ type: "GET_PATIENT_DATA", payload: patientData });
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

  return (
    <div>
      <h1>{currentPatientData.name}</h1>
      <p>Social Security Number (SSN): {currentPatientData.ssn}</p>
      <p>Date of Birth: {currentPatientData.dateOfBirth}</p>
      <p>Gender: {currentPatientData.gender}</p>
      <p>Occupation: {currentPatientData.occupation}</p>
    </div>
  );
};

export default IndividualPatientPage;
