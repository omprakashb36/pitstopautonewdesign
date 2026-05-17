import { CogIcon, FolderIcon, ClipboardIcon, TiersIcon } from '@sanity/icons'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import pluralize from 'pluralize-esm'
import { i18n } from '../../language'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title("Pages")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Pages`)
                  .schemaType('page')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Pages`)
                      .schemaType('page')
                      .filter('_type == "page" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('page-language', {
                          id: 'page-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Pages`)
                .schemaType('page')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-pages')
                    .title('All Pages')
                    .schemaType('page')
                    .filter('_type == "page"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `page`
                    )
                ),
            ])
        ),
        S.listItem()
        .title("Blog")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Blogs`)
                  .schemaType('blog')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Blogs`)
                      .schemaType('blog')
                      .filter('_type == "blog" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('blog-language', {
                          id: 'blog-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Blogs`)
                .schemaType('blog')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-blogs')
                    .title('All Blogs')
                    .schemaType('blog')
                    .filter('_type == "blog"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `blog`
                    )
                ),
            ])
        ),
      S.listItem()
        .title("Header/Footer")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Language')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toLocaleUpperCase()}`)
                  .schemaType('fragment')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Fragment`)
                      .schemaType('fragment')
                      .filter('_type == "fragment" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('fragment-language', {
                          id: 'fragment-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              // I have only added this item so that search results when clicked will load this list
              // If the intent checker above could account for it, I'd remove this item
            ])
        ),
      S.listItem()
        .title("Services")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Services`)
                  .schemaType('service')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Services`)
                      .schemaType('service')
                      .filter('_type == "service" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('service-language', {
                          id: 'service-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Services`)
                .schemaType('service')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-services')
                    .title('All services')
                    .schemaType('service')
                    .filter('_type == "service"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `service`
                    )
                ),
            ])
        ),


      S.documentTypeListItem('faq').title('FAQs').icon(ClipboardIcon),
      S.documentTypeListItem('testimonials').title('Testimonials').icon(FolderIcon),
      S.listItem()
        .title("Offers")
        .icon(TiersIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Offers`)
                  .schemaType('offer')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Offers`)
                      .schemaType('offer')
                      .filter('_type == "offer" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('offer-language', {
                          id: 'offer-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Offers`)
                .schemaType('offer')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-offers')
                    .title('All offers')
                    .schemaType('offer')
                    .filter('_type == "offer"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `offer`
                    )
                ),
            ])
        ),

      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),



    ])
