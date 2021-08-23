// const useCoords = () => {
//   const getCoords = (element, moment) => {
//     const squaresArr = Array.from(boardRef.current.children);
//     const index = squaresArr.findIndex((el) => el === element) + 1;
//     const curPosition = [Math.ceil(index / 8), index % 8 || 8];

//     if (moment && curPosition !== final) {
//       setFinal(curPosition);
//     } else {
//       setInitial({
//         position: curPosition,
//         square: element,
//       });
//     }

//     return curPosition;
//   };
// }

// export default useCoords;