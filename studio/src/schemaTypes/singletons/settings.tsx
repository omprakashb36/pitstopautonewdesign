import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'header/footer',
      title: 'Header/Footer',
    },
    {
      name: 'addThisServiceButton',
      title: 'Services',
    },

    {
      name: 'bookServiceForm',
      title: 'Service Form'
    },
    {
      name: 'brandImages',
      title: 'Brand Images'
    },
    {
      name: 'contact',
      title: 'Contact Information'
    }
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your blog.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'Used both for the <meta> description tag for SEO, and the blog subheader.',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      of: [
        // Define a minified block content field for the description. https://www.sanity.io/docs/block-content
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    // these fields are for header and footer
    defineField({
      name: 'fragmentItem',
      type: 'object',
      title: 'Fragment Item',
      group: 'header/footer',
      fields: [
        defineField({
          name: 'pitstopContact',
          type: 'string',
          title: 'Pitstop Contact'
        }),
        defineField({
          name: 'pitstopEmail',
          type: 'string',
          title: 'Pitstop Email'
        }),
        defineField({
          name: 'addressLine1',
          type: 'localeString',
          title: 'Address line 1'
        }),
        defineField({
          name: 'addressLine2',
          type: 'localeString',
          title: 'Address line 2'
        }),
        defineField({
          name: 'openTime',
          type: 'string',
          title: 'Open Time'
        }),
        defineField({
          name: 'closeTime',
          type: 'string',
          title: 'Close Time'
        }),
        defineField({
          name: 'OpenDay',
          type: 'localeString',
          title: 'Open Day'
        }),
        defineField({
          name: 'endDay',
          type: 'localeString',
          title: 'End Day'
        }),
        defineField({
          name: 'followUs',
          type: 'localeString',
          title: 'Follow Us'
        }),
        defineField({
          name: 'facebookTitle',
          type: 'localeString',
          title: 'Facebook title'
        }),
        defineField({
          name: 'facebookLink',
          title: 'Facebook Link',
          type: 'url',
        }),
        defineField({
          name: 'instagramTitle',
          type: 'localeString',
          title: 'Instagram title'
        }),
        defineField({
          name: 'instagramLink',
          title: 'Instagram Link',
          type: 'url',
        }),
        defineField({
          name: 'twitterTitle',
          type: 'localeString',
          title: 'Twitter title'
        }),
        defineField({
          name: 'twitterLink',
          title: 'Twitter Link',
          type: 'url',
        }),
        defineField({
          name: 'youtubeTitle',
          type: 'localeString',
          title: 'Youtube title'
        }),
        defineField({
          name: 'youtubeLink',
          title: 'YouTube Link',
          type: 'url',
        }),

      ]
    }),
    defineField({
      name: 'addThisService',
      type: 'localeString',
      title: 'Add to service button text',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'addVehicleToContinue',
      type: 'localeString',
      title: 'Add vehicle to continue text',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'serviceAdded',
      type: 'localeString',
      title: 'Service Added text',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'recommended',
      type: 'localeString',
      title: 'Recommended Tag',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'serviceAlert',
      type: 'localeString',
      title: 'Service Alert Text (Add the vehicle to get the estimates)',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'bookService',
      type: 'localeString',
      title: 'Ready to Book a Service Text',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'bookServiceDes',
      type: 'localeString',
      title: 'Ready to Book a Service Description',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'addVehicle',
      type: 'localeString',
      title: 'Add Vehicle Button Text',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'testimonialHeading',
      type: 'localeString',
      title: 'Testimonial Heading',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'testimonialSubHeading',
      type: 'localeString',
      title: 'Testimonial Sub Heading',
      group: 'addThisServiceButton',
    }),
    defineField({
      name: 'faqTitle',
      type: 'localeString',
      title: 'Faq Title',
      group: 'addThisServiceButton',
    }),

    // Book Service Form
    defineField({
      name: 'serviceBookForm',
      type: 'object',
      title: 'Serice Book Form',
      group: 'bookServiceForm',
      fields: [
        defineField({
          name: 'carImage',
          type: 'customImage',
          title: 'Car Image',
        }),
        defineField({
          name: 'stepOne',
          type: 'object',
          title: 'Step One',
          fields: [
            defineField({
              name: 'whiteHeading',
              type: 'localeString',
              title: 'White Heading'
            }),
            defineField({
              name: 'redHeading',
              type: 'localeString',
              title: 'Red Heading'
            }),
            defineField({
              name: 'brandLabel',
              type: 'localeString',
              title: 'Brand Label'
            }),
            defineField({
              name: 'brandPlaceholder',
              type: 'localeString',
              title: 'Brand Placeholder'
            }),
            defineField({
              name: 'modelLabel',
              type: 'localeString',
              title: 'Model Label'
            }),
            defineField({
              name: 'modelPlaceholder',
              type: 'localeString',
              title: 'Model Placeholder'
            }),
            defineField({
              name: 'yearLabel',
              type: 'localeString',
              title: 'Year Label'
            }),
            defineField({
              name: 'yearPlaceholder',
              type: 'localeString',
              title: 'Year Placeholder'
            }),
            defineField({
              name: 'numberPlateLabel',
              type: 'localeString',
              title: 'Number Plate Label'
            }),
            defineField({
              name: 'numberPlatePlaceholder',
              type: 'localeString',
              title: 'Number Plate Placeholder'
            }),
            defineField({
              name: 'proceedBtn',
              type: 'localeString',
              title: 'Proceed Button'
            })
          ]
        }),
        defineField({
          name: 'stepTwo',
          type: 'object',
          title: 'Step Two',
          fields: [
            defineField({
              name: 'whiteHeading',
              type: 'localeString',
              title: 'White Heading',
            }),
            defineField({
              name: 'redHeading',
              type: 'localeString',
              title: 'Red Heading'
            }),
            defineField({
              name: 'nameLabel',
              type: 'localeString',
              title: 'Name Label'
            }),
            defineField({
              name: 'namePlaceholder',
              type: 'localeString',
              title: 'Name Placeholder'
            }),
            defineField({
              name: 'countryLabel',
              type: 'localeString',
              title: 'Country Label'
            }),
            defineField({
              name: 'phoneLabel',
              type: 'localeString',
              title: 'Phone Label'
            }),
            defineField({
              name: 'phonePlaceholder',
              type: 'localeString',
              title: 'Phone Placeholder'
            }),
            defineField({
              name: 'emailLabel',
              type: 'localeString',
              title: 'Email Label'
            }),
            defineField({
              name: 'emailPlaceholder',
              type: 'localeString',
              title: 'Email Placeholder'
            }),
            defineField({
              name: 'proceedBtn',
              type: 'localeString',
              title: 'Proceed Button'
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'brands',
      type: 'array',
      title: 'Brands',
      group: 'brandImages',
      of: [
        defineField({
          name: 'brand',
          type: 'object',
          title: 'Brand',
          fields: [
            defineField({
              name: 'carImage',
              type: 'customImage', // your custom image type
              title: 'Brand Image',
            }),
            defineField({
              name: 'brandTitle',
              type: 'string',
              title: 'Brand Title',
            }),
            defineField({
              name: 'brandValue',
              type: 'string',
              title: 'Brand Value',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whatsAppNumber',
      type: 'string',
      title: 'WhatsApp Number',
      group: 'contact',
      description: 'Enter the phone number in international format without the + sign. For example, for a US number, enter 15551234567.',
    }),

  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
