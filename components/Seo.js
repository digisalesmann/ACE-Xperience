import Head from 'next/head'
export default function Seo({title, description}){
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  )
}
