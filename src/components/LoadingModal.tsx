import BeatLoader from 'react-spinners/BeatLoader';

export const LoadingModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/5 h-1/5">
        <h2 className="text-2xl font-bold mb-10 text-center">Loading</h2>
        <div className="flex justify-center">
          <BeatLoader color="rgb(59 130 246)" />
        </div>
      </div>
    </div>
  );
};
