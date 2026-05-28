import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    layoutType,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "location" => {
      ...,
      locations[]{
         ...,
        "relatedServices": relatedServices[]->{
            _id,
            title,
            slug,
            _type
          }
      }
      
},
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const getHomePageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/home" : "home";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      slug,
      heading,
      subheading,
      seo,
      "pageBuilder": pageBuilder[]{
        ...,
        _type == "callToAction" => {
          ...,
          ${linkFields},
        },
        _type == "homeFleet" => {
        ...,
        aboutFleet{
        ...,
         buttonLink -> {
              _id,
              title,
              "slug": slug.current
            }
        }
        },
        _type == "carServicesList" => {
          ...,
          serviceCard[] {
             ...,
             selectServiceLink -> {
              _id,
              title,
              "slug": slug.current
            }
          }
        },
        _type == "listCars" => {
        cars[]{
          ...,
          exploreLink {
          text,
          link -> {
              _id,
              title,
              "slug": slug.current
          }
        }
        }
      },
      },
    }
  `);
};

export const faqEnQuery = defineQuery(`*[_type == 'faq' ]{
  ...,
  "question" : question.en,
  "answer" : answer.en,
}`);

export const faqArQuery = defineQuery(`*[_type == 'faq' ]{
  ...,
  "question" : question.ar,
  "answer" : answer.ar,
}`);

export const testimonialEnQuery = defineQuery(`*[_type == 'testimonials' ]{
  ...,
  "review" : review.en,
  "name" : name.en,
}`);

export const testimonialArQuery = defineQuery(`*[_type == 'testimonials' ]{
  ...,
  "review" : review.ar,
  "name" : name.ar,
}`);

//custom queries
export const headerQuery = defineQuery(`
  *[_type == "fragment" && type == "Header" && language == $language][0] {
    ...,
    header{
    ...,
    headerLink {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
            _id,
            title,
            "slug": slug.current
          }
          }
        }
      }
},
    privacyPolicyLink {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
            _id,
            title,
            "slug": slug.current
          }
          }
        }
      },
  }
  `);
  

export const footerQuery = defineQuery(`
  *[_type == "fragment" && type == "Footer" && language == $language][0] {
    footer {
    ...,
      copyrightText,
      linkList {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
            _id,
            title,
            "slug": slug.current
          }
          }
        }
      },
      privacyPolicyLink {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
            _id,
            title,
            "slug": slug.current
          }
          }
        }
      },
      servicesList {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
              _id,
              title,
              "slug": slug.current
            },
          }
        }
      },
    }
  }
`);

export const siteSettingEnQuery = defineQuery(`*[_type == 'settings' ][0]{
  ...,
  "addThisService" : addThisService.en,
  "addVehicleToContinue" : addVehicleToContinue.en,
  "serviceAdded" : serviceAdded.en,
  "recommended" : recommended.en,
  "serviceAlert" : serviceAlert.en,
  "bookService" : bookService.en,
  "bookServiceDes" : bookServiceDes.en,
  "addVehicle" : addVehicle.en,
  "testimonialHeading" : testimonialHeading.en,
  "testimonialSubHeading" : testimonialSubHeading.en,
  "faqTitle" : faqTitle.en,
  fragmentItem{
  ...,
  "addressLine1" : addressLine1.en,
  "addressLine2" : addressLine2.en,
  "OpenDay" : OpenDay.en,
  "endDay" : endDay.en,
  "followUs" : followUs.en,
  "facebookTitle" : facebookTitle.en,
  "instagramTitle" : instagramTitle.en,
  "twitterTitle" : twitterTitle.en,
  "youtubeTitle" : youtubeTitle.en,
},
serviceBookForm{
...,
carImage,
stepOne{
...,
"whiteHeading":whiteHeading.en,
"redHeading": redHeading.en,
"brandLabel": brandLabel.en,
"brandPlaceholder": brandPlaceholder.en,
"modelLabel": modelLabel.en,
"modelPlaceholder": modelPlaceholder.en,
"yearLabel": yearLabel.en,
"yearPlaceholder": yearPlaceholder.en,
"numberPlateLabel": numberPlateLabel.en,
"numberPlatePlaceholder": numberPlatePlaceholder.en,
"proceedBtn": proceedBtn.en
},
stepTwo{
...,
"whiteHeading":whiteHeading.en,
"redHeading": redHeading.en,
"nameLabel": nameLabel.en,
"namePlaceholder": namePlaceholder.en,
"countryLabel": countryLabel.en,
"phoneLabel": phoneLabel.en,
"phonePlaceholder": phonePlaceholder.en,
"emailLabel": emailLabel.en,
"emailPlaceholder": emailPlaceholder.en,
"proceedBtn": proceedBtn.en
}
}
}`);

export const siteSettingArQuery = defineQuery(`*[_type == 'settings' ][0]{
  ...,
  "addThisService" : addThisService.ar,
  "addVehicleToContinue" : addVehicleToContinue.ar,
  "serviceAdded" : serviceAdded.ar,
  "recommended" : recommended.ar,
  "serviceAlert" : serviceAlert.ar,
  "bookService" : bookService.ar,
  "bookServiceDes" : bookServiceDes.ar,
  "addVehicle" : addVehicle.ar,
  "testimonialHeading" : testimonialHeading.ar,
  "testimonialSubHeading" : testimonialSubHeading.ar,
  "faqTitle" : faqTitle.ar,
  fragmentItem{
  ...,
  "addressLine1" : addressLine1.ar,
  "addressLine2" : addressLine2.ar,
  "OpenDay" : OpenDay.ar,
  "endDay" : endDay.ar,
  "followUs" : followUs.ar,
  "facebookTitle" : facebookTitle.ar,
  "instagramTitle" : instagramTitle.ar,
  "twitterTitle" : twitterTitle.ar,
  "youtubeTitle" : youtubeTitle.ar,
},
serviceBookForm{
...,
carImage,
stepOne{
...,
"whiteHeading":whiteHeading.ar,
"redHeading": redHeading.ar,
"brandLabel": brandLabel.ar,
"brandPlaceholder": brandPlaceholder.ar,
"modelLabel": modelLabel.ar,
"modelPlaceholder": modelPlaceholder.ar,
"yearLabel": yearLabel.ar,
"yearPlaceholder": yearPlaceholder.ar,
"numberPlateLabel": numberPlateLabel.ar,
"numberPlatePlaceholder": numberPlatePlaceholder.ar,
"proceedBtn": proceedBtn.ar
},
stepTwo{
...,
"whiteHeading":whiteHeading.ar,
"redHeading": redHeading.ar,
"nameLabel": nameLabel.ar,
"namePlaceholder": namePlaceholder.ar,
"countryLabel": countryLabel.ar,
"phoneLabel": phoneLabel.ar,
"phonePlaceholder": phonePlaceholder.ar,
"emailLabel": emailLabel.ar,
"emailPlaceholder": emailPlaceholder.ar,
"proceedBtn": proceedBtn.ar
}
}
}`);

export const getOffersQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "offer" && language == "${locale}"]
  `);
};

export const getBlogQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "blog" && language == "${locale}"]
  `);
};

export const getOfferPageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/offers" : "offers";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      "pageBuilder": pageBuilder[]{
        ...,
      },
    }
  `);
};
export const getBlogPageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/blog" : "blog";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      seo,
      "pageBuilder": pageBuilder[]{
        ...,
      },
    }
  `);
};

export const getAllServicesQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "service" && language == "${locale}"]
  `);
};

export const getServicePageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/service" : "service";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      "pageBuilder": pageBuilder[]{
        ...,
      },
    }
  `);
};

export const getServiceDetailQuery = defineQuery(`
  *[_type == 'service' && slug.current == $slug][0]{
     ...,
     link -> {
              "slug": slug.current
          }
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const serviceEnQuery = defineQuery(`*[_type == 'service' && language == "en"]{
  ...,
}`);

export const serviceArQuery = defineQuery(`*[_type == 'service' && language == "ar"]{
  ...,
}`);

export const offerDetailsQuery = defineQuery(`
  *[_type == 'offer' && slug.current == $slug][0]{
     ...,
  }
`);

export const blogDetailsQuery = defineQuery(`
  *[_type == 'blog' && slug.current == $slug][0]{
     ...,
  }
`);

export const FeaturedBlogEnQuery = defineQuery(`*[_type == 'blog' && IsHomePage == true && language == "en"]{
  ...,
}`);

export const FeaturedBlogArQuery = defineQuery(`*[_type == 'blog' && IsHomePage == true && language == "ar"]{
  ...,
}`);

export const getRelatedBlogsQuery = defineQuery(`
  *[_type == "blog" && 
    _id != $currentBlogId && 
    language == $locale &&
    defined(categoryTags) &&
    (
      count((categoryTags[]._key)[@ in $tagIds]) > 0 ||
      count((categoryTags[]._ref)[@ in $tagIds]) > 0 ||
      count((categoryTags[].value)[@ in $tagIds]) > 0
    )
  ] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    blogDate,
    thumbnailImage,
    categoryTags[] {
      _key,
      label,
      value
    }
  }
`)

export const getAllBlogTagsQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "blog" && language == "${locale}" && defined(categoryTags)].categoryTags[] {
      _key,
      label,
      value
    }
  `)
}
