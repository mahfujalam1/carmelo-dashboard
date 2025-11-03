import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal";

/** Simple Yes/No confirmation modal (re-uses CategoryModal) */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "You want to delete this Content",
  confirmText = "Yes",
  cancelText = "No",
  from = "center", // pass direction if you want slide-in from any side
}) {


  return (
    <CategoryModal open={open} onClose={onClose} title={title} from={from}>
      <p className="px-1 pb-4 text-center text-gray-700">{message}</p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onConfirm}
          className="rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          {confirmText}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {cancelText}
        </button>
      </div>
    </CategoryModal>
  );
}
