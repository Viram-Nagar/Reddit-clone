import { Flame, Clock, TrendingUp } from "lucide-react";

const SORT_OPTIONS = [
  { value: "new", label: "New", icon: <Clock size={15} /> },
  { value: "top", label: "Top", icon: <Flame size={15} /> },
  { value: "rising", label: "Rising", icon: <TrendingUp size={15} /> },
];

const SortBar = ({ sort, onSort }) => (
  <div className="bg-white border border-gray-200 rounded-md px-2 py-1.5 flex gap-1 mb-4">
    {SORT_OPTIONS.map(({ value, label, icon }) => (
      <button
        key={value}
        onClick={() => onSort(value)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold transition-all ${
          sort === value
            ? "bg-gray-100 text-gray-900 shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <span className={sort === value ? "text-reddit-orange" : ""}>
          {icon}
        </span>
        {label}
      </button>
    ))}
  </div>
);

export default SortBar;

// import { Flame, Clock } from "lucide-react";

// const SortBar = ({ sort, onSort }) => {
//   const options = [
//     { value: "new", label: "New", icon: <Clock size={16} /> },
//     { value: "top", label: "Top", icon: <Flame size={16} /> },
//   ];

//   return (
//     <div className="bg-white border border-gray-200 rounded-md p-2 flex gap-2 mb-4">
//       {options.map(({ value, label, icon }) => (
//         <button
//           key={value}
//           onClick={() => onSort(value)}
//           className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold transition-colors ${
//             sort === value
//               ? "bg-gray-100 text-gray-900"
//               : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//           }`}
//         >
//           {icon} {label}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default SortBar;
