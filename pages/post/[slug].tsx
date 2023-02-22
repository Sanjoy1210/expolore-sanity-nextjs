import groq from 'groq';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import client from '../../client';

const urlFor = (source: any) => {
  return imageUrlBuilder(client).image(source);
}

const ptComponents = {
  types: {
    image: ({value}: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img 
          alt={value.alt || ''}
          loading='lazy'
          src={urlFor(value).width(320).height(240).fit('max').auto('format').url()}
        />
      )
    }
  }
}


const Post = ({post}: any) => {
  const {title, name, categories, authorImage, body = []} = post;
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {
        categories ? (
          <ul>
            Posted in 
            {categories?.map((category: any) => <li key={category}>{category}</li>)}
          </ul>
        ) : null
      }
      {
        authorImage ? (
          <div>
            <Image src={urlFor(authorImage).width(50).url()} alt="author" width={50} height={50} />
          </div>
        ) : null
      }

      <PortableText value={body} components={ptComponents}/>
    </article>
  )
}

export default Post;


const query = groq`*[_type == 'post' && slug.current == $slug][0]{
  title,
  'name': author->name,
  'categories': categories[]->title,
  'authorImage': author->image,
  body
}`

export const getStaticPaths = async () => {
  const paths = await client.fetch(
    `*[_type == 'post' && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug: any) => ({params: {slug}})),
    fallback: false,
  }
}

export const getStaticProps =async (context: any) => {
  const {slug = ''} = context.params;
  const post = await client.fetch(query, {slug})

  return {
    props: {
      post
    }
  }
}