
import { defineField, defineType } from "sanity";

export const footer = defineType({
    name: 'footer',
    title: 'Footer',
    type: 'object',
    fields: [
        defineField({
            name: 'centerFarrari',
            type: 'customImage',
            title: 'Center Farrari',
            description: 'Image size should be 546x428 pixels'
        }),
        defineField({
            name: 'servicesList',
            type: 'linkList',
            title: 'Service List',
            description: 'This link list is below copyright text'
        }),
        defineField({
            name: 'linkList',
            type: 'linkList',
            title: 'Link List',
            description: 'This link list is below Services Link List'
        }),
        defineField({
            name: 'agmcLogo',
            type: 'customImage',
            title: 'Agmc Logo',
            description: 'Image size should be 132x60 pixels'
        }),
        defineField({
            name: 'copyrightText',
            type: 'string',
            title: 'Copyright Text',
        }),
        defineField({
            name: 'footerLogo2',
            type: 'customImage',
            title: 'Footer Logo',
            description: 'Image size should be 124x133 pixels'
        }),
        defineField({
            name: 'privacyPolicyLink',
            type: 'linkList',
            title: 'Link List',
            description: 'This link list is below Social links'
          })
    ],
});
