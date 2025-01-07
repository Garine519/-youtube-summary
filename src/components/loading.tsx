import "./loading.css";

export default function Loading() {
  return (
    <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <circle
        className="spin2"
        cx="400"
        cy="400"
        fill="none"
        r="254"
        strokeWidth="44"
        stroke="#7584C2"
        strokeDasharray="1229 1400"
        strokeLinecap="round"
      />
    </svg>
  );
}
