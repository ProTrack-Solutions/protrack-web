import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Props {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onDelete: (departmentId: string) => void;
}

export const DialogConfirm = ({
  description,
  onDelete,
  title,
  open,
  onOpenChange,
  id,
}: Props) => {
  const handleDelete = async () => {
    try {
      onDelete(id);
    } catch (error) {
      console.log(error);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-red-500 hover:bg-red-400"
            onClick={() => handleDelete()}
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
