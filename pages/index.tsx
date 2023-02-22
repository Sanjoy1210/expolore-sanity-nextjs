import type { NextPage } from 'next'
import client from '../client'
import groq from 'groq'
import Link from 'next/link'

const Home: NextPage = ({posts}: any) => {
  // console.log({posts});
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1>Hello World</h1>
      {posts.length > 0 && posts.map(
          ({ _id = '', title = '', slug = '', publishedAt = '' }) =>
            slug && (
              <li key={title}>
                <Link href={`/post/${encodeURIComponent(slug.current)}`}>
                  {title}
                </Link>{' '}
                ({new Date(publishedAt).toDateString()})
              </li>
            )
        )}
    </div>
  )
}

export default Home

export const getStaticProps =async () => {
  const posts = await client.fetch(groq`*[_type == 'post'] | order(publishedAt desc)`)
  
  return {
    props: {
      posts
    }
  }
}