import { defineField, defineType } from "sanity";
import { i18n } from '../../../language';
import { title } from "../../lib/initialValues";

export const offer = defineType({
    name: 'offer',
    type: 'document',
    title: 'Offer',
    fields:[
        defineField({
            name: 'title',
            type: 'string',
            title: 'Page Title'
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
          }),
          defineField({
            name: 'shortDescription',
            type: 'string',
            title: 'Short Description'
        }),
          defineField({
            name: 'thumbnail',
            type: 'customImage',
            title: 'Thumbnail Image',
            description: 'Image size should be 380x380 pixels',
        }),
        defineField({
            name: 'buttonText',
            type: 'string',
            title: 'Button Text'
        }),
        defineField({
            name: 'detailImage',
            type: 'customImage',
            title: 'Detail Image',
            description: 'Image size should be 1015x570 pixels',
        }),
        defineField({
            name: 'richText',
            type: 'array',
            title: 'Rich Text',
            of:[
                defineField({
                    name: 'richText',
                    type: 'object',
                    title:'Rich Texts',
                    fields:[
                        defineField({
                            name: 'offerRichText',
                            type: 'blockContent',
                            title: 'Offer Rich Text'
                        })
                    ],
                    preview:{
                        select:{
                            title: 'name'
                        }
                    }
                })
            ]
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
    preview:{
        select:{
            title: 'title',
            subtitle: 'buttonText',
            media: 'thumbnail'
        },
          
    }
})