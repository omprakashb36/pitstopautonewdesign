import { defineField, defineType } from "sanity";

export default defineType({
    name: 'imageRichText',
    title: 'Image Rich Text',
    type: 'object',
    fields: [
       defineField({
            name: 'leftImage',
            title: 'Left Image',
            type: 'customImage',
            description: 'Image size should be 694x1166 pixels',
        }),
        defineField({
            name: 'aboutAutocare',
            title: 'About Autocare',
            type: 'blockContent',
        })  
    ],
    preview: {
        select: {
            title: 'leftImage.altText',
            media: 'leftImage',
        },
        prepare(selection) {
            const { title, media } = selection;
            return {
                title: title || 'Section: Untitled',
                subtitle: 'Image Rich Text',
                media,
            };
        },
    },
})