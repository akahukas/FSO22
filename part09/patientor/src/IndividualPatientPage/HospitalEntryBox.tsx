import { Box } from "@material-ui/core";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

import { HospitalEntry } from "../types";

interface EntryProps {
  entry: HospitalEntry;
}

const HospitalEntryBox = ({ entry }: EntryProps): JSX.Element => {
  return (
    <Box 
      border={2}
      borderLeft={2}
      borderRight={2}
      padding='10px'
      margin='5px'
      borderRadius={10}
    >
      <p>{entry.date} <LocalHospitalIcon /></p>
      <p><i>{entry.description}</i></p>

      <p>Diagnosis by {entry.specialist}</p>
    </Box>
  );
};

export default HospitalEntryBox;
