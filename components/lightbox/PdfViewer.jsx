import { Viewer, Worker } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const PdfViewer = ({ pdfUrl }) => {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#eeeeee',
          display: 'flex',
          justifyContent: 'center',
          padding: '2px',
          fontSize: '14px',
        }}
      >
        <ZoomOutButton />
        <ZoomPopover />
        <ZoomInButton />
      </div>
      <Viewer
        fileUrl={pdfUrl}
        defaultScale={1.2}
        plugins={[zoomPluginInstance]}
      />
    </Worker>
  );
};

export default PdfViewer;
