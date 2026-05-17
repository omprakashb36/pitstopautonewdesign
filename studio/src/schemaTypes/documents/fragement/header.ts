import { defineField, defineType } from "sanity";

export const header=defineType({
    name: 'header',
    type: 'object',
    title: 'Header',
    fields: [
        defineField({
            name: 'callUs',
            type: 'string',
            title: 'Call us'
        }),
        defineField({
            name: 'contact',
            type: 'string',
            title: 'Contact'
        }),
        defineField({
            name: 'lang',
            type: 'localeString',
            title: 'Languege',
        }),
        defineField({
            name: 'headerLogo',
            type: 'customImage',
            title: 'Header Logo',
            description: 'Image size should be 100x107 pixels'
        }),
        defineField({
            name: 'cornerLogo',
            type: 'string',
            title: 'Corner Logo',
            
        }),
        defineField({
            name: 'headerLink',
            type: 'linkList',
            title: 'Header Link List',
            description: 'This list contains the page links.'
          }),
        defineField({
            name: 'privacyPolicyLink',
            type: 'linkList',
            title: 'Link List',
            description: 'This link list is below Social links'
          })

    ]
})