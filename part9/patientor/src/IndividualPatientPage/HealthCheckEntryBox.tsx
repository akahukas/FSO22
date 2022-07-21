import { Box } from "@material-ui/core";
import HealingIcon from '@material-ui/icons/Healing';
import CheckBoxIcon from '@material-ui/icons/CheckBoxOutlined';
import HeartIcon from '@material-ui/icons/Favorite';

import { HealthCheckEntry, HealthCheckRating } from "../types";

interface EntryProps {
  entry: HealthCheckEntry;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HealthCheckEntryBox = ({ entry }: EntryProps): JSX.Element => {

  const ratingIcon = () => {
    switch(entry.healthCheckRating) {
      case HealthCheckRating.Healthy:
        return <HeartIcon htmlColor="green" />;
      case HealthCheckRating.LowRisk:
        return <HeartIcon htmlColor="yellow" />;
      case HealthCheckRating.HighRisk:
        return <HeartIcon htmlColor="orange" />;
      case HealthCheckRating.CriticalRisk:
        return <HeartIcon htmlColor="red" />;
      default: 
      return assertNever(entry.healthCheckRating);
    }
  };

  return (
    <Box 
      border={2}
      borderLeft={2}
      borderRight={2}
      padding='10px'
      margin='5px'
      borderRadius={10}
    >
      <p>{entry.date} <HealingIcon /><CheckBoxIcon /></p>
      <p><i>{entry.description}</i></p>

      {ratingIcon()}

      <p>Diagnosis by {entry.specialist}</p>
    </Box>
  );
};

export default HealthCheckEntryBox;
