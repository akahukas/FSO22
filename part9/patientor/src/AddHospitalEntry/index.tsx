import { Dialog, DialogTitle, DialogContent, Divider } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import AddHospitalForm, { HospitalFormValues } from "./AddHospitalEntry";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: HospitalFormValues) => void;
  error?: string;
}

const AddHospitalModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new hospital entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
      <AddHospitalForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddHospitalModal;
