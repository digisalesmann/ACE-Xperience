#!/usr/bin/env bash
# setup-wendilicious-structure.sh
# Sets up the folder/file structure inside an existing `wendilicious-site` directory.
# Run: chmod +x setup-wendilicious-structure.sh && ./setup-wendilicious-structure.sh

set -euo pipefail

echo "Setting up existing project: wendilicious-site"

# Create folders if not already present
mkdir -p .next node_modules public/images styles components/{Cards,Recipe} pages/recipes

# Basic config files if missing
if [ ! -f package.json ]; then
cat <<'JSON' > package.json
{
  "name": "wendilicious-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
JSON
fi

if [ ! -f next.config.js ]; then
cat <<'JS' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
JS
fi

# Styles
cat <<'CSS' > styles/globals.css
:root {
  --sage: #8aa57b;
  --bg: #fff;
}
html, body, #__next {height: 100%;}
body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
CSS

# Components: Cards
cat <<'JS' > components/Cards/AdPlaceholder.js
export default function AdPlaceholder(){
  return (
    <div style={{border:'1px dashed #ccc', padding:12, textAlign:'center'}}>
      Ad placeholder
    </div>
  )
}
JS

cat <<'JS' > components/Cards/CategoryCard.js
import Link from 'next/link'
export default function CategoryCard({title, href}){
  return (
    <Link href={href} className="category-card">
      <div>{title}</div>
    </Link>
  )
}
JS

cat <<'JS' > components/Cards/RecipeCard.js
import Link from 'next/link'
export default function RecipeCard({recipe}){
  return (
    <article className="recipe-card">
      <Link href={`/recipes/${recipe.slug}`}>
        <img src={recipe.image} alt={recipe.title} style={{width:'100%', height:180, objectFit:'cover'}}/>
        <h3>{recipe.title}</h3>
      </Link>
    </article>
  )
}
JS

# Components: Recipe
cat <<'JS' > components/Recipe/JumpToButton.js
export default function JumpToButton({targetId='recipe'}){
  return <a href={`#${targetId}`} className="jump-to">Jump to recipe</a>
}
JS

cat <<'JS' > components/Recipe/PrintButton.js
export default function PrintButton(){
  return <button onClick={() => window.print()}>Print</button>
}
JS

cat <<'JS' > components/Recipe/ProcessImage.js
export default function ProcessImage({src, alt}){
  return <img loading="lazy" src={src} alt={alt} style={{maxWidth:'100%'}} />
}
JS

cat <<'JS' > components/Recipe/RecipeCardSchema.js
export function recipeToJsonLd(recipe){
  return {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: recipe.title,
    image: [recipe.image],
    author: {"@type": "Person", name: recipe.author || 'Wendy'},
    datePublished: recipe.datePublished || new Date().toISOString(),
    description: recipe.description || '',
    recipeIngredient: recipe.ingredients || [],
    recipeInstructions: (recipe.instructions || []).map((s,i)=>({"@type":"HowToStep","text":s}))
  }
}

export default function RecipeCardSchema({recipe}){
  const jsonLd = recipeToJsonLd(recipe)
  return (
    <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
  )
}
JS

cat <<'JS' > components/Recipe/RecipePostLayout.js
import JumpToButton from './JumpToButton'
import RecipeCardSchema from './RecipeCardSchema'

export default function RecipePostLayout({children, recipe}){
  return (
    <main>
      <RecipeCardSchema recipe={recipe} />
      <header>
        <h1>{recipe.title}</h1>
        <JumpToButton />
      </header>
      <article>{children}</article>
    </main>
  )
}
JS

cat <<'JS' > components/Recipe/ServingAdjuster.js
import { useState } from 'react'
export default function ServingAdjuster({initial=4}){
  const [servings, setServings] = useState(initial)
  return (
    <div>
      <label>Servings: {servings}</label>
      <button onClick={() => setServings(s => s+1)}>+</button>
      <button onClick={() => setServings(s => Math.max(1, s-1))}>-</button>
    </div>
  )
}
JS

# Components: Global
cat <<'JS' > components/CallToAction.js
export default function CallToAction(){
  return (
    <section className="cta">
      <h3>Join the newsletter</h3>
      <form>
        <input placeholder="email"/>
        <button>Sign up</button>
      </form>
    </section>
  )
}
JS

cat <<'JS' > components/Footer.js
export default function Footer(){
  return <footer style={{padding:20, textAlign:'center'}}>© Wendylicious</footer>
}
JS

cat <<'JS' > components/Layout.js
import Navbar from './Navbar'
import Footer from './Footer'
export default function Layout({children}){
  return (
    <div className="app-root">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
JS

cat <<'JS' > components/Navbar.js
import Link from 'next/link'
export default function Navbar(){
  return (
    <nav style={{position:'sticky', top:0, background:'#fff', zIndex:50}}>
      <div style={{display:'flex', gap:16, alignItems:'center', padding:12}}>
        <Link href="/">Wendylicious</Link>
        <Link href="/recipes">Recipes</Link>
        <Link href="/baking">Baking</Link>
      </div>
    </nav>
  )
}
JS

cat <<'JS' > components/Seo.js
import Head from 'next/head'
export default function Seo({title, description}){
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  )
}
JS

cat <<'JS' > components/ThemeToggle.js
import {useState} from 'react'
export default function ThemeToggle(){
  const [dark,setDark] = useState(false)
  return (
    <button onClick={() => {
      setDark(!dark)
      document.documentElement.dataset.theme = dark ? 'light' : 'dark'
    }}>
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
JS

# Pages
cat <<'JS' > pages/index.js
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home(){
  return (
    <Layout>
      <h1>Wendylicious</h1>
      <p>Welcome to the home of recipes.</p>
      <Link href="/recipes">Browse recipes</Link>
    </Layout>
  )
}
JS

cat <<'JS' > pages/about.js
import Layout from '../components/Layout'
export default function About(){
  return (
    <Layout>
      <h1>About Wendy</h1>
      <p>Short about page.</p>
    </Layout>
  )
}
JS

cat <<'JS' > pages/baking.js
import Layout from '../components/Layout'
export default function Baking(){
  return (
    <Layout>
      <h1>Baking</h1>
      <p>Category landing page</p>
    </Layout>
  )
}
JS

cat <<'JS' > pages/contact.js
import Layout from '../components/Layout'
export default function Contact(){
  return (
    <Layout>
      <h1>Contact</h1>
      <form>
        <input placeholder="name"/>
        <input placeholder="email"/>
      </form>
    </Layout>
  )
}
JS

cat <<'JS' > pages/recipes/index.js
import Layout from '../../components/Layout'
import RecipeCard from '../../components/Cards/RecipeCard'

const MOCK = [
  {title:'Coconut Cake', slug:'coconut-cake', image:'/images/cake.jpg'}
]

export default function Recipes(){
  return (
    <Layout>
      <h1>Recipes</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16}}>
        {MOCK.map(r => <RecipeCard key={r.slug} recipe={r} />)}
      </div>
    </Layout>
  )
}
JS

cat <<'JS' > pages/recipes/[slug].js
import Layout from '../../components/Layout'
import RecipePostLayout from '../../components/Recipe/RecipePostLayout'

export default function Slug({recipe}){
  const sample = recipe || {
    title:'Sample',
    image:'/images/cake.jpg',
    ingredients:['1 cup sugar'],
    instructions:['Mix']
  }
  return (
    <Layout>
      <RecipePostLayout recipe={sample}>
        <section id="story"><p>Recipe story goes here.</p></section>
        <section id="recipe">
          <h2>Ingredients</h2>
          <ul>{sample.ingredients.map((i,idx)=>(<li key={idx}>{i}</li>))}</ul>
        </section>
      </RecipePostLayout>
    </Layout>
  )
}
JS

echo "✔ Structure generated successfully inside existing wendilicious-site directory."
