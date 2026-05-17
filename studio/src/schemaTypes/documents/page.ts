import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import { i18n } from '../../../language'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'basic', title: 'Basic' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
      group: 'basic',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of : [  
        {type: 'callToAction'}, 
        {type: 'infoSection'} , 
        {type: 'homeTesla'} , 
        {type: 'homeIntro'} , 
        {type: 'homeFleet'},
        {type: 'scrollContent'},
        {type: 'imageRichText'},
        {type: 'richTextTitle'},
        {type: 'homeCta'},
        {type: 'homeWorkFlow'},
        {type: 'homeHeroSlider'}, 
        {type: 'termsAndConditionSection'},
        {type: 'carServicesList'},
        {type: 'logoList'},
        {type: 'testimonial'},
        {type: 'faqSection'},
        {type : 'serviceListing'},
        {type : 'serviceBooked'},
        {type : 'serviceBookedTesla'},
        {type : 'serviceCart'},
        {type : 'location'},
        {type : 'extendedWarrantyForm'},
        {type : 'contactUsForm'},
        {type : 'fleetManagement'},
        {type: 'teslaForm'},
        {type : 'homeBlog'},
      ],

      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    defineField({
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields',
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: i18n.languages.map((l) => l.id),
        layout: 'dropdown',
      },
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      locale: 'language',
    },
    prepare({ title, subtitle, locale }) {
      return {
        title,
        subtitle: `locale : ${locale}, slug : ${subtitle}`,
      };
    },
  },
})
