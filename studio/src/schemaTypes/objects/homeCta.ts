import { defineField, defineType } from "sanity";

export default defineType({
    name: 'homeCta',
    title: 'Home CTA',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),    
        defineField({
            name: 'subHeading',
            title: 'Sub Heading',
            type: 'string',
        }),
        defineField({
            name:"leftImage",
            title:"Left Image",
            type:"customImage",
            description: 'Image size should be 536x523 pixels',
        }),
        defineField({
            name:"mobileLeftImage",
            title:"Mobile Image",
            type:"customImage",
            description: 'Image size should be 350x223 pixels',
        }),
        defineField({
            name: 'ButtonUrl',
            title: 'Button URL',
            type: 'callToAction',
        }),    
    ],
    preview: {
        select: {
            title: 'heading',
            subtitle: 'subHeading',
            leftImage: 'leftImage',
        },
        prepare({ title, subtitle, leftImage }) {
            return {
                title: title || 'Home CTA',
                subtitle:'Home CTA',
                media: leftImage,
            };
        },
    },  
});