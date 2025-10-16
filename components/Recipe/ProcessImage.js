export default function ProcessImage({src, alt}){
  return <img loading="lazy" src={src} alt={alt} style={{maxWidth:'100%'}} />
}
