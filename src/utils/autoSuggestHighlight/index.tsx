import React from "react";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

const handleRenderOption = (props:any, option: any, { inputValue }: any) => {
  const matches = match(option.label, inputValue);
  const parts = parse(option.label, matches);

  // const highlightStyle = {
  //   fontWeight: 700,
  //   //backgroundColor: "lightyellow",
  //   padding: "5px 2px"
  // };

  return (
    <li {...props}>
        <div>
            {parts.map((part, index) => (
            <span key={index} style={{
              fontWeight: part.highlight ? 700 : 400
              }}>
                {part.text}
            </span>
            ))}
        </div>
    </li>
  );
};

export default handleRenderOption;

//other option
// (props, option, { inputValue }) => {
//     const matches = match(option.label, inputValue);
//     const parts = parse(option.label, matches);

//     return (
//       <li {...props}>
//         <div>
//           {parts.map((part, index) => (
//             <span
//               key={index}
//               style={{
//                 fontWeight: part.highlight ? 700 : 400,
//               }}
//             >
//               {part.text}
//             </span>
//           ))}
//         </div>
//       </li>
//     );
//   }