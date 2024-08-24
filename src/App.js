import "./App.css";
import Map from "./components/Map/Map";

function App() {
  return (
    <div className="w-screen">
      <div className="flex justify-center pt-20 w-[100%]">
        <div className="border-2 w-[50%] rounded-lg p-5 flex justify-between items-center">
          <div>
            <div className="font-semibold">Starting</div>
            <div>
              <p>
                <span className="font-semibold">Lat:</span> <span>22.1696</span>
              </p>
              <p>
                <span className="font-semibold">Long:</span>
                <span> 91.4996</span>
              </p>
            </div>
          </div>

          <div className="flex">
            <div>
              <p>
                <span className="font-semibold text-blue-600">Speed:</span>{" "}
                <span className="text-blue-400">20kmph</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="font-semibold">Ending</div>
            <div>
              <p>
                <span className="font-semibold">Lat:</span>
                <span> 22.2637</span>
              </p>
              <p>
                <span className="font-semibold">Long:</span>
                <span> 91.7159</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-20 overflow-hidden">
        <Map />
      </div>
    </div>
  );
}

export default App;
