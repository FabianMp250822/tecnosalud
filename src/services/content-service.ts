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
} from 'firebase/firestore';
import type { GenerateLandingContentOutput } from '@/ai/flows/generate-landing-content-flow';
import type { Locale } from '@/lib/types';

const ARTICLES_COLLECTION = 'articles';
const DAILY_CONTENT_COLLECTION = 'dailyContent';

export type Article = GenerateLandingContentOutput['news'][0] & {
  id: string;
  createdAt: Timestamp;
  language: Locale;
};

async function getDailyContentDocument(date: string, language: Locale) {
  try {
    const docId = `${date}_${language}`;
    const docRef = doc(db, DAILY_CONTENT_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as { hero: any; articleIds: string[] }) : null;
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
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Article[];
    });

    const chunkedArticles = await Promise.all(articlePromises);
    const articles = chunkedArticles.flat();
    
    return articleIds.map(id => articles.find(article => article.id === id)).filter(Boolean) as Article[];
  } catch (error) {
    console.error("Error getting articles by IDs:", error);
    return [];
  }
}

export async function getTodaysContent(language: Locale): Promise<GenerateLandingContentOutput | null> {
  const today = new Date().toISOString().split('T')[0];
  const dailyDoc = await getDailyContentDocument(today, language);

  if (dailyDoc && dailyDoc.articleIds.length > 0) {
    const articles = await getArticlesByIds(dailyDoc.articleIds);
    return {
      hero: dailyDoc.hero,
      news: articles,
    };
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
    batch.set(articleRef, {
      ...newsItem,
      language,
      createdAt: serverTimestamp(),
    });
    articleIds.push(articleRef.id);
  });

  const dailyDocRef = doc(db, DAILY_CONTENT_COLLECTION, `${today}_${language}`);
  batch.set(dailyDocRef, {
    hero: content.hero,
    articleIds: articleIds,
    createdAt: serverTimestamp(),
  });

  await batch.commit();
}


export async function getAllArticles(language: Locale): Promise<Article[]> {
    try {
        const articlesRef = collection(db, ARTICLES_COLLECTION);
        const q = query(articlesRef, where('language', '==', language), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Article[];
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

        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as Article;
    } catch (error) {
        console.error(`Error getting article by slug ${slug}:`, error);
        return null;
    }
}
