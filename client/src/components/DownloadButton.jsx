import React from 'react';


const DownloadButton = ({ noteId }) => {
  const downloadPDF = () => {
    window.open(`http://localhost:5000/api/notes/download/${noteId}`, '_blank');
  };

  return (
    <button onClick={downloadPDF} className="bg-green-600 text-white px-4 py-2 rounded">
      Download PDF
    </button>
  );
};

export default DownloadButton;
