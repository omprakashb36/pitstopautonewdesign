import { defineField, defineType } from "sanity";

export const homeBlog = defineType({
    name: 'homeBlog',
    title: 'Home Blog Section',
    type: 'object',
    fields: [
        defineField({
            name: 'sectionTitle',
            title: 'Section Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sectionSubTitle',
            title: 'Section Sub Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'allArticleButton',
            title: 'All Articles Button',
            type: 'callToAction',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'sectionTitle',
        },
    },
})