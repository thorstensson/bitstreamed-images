import { useState, useEffect } from "react";

function BitstreamImage({ src, id }) {
  const [percent, setPercent] = useState(0);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let currentBlobUrl = null;

    async function startBitstream() {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error("Network response was not ok");

        // This is where the BITSTREAM happens
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");

        let receivedLength = 0;
        let chunks = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          if (isMounted) {
            // Update the UI as bits arrive
            setPercent(Math.round((receivedLength / contentLength) * 100));
          }
        }

        // Convert the streamed chunks into a single object the browser can show
        const blob = new Blob(chunks);
        currentBlobUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setBlobUrl(currentBlobUrl);
        }
      } catch (err) {
        console.error("Stream failed:", err);
      }
    }

    startBitstream();

    // CLEANUP: This is vital for memory management
    return () => {
      isMounted = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl); // Releases the bits from RAM
      }
    };
  }, [src]);

  return (
    <div className="img-wrapper">
      {blobUrl ? (
        <img src={blobUrl} alt={`Asset ${id}`} className="fade-in" />
      ) : (
        <div className="stream-overlay">
          <div className="stream-progress" style={{ width: `${percent}%` }} />
          <span className="stream-text">{percent}%</span>
        </div>
      )}
      <div className="id-badge">ID: {id}</div>
    </div>
  );
}

export default BitstreamImage;
