import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";

export const service = defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
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
            name: 'serviceIcon',
            title: 'Service Icon',
            type: 'customImage',
            group: 'basic',
            description: 'Image size should be 80x80 pixels',
        }),
        defineField({
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'customImage',
            description: 'Image size should be 200x200 pixels',
            group: 'basic',
        }),
        defineField({
            name:'shceduleNow',
            title:'Thumbnail schedule Now',
            type: 'string'
        }),
        defineField({
            name: 'pageBuilder',
            title: 'Page builder',
            type: 'array',
            of: [
                { type: 'serviceCard' },
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
            name: 'noVehicleImage',
            title: 'No Vehicle Image',
            type: 'customImage'
        }),
        defineField({
            name:'noVehicleHeading',
            title: 'No Vehicle Heading',
            type: 'string',
        }),
        defineField({
            name:'noVehicleText',
            title: 'No Vehicle Text',
            type: 'string',
        }),
        defineField({
            name: 'addVehicleLabel',
            title: 'Add Vehicle Label ',
            type: 'string',
        }),
        defineField({
            name: 'emptyCartCarImage',
            title: 'Empty Cart Car Image',
            type: 'customImage'
        }),
        defineField({
            name:'heading',
            type:'string',
            title: 'Empty Cart Heading'
        }),
        defineField({
            name:'subHeading',
            type:'string',
            title: 'Empty Cart SubHeading'
        }),
        defineField({
            name: 'browseServiceCtaLabel',
            title: 'Browse Service CTA Label',
            type: 'string',
            group: 'basic',
        }),
        defineField({
            name: 'changeCtaLabel',
            title: 'Change CTA Label',
            type: 'string',
            group: 'basic',
        }),
        defineField({
            name: 'cartLabel',
            title: 'Cart Label',
            type: 'string',
            group: 'basic',
        }),
        defineField({
            name: 'estimatedTotalLabel',
            title: 'Estimated Total Label',
            type: 'string',
            group: 'basic',
        }),
        defineField({
            name: 'taxLabel',
            title: 'Tax Label',
            type: 'string',
            group: 'basic',
        }),
        defineField({
            name: 'submitCtaLabel',
            title: 'Submit CTA Label',
            type: 'string',
            group: 'basic',
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