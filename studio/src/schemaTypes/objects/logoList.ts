import { defineField, defineType } from "sanity";

export default defineType({
    name: 'logoList',
    title: 'Logo List',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'logoList',
            title: 'Logo List',
            type: 'array',
            of:[
                defineField({
                    name:'logo',
                    title: "Logo",
                    type: 'object',
                    fields:[
                        defineField({
                            name:'logoImage',
                            title: "Logo Image",
                            type: 'customImage',
                            description: 'image size should be 120x120 pixels'
                        })
                    ]
                })
            ],
        })        
    ],
    preview:{
        select: {
            title: 'heading',
            media: 'logoList.0.logoImage'
        },
        prepare(selection) {
            const { title, media } = selection;
            return {
                title: title || 'Logo List',
                subtitle: 'Logo List Section',
                media: media || undefined,
            };
        },
    }
});