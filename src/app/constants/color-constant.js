export const API_ENDPOINTS = {
    GET_ALL_COLOR: "/Color/getAllColor",
    ADD_COLOR: "/Color/addColor",
    UPDATE_COLOR: "/Color/updateColor",
    DELETE_COLOR: "/Color/deleteColor",
    GET_ALL_COLOR_FOR_USER : "/Color/getAllColorForUser"
  };

  export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Color Name' },
    { key: 'status', label: 'Status' }
   
  ];

//   { key: 'id', label: 'S.No.' },
//   { key: 'name', label: 'Color Name' },
//   { 
//       key: 'code', 
//       label: 'Color Preview', 
//       render: (row) => {
//           console.log("Color Code from API:", row?.code); // Debugging ke liye

//           return (
//               <div 
//                   style={{
//                     width: "30px",
//                     height: "30px",
//                     borderRadius: "50%",
//                     backgroundColor: row?.code || "transparent", // API ka color dynamically lagayenge
//                     border: "1px solid #999",
//                     boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)", 
//                 }}
//               ></div>
//           );
//       }
//   },
//   { key: 'status', label: 'Status' }
//];



  