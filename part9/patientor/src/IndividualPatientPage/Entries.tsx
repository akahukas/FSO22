import { Entry } from "../types";
import HealthCheckEntryBox from "./HealthCheckEntryBox";
import HospitalEntryBox from "./HospitalEntryBox";
import OccupationalHealthCareEntryBox from "./OccupationalHealthCareEntryBox";

interface EntriesProps {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Entries = ({ entry }: EntriesProps): JSX.Element => {
  switch(entry.type) {
    case 'HealthCheck':
      return <HealthCheckEntryBox entry={entry} />;
    case 'Hospital':
      return <HospitalEntryBox entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthCareEntryBox entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default Entries;
