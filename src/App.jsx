import BitstreamImage from "./components/BitstreamImage";
import "./App.css";

// 1. Use environment variable for Cloudflare R2 Public URL
const BUCKET_URL = import.meta.env.VITE_BUCKET_URL;

function App() {
  // 2. Generate an array of 100 image paths (1.jpg, 2.jpg, etc.)
  const imageList = Array.from(
    { length: 100 },
    (_, i) => `${BUCKET_URL}/images-resized/${i + 1}.jpeg`,
  );

  return (
    <div className="app-container">
      <header>
        <h1>Cloud Bitstream Visualizer</h1>
        <p>Streaming 100 high-res assets chunk-by-chunk from Cloudflare R2</p>
      </header>

      <div className="grid">
        {imageList.map((url, index) => (
          <BitstreamImage key={index} src={url} id={index + 1} />
        ))}
      </div>
    </div>
  );
}

export default App;
