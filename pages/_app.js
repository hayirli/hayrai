import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HayrAI - Etik Akademik Araştırma Rehberi</title>
        <meta name="description" content="Yapay zekâ destekli etik akademik araştırma rehberi. Profesörlerden araştırma görevlilerine tüm akademisyenlere rehberlik." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f5fb; }
        select { color: #1a2b3d; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        button { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
