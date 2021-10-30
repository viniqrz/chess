export default function generatePieces() {
  const pieces = Array.from(document.querySelectorAll('.piece'));
  pieces.forEach((el) => (el.style.display = 'block'));
}
