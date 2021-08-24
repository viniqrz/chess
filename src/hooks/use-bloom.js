const useBloom = (piecesRef) => {
  const bloom = (checkedSide) => {
    [...piecesRef.current.children].find((el) =>
      el.className.includes(checkedSide + 'King')
    ).style.background =
      'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 100%)';
  };

  const clearBloom = (checkedSide) => {
    const checkedKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(checkedSide + 'King')
    );
    checkedKing.style.background = 'none';
  };

  return [bloom, clearBloom];
}

export default useBloom;