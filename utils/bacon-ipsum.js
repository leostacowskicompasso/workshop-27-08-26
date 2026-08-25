/* 
  Reference:
    https://baconipsum.com/json-api/
*/

const BASE_URL = 'https://baconipsum.com/api/'

export default async ({ type = 'all-meat', paras = 2, sentences = null }) => {
  const params = new URLSearchParams({ type, format: 'json' })

  if (sentences) {
    params.set('sentences', sentences)
  } else {
    params.set('paras', paras)
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(
      `Falha ao consultar a API do Bacon Ipsum: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}
