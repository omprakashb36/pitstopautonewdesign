"use server"

import { sanityFetchCustom } from "@/sanity/lib/client";
import { faqArQuery, faqEnQuery, footerQuery, headerQuery, siteSettingArQuery, siteSettingEnQuery, testimonialArQuery, testimonialEnQuery,serviceEnQuery,serviceArQuery, FeaturedBlogEnQuery,FeaturedBlogArQuery } from "@/sanity/lib/queries";

//function to get faqs 
export async function getFaqs(params: { locale: string }): Promise<any> {
  let query = null;
    if(params.locale === 'en') {
        query = faqEnQuery;
    } 

    if(params.locale === 'ar') {
        query = faqArQuery;
    }
    if(query === null) {
        throw new Error('Error fetching Faq - Invalid locale provided');
    }

  const data = await sanityFetchCustom({
    query,
    params,
    tags: ['faq']
  });

  return data;
}

export async function getTestimonials(params: { locale: string }): Promise<any> {
  let query = null;
    if(params.locale === 'en') {
        query = testimonialEnQuery;
    } 

    if(params.locale === 'ar') {
        query = testimonialArQuery;
    }
    if(query === null) {
        throw new Error('Error fetching Testimonial - Invalid locale provided');
    }

  const data = await sanityFetchCustom({
    query,
    params,
    tags: ['testimonials']
  });

  return data;
}

//function to get header 
export async function getHeader(locale : string) : Promise<any> {
  const data = await sanityFetchCustom({
      query : headerQuery,
      params :  {language : locale},
      tags: ['fragment']
  });
  return data;
}

export async function getSiteSettingData (params: { locale: string }): Promise<any> {
  let query = null;
    if(params.locale === 'en') {
        query = siteSettingEnQuery;
    } 

    if(params.locale === 'ar') {
        query = siteSettingArQuery;
    }
    if(query === null) {
        throw new Error('Error fetching SiteSettingData - Invalid locale provided');
    }

  const data = await sanityFetchCustom({
    query,
    params,
    tags: ['settings']
  });

  return data;
}



//function to get footer 
export async function getFooter(locale : string) : Promise<any> {
  const data = await sanityFetchCustom({
      query : footerQuery,
      params :  {language : locale},
      tags: ['fragment']
  });
  return data;
}

export async function getServiceList(params: { locale: string }): Promise<any> {
  let query = null;
    if(params.locale === 'en') {
        query = serviceEnQuery;
    } 

    if(params.locale === 'ar') {
        query = serviceArQuery;
    }
    if(query === null) {
        throw new Error('Error fetching Service - Invalid locale provided');
    }

  const data = await sanityFetchCustom({
    query,
    params,
    tags: ['service']
  });

  return data;
}


export async function getFeaturedBlog(params: { locale: string }): Promise<any> {
  let query = null;
    if(params.locale === 'en') {
        query = FeaturedBlogEnQuery;
    } 

    if(params.locale === 'ar') {
        query = FeaturedBlogArQuery;
    }
    if(query === null) {
        throw new Error('Error fetching FeaturedBlog - Invalid locale provided');
    }

  const data = await sanityFetchCustom({
    query,
    params,
    tags: ['blog']
  });

  return data;
}