import { defineField, defineType } from "sanity";

export default defineType({
    name: 'homeIntro',
    title: 'Home Intro',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'subheading',
            title: 'Subheading',
            type: 'string',
        }),
        defineField({
            name: 'introText',
            title: 'Intro Text',
            type: 'blockContent',
        }),
        defineField({
            name:'leftBottomImage',
            title:'Left Bottom Image',
            type:'customImage',
        }),
        defineField({
            name:'rihgtTopImage',
            title:'Right Top Image',
            type:'customImage',
        }),
    ],
    preview: {
        select: {
            heading: 'heading',
            leftBottomImage: 'leftBottomImage.asset.url',
            rightTopImage: 'rihgtTopImage.asset.url',
        },
        prepare(selection) {
            const { heading,leftBottomImage, rightTopImage } = selection;
            return {
                title: heading,
                subtitle: "Home Intro Section",
                media: leftBottomImage || rightTopImage,
            };
        },
    }
})      