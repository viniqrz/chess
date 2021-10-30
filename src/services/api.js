export default async function fetchEngineAPI(fenStr) {
  const res = await fetch('https://chess.apurn.com/nextmove', {
    method: 'POST',
    body: fenStr,
  });

  return res.text();
}
