import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-300 flex items-center p-4 justify-around">
      Home
      <h1 className="text-4xl font-bold text-blue-800">Tailwind is working</h1>
      <div className="flex items-center p-4 justify-between">
        <button
          className="bg-fuchsia-600 font-medium text-primary underline cursor-pointer"
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </button>
        <button
          className="bg-fuchsia-600 font-medium text-primary underline cursor-pointer"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;
