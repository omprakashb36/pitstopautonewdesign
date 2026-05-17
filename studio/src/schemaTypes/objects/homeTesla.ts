import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'homeTesla',
    title: 'Home Tesla/Lucid',
    type: 'object',
    fields: [
        defineField({
            name: 'brand',
            title: 'Brand',
            type: 'string',
            validation: Rule => Rule.required(),
            options: {
                list: [
                    { title: 'Tesla', value: 'tesla' },
                    { title: 'Lucid', value: 'lucid' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
        }),
        defineField({
            name: 'marginBottom',
            title: 'Spacing Bottom',
            type: 'boolean',
            description: 'Enable or disable bottom Spacing',
        }),
        defineField({
            name: 'imageAlign',
            title: 'Featured Image Alignment',
            type: 'string',
            description: 'Choose image alignment',
            options: {
                list: [
                    { title: 'Left', value: 'left' },
                    { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'leftImage',
            title: 'Featured Image',
            type: 'customImage',
            description: 'Image size should be 940x811 pixels',
        }),
        defineField({
            name: 'bottmRightImage',
            title: 'Bottom Logo Image',
            type: 'customImage',

        }),
        defineField({
            name: 'aboutTesla',
            title: 'About Section',
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
                    name: 'decription',
                    title: 'Description',
                    type: 'text',
                }),
                defineField({
                    name: 'topLogo',
                    title: 'Top Logo',
                    type: 'customImage',
                    description: 'Image size should be 90x117 pixels',
                }),
                defineField({
                    name: 'BottomLogo',
                    title: 'Bottom Logo',
                    type: 'customImage',
                    description: 'Image size should be 470x62 pixels',
                }),
                defineField({
                    name: 'button',
                    title: 'Button',
                    type: 'callToAction',
                }),
            ],
        }),
        defineField({
            name: 'teslaForm',
            type: 'teslaForm',
            title: 'Form'
        })
    ],
    preview: {
        select: {
            title: 'aboutTesla.heading',
            media: 'leftImage',
        },
        prepare(selection) {
            const { title, media } = selection;
            return {
                title: title || 'Home Tesla/Lucid',
                subtitle: 'Home Tesla/Lucid Section',
                media: media,
            };
        },
    },
});
