'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  serverTimestamp,
  limit,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { GenerateLandingContentOutput } from '@/ai/flows/generate-landing-content-flow';
import type { Locale } from '@/lib/types';

const ARTICLES_COLLECTION = 'articles';
const DAILY_CONTENT_COLLECTION = 'dailyContent';

// Define a more specific type for the daily content document from Firestore
type DailyContentDoc = {
    hero: GenerateLandingContentOutput['hero'];
    articleIds: string[];
};

export type Article = GenerateLandingContentOutput['news'][0] & {
  id: string;
  createdAt: string; // Serialized for client components
  language: Locale;
};

// Helper to convert Firestore doc to a serializable Article object
const processArticleDoc = (doc: QueryDocumentSnapshot<DocumentData>): Article => {
    const data = doc.data();
    const timestamp = data.createdAt as Timestamp;
    return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        details: data.details,
        imageHint: data.imageHint,
        imageUrl: data.imageUrl,
        language: data.language,
        createdAt: timestamp ? timestamp.toDate().toISOString() : new Date().toISOString(),
    };
}


async function getDailyContentDocument(date: string, language: Locale) {
  try {
    const docId = `${date}_${language}`;
    const docRef = doc(db, DAILY_CONTENT_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as DailyContentDoc) : null;
  } catch (error) {
    console.error(`Error getting daily content document for ${date}_${language}:`, error);
    return null;
  }
}

async function getArticlesByIds(articleIds: string[]): Promise<Article[]> {
  if (!articleIds || articleIds.length === 0) return [];

  try {
    const chunks: string[][] = [];
    for (let i = 0; i < articleIds.length; i += 30) {
      chunks.push(articleIds.slice(i, i + 30));
    }

    const articlePromises = chunks.map(async (chunk) => {
      const articlesRef = collection(db, ARTICLES_COLLECTION);
      const q = query(articlesRef, where('__name__', 'in', chunk));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(processArticleDoc);
    });

    const chunkedArticles = await Promise.all(articlePromises);
    const articles = chunkedArticles.flat();
    
    // Re-order based on original articleIds
    return articleIds.map(id => articles.find(article => article.id === id)).filter(Boolean) as Article[];
  } catch (error) {
    console.error("Error getting articles by IDs:", error);
    return [];
  }
}

export async function getTodaysContent(language: Locale): Promise<GenerateLandingContentOutput | null> {
  const today = new Date().toISOString().split('T')[0];
  try {
    const dailyDoc = await getDailyContentDocument(today, language);

    if (dailyDoc && dailyDoc.articleIds.length > 0) {
      const articles = await getArticlesByIds(dailyDoc.articleIds);
      // We don't need to return null if some articles are missing, just return the ones we found.
      return {
        hero: dailyDoc.hero,
        news: articles,
      };
    }
  } catch (error) {
    console.error(`Error in getTodaysContent for ${language}:`, error);
  }
  return null;
}

export async function saveDailyContent(
  content: GenerateLandingContentOutput,
  language: Locale
): Promise<void> {
  const batch = writeBatch(db);
  const today = new Date().toISOString().split('T')[0];

  const articleIds: string[] = [];

  content.news.forEach(newsItem => {
    const articleRef = doc(collection(db, ARTICLES_COLLECTION));
    
    // Create a mutable copy to avoid side effects
    const articleData = { ...newsItem };

    // Firestore throws an error if a field value is `undefined`.
    // If imageUrl doesn't exist, we just don't include the field in the document.
    if (articleData.imageUrl === undefined) {
      delete (articleData as Partial<typeof articleData>).imageUrl;
    }

    batch.set(articleRef, {
      ...articleData,
      language,
      createdAt: serverTimestamp(),
    });
    articleIds.push(articleRef.id);
  });

  // Similarly, clean the hero object before saving.
  const heroData = { ...content.hero };
  if (heroData.imageUrl === undefined) {
    delete (heroData as Partial<typeof heroData>).imageUrl;
  }

  const dailyDocRef = doc(db, DAILY_CONTENT_COLLECTION, `${today}_${language}`);
  batch.set(dailyDocRef, {
    hero: heroData,
    articleIds: articleIds,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error committing batch to save daily content:", error);
  }
}


export async function getAllArticles(language: Locale): Promise<Article[]> {
    try {
        const articlesRef = collection(db, ARTICLES_COLLECTION);
        // Query by language only, to avoid needing a composite index.
        const q = query(articlesRef, where('language', '==', language));
        const querySnapshot = await getDocs(q);
        const articles = querySnapshot.docs.map(processArticleDoc);

        // Sort in-memory by date (descending)
        articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        return articles;
    } catch (error) {
        console.error(`Error getting all articles for language ${language}:`, error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const articlesRef = collection(db, ARTICLES_COLLECTION);
        const q = query(articlesRef, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const docSnap = querySnapshot.docs[0];
        return processArticleDoc(docSnap);
    } catch (error) {
        console.error(`Error getting article by slug ${slug}:`, error);
        return null;
    }
}
