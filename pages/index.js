import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Home({ launches }) {
  console.log('launches',launches)
  return (
    <div className={styles.container}>
      <Head>
        <title> SpaceX Past Launches</title>
      
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SpaceX Past Launches
        </h1>

        <div className={styles.grid}>
        
        {launches.map(launch => {
            return (
            <a key={launch.id} href={launch.links.article_link} target="_blank" className={styles.card}>
            <img className={styles.img} src={launch.links.flickr_images} />
            
            <h3>{ launch.mission_name }</h3>
            <h3>{ launch.launch_site.site_name_long }</h3>
              <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
             </a>
            );
          })}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
  launchesPast(limit: 12) {
    id
    mission_name
    launch_date_local
    launch_site {
      site_name_long
    }
    links {
      article_link
      video_link
      mission_patch
      flickr_images
      wikipedia
    }
    rocket {
      rocket_name
    }
    
  }
}

    `
  });

  return {
    props: {
      launches: data.launchesPast
    }, // will be passed to the page component as props
  }
}