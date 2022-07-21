import { Box } from "@material-ui/core";
import WorkIcon from '@material-ui/icons/Work';

import { OccupationalHealthcareEntry } from "../types";

interface EntryProps {
  entry: OccupationalHealthcareEntry;
}


const OccupationalHealthCareEntryBox = ({ entry }: EntryProps): JSX.Element => {
  return (
    <Box 
      border={2}
      borderLeft={2}
      borderRight={2}
      padding='10px'
      margin='5px'
      borderRadius={10}
    >
      <p>{entry.date} <WorkIcon /> {entry.employerName}</p>
      <p><i>{entry.description}</i></p>

      <p>Diagnosis by {entry.specialist}</p>
    </Box>
  );
};

export default OccupationalHealthCareEntryBox;
