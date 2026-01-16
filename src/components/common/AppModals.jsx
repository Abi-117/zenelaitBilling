import Modal from '../ui/Modal';

const AppModals = ({
  modalOpen,
  modalType,
  handleFormChange,
  handleSubmit,
  setModalOpen
}) => {
  if (!modalOpen) return null;

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title={`Add New ${modalType}`}
    >
      {/* SAME input blocks — unchanged */}
      {/* paste your existing modal JSX here */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold"
      >
        Save
      </button>
    </Modal>
  );
};

export default AppModals;
