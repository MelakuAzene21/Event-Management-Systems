import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


function Spinner() {
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState("black"); // Set default color to a Tailwind blue

    return (
        <div >

            <div >
                <ClipLoader
                    color={color}
                    loading={loading}
                    size={30}

                />
            </div>

            <div >
                <button
                    onClick={() => setLoading(!loading)}
                >

                </button>

                <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}

                />
            </div>

        </div>
    );
}

export default Spinner;